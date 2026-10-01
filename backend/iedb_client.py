"""
IEDB API Client Module
Handles async HTTP communication with the IEDB MHC Class I prediction API.
Implements retry logic, timeout handling, and error structuring.
"""

import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

IEDB_URL = "https://tools-cluster-interface.iedb.org/tools_api/mhci/"
DEFAULT_TIMEOUT = 300.0  # 5 minutes
MAX_RETRIES = 2


class IEDBError(Exception):
    """Custom exception for IEDB API errors."""

    def __init__(self, message: str, status_code: Optional[int] = None):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


async def call_iedb(
    method: str,
    sequence_text: str,
    allele: str,
    length: str,
    timeout: float = DEFAULT_TIMEOUT,
) -> str:
    """
    Make a POST request to the IEDB MHC-I prediction API.

    Args:
        method: Prediction method (e.g., 'netmhcpan_el', 'ann', 'smm')
        sequence_text: Protein sequences (FASTA or newline-separated)
        allele: Comma-separated allele list (paired with length)
        length: Comma-separated length list (paired with allele)
        timeout: Request timeout in seconds

    Returns:
        Raw TSV response text from the IEDB API

    Raises:
        IEDBError: On API errors, timeouts, or connection failures
    """
    payload = {
        "method": method,
        "sequence_text": sequence_text,
        "allele": allele,
        "length": length,
    }

    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            logger.info(
                f"IEDB API call attempt {attempt}/{MAX_RETRIES} — "
                f"method={method}, alleles={allele}, lengths={length}"
            )

            async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
                response = await client.post(IEDB_URL, data=payload)

            # Check for HTTP errors
            if response.status_code >= 500:
                logger.warning(
                    f"IEDB returned {response.status_code} on attempt {attempt}"
                )
                last_error = IEDBError(
                    f"IEDB server error (HTTP {response.status_code})",
                    status_code=response.status_code,
                )
                if attempt < MAX_RETRIES:
                    continue
                raise last_error

            if response.status_code >= 400:
                error_text = response.text[:500]
                raise IEDBError(
                    f"IEDB request error (HTTP {response.status_code}): {error_text}",
                    status_code=response.status_code,
                )

            raw_text = response.text.strip()

            # IEDB sometimes returns error messages as plain text
            if not raw_text:
                raise IEDBError("IEDB returned an empty response.")

            # Check if the response looks like an error message (no tabs = not TSV)
            if "\t" not in raw_text and len(raw_text) < 500:
                raise IEDBError(f"IEDB returned an error: {raw_text}")

            logger.info(
                f"IEDB API call successful — received {len(raw_text)} bytes"
            )
            return raw_text

        except httpx.TimeoutException:
            last_error = IEDBError(
                "Tempo limite excedido na comunicação com o IEDB. "
                "O lote pode ser muito grande. Tente reduzir o número de sequências."
            )
            if attempt < MAX_RETRIES:
                logger.warning(f"IEDB timeout on attempt {attempt}, retrying...")
                continue
            raise last_error

        except httpx.ConnectError:
            raise IEDBError(
                "Erro de conexão com o servidor do IEDB. "
                "Verifique sua conexão com a internet ou tente novamente mais tarde."
            )

        except httpx.RequestError as e:
            raise IEDBError(
                f"Erro de comunicação com o servidor governamental. "
                f"O IEDB pode estar em manutenção ou o lote é muito grande. "
                f"Tente reduzir o número de sequências. Detalhes: {str(e)}"
            )

    # Should not reach here, but just in case
    if last_error:
        raise last_error
    raise IEDBError("Erro inesperado na comunicação com o IEDB.")
