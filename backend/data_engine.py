"""
Data Engine Module
Parses raw TSV responses from the IEDB API and applies the semaphore
classification rules based on percentile_rank values.
"""

import pandas as pd
from io import StringIO
from typing import Optional
import logging
import re

logger = logging.getLogger(__name__)


def classify_binding(percentile_rank: float, mhc_class: str = "I") -> tuple[str, str]:
    """
    Apply semaphore classification based on percentile rank.

    Args:
        percentile_rank: The percentile rank value from IEDB
        mhc_class: "I" or "II"

    Returns:
        Tuple of (binding_affinity label, hex color code)
    """
    if mhc_class == "I":
        if percentile_rank <= 0.5:
            return "Strong", "#22c55e"
        elif percentile_rank <= 2.0:
            return "Intermediate", "#eab308"
        else:
            return "Weak", "#64748b"
    else:
        # MHC-II thresholds
        if percentile_rank <= 2.0:
            return "Strong", "#22c55e"
        elif percentile_rank <= 10.0:
            return "Intermediate", "#eab308"
        else:
            return "Weak", "#64748b"


def parse_iedb_response(raw_text: str, mhc_class: str = "I") -> list[dict]:
    """
    Parse the IEDB MHC API tab-separated response into structured data
    with binding affinity classification.

    Args:
        raw_text: Raw TSV text from the IEDB API
        mhc_class: "I" or "II"

    Returns:
        List of dictionaries with parsed and classified results

    Raises:
        ValueError: If the response cannot be parsed
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("Empty response from IEDB API")

    try:
        # The IEDB response is tab-separated with a header row
        df = pd.read_csv(StringIO(raw_text), sep="\t")

        # Clean column names (strip whitespace from headers)
        df.columns = df.columns.str.strip()

        logger.info(f"Parsed {len(df)} rows with columns: {list(df.columns)}")

        # Identify the percentile_rank column
        # IEDB may return it as 'percentile_rank' or other variations
        rank_col = _find_rank_column(df.columns.tolist())

        if rank_col is None:
            raise ValueError(
                f"Could not find a percentile_rank column. "
                f"Available columns: {list(df.columns)}"
            )

        # Ensure the rank column is numeric
        df[rank_col] = pd.to_numeric(df[rank_col], errors="coerce")

        # Drop rows where rank is NaN
        before_count = len(df)
        df = df.dropna(subset=[rank_col])
        if len(df) < before_count:
            logger.warning(
                f"Dropped {before_count - len(df)} rows with non-numeric rank values"
            )

        # Apply semaphore classification
        classifications = df[rank_col].apply(lambda x: classify_binding(x, mhc_class))
        df["binding_affinity"] = classifications.apply(lambda x: x[0])
        df["color_code"] = classifications.apply(lambda x: x[1])

        # Normalize column names to standard output format
        result_df = _normalize_columns(df, rank_col)

        # Convert to list of dicts for JSON serialization
        records = result_df.to_dict(orient="records")

        # Ensure numeric types are JSON-serializable (handle NaN, inf)
        for record in records:
            for key, value in record.items():
                if isinstance(value, float):
                    if pd.isna(value) or value == float("inf"):
                        record[key] = None

        return records

    except pd.errors.EmptyDataError:
        raise ValueError("IEDB returned empty or malformed data")
    except pd.errors.ParserError as e:
        raise ValueError(f"Failed to parse IEDB response as TSV: {str(e)}")


def _find_rank_column(columns: list[str]) -> Optional[str]:
    """
    Find the percentile rank column from IEDB response headers.
    The column name varies depending on the prediction method used.

    Priority order:
    1. 'percentile_rank' (exact match)
    2. Any column containing 'percentile_rank'
    3. Any column containing 'rank' (fallback)
    """
    # Exact match
    if "percentile_rank" in columns:
        return "percentile_rank"

    # Partial match for percentile_rank
    for col in columns:
        if "percentile_rank" in col.lower():
            return col

    # Fallback: look for any rank column
    for col in columns:
        if "rank" in col.lower() and "percentile" in col.lower():
            return col

    # Last resort: any rank column
    for col in columns:
        if col.lower().endswith("_rank") or col.lower() == "rank":
            return col

    return None


def _normalize_columns(df: pd.DataFrame, rank_col: str) -> pd.DataFrame:
    """
    Normalize the DataFrame to have consistent column names regardless
    of the IEDB method used.

    Standard output columns:
    - allele, seq_num, start, end, length, peptide, percentile_rank,
      binding_affinity, color_code
    """
    # Map of possible IEDB column names to our standard names
    column_mapping = {
        "allele": "allele",
        "seq_num": "seq_num",
        "start": "start",
        "end": "end",
        "length": "length",
        "peptide": "peptide",
    }

    # Rename the rank column to our standard
    if rank_col != "percentile_rank":
        df = df.rename(columns={rank_col: "percentile_rank"})

    # Keep only the columns we need, plus any extra score columns
    standard_cols = [
        "allele", "seq_num", "start", "end", "length", "peptide",
        "percentile_rank", "binding_affinity", "color_code",
    ]

    # Build the list of columns to include
    # First include standard columns that exist
    output_cols = [col for col in standard_cols if col in df.columns]

    # Then include any additional score columns (ic50, etc.) that might be useful
    extra_cols = [
        col for col in df.columns
        if col not in output_cols and (
            "ic50" in col.lower() or
            "score" in col.lower() or
            "method" in col.lower()
        )
    ]
    output_cols.extend(extra_cols)

    return df[output_cols]


def parse_bcell_response(raw_text: str, method: str) -> list[dict]:
    """
    Parse the IEDB B Cell API tab-separated response.
    Returns: List of dictionaries.
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("Empty response from IEDB API")

    try:
        df = pd.read_csv(StringIO(raw_text), sep="\t")
        df.columns = df.columns.str.strip()

        # Rename to lowercase standard
        df.columns = [c.lower() for c in df.columns]

        if "score" not in df.columns:
            raise ValueError(f"Could not find a score column. Available: {list(df.columns)}")

        df["score"] = pd.to_numeric(df["score"], errors="coerce")
        df = df.dropna(subset=["score"])

        # Basic classification based on typical thresholds
        # Note: True thresholds vary strictly by algorithm, using simple heuristics for UI colors
        def classify_bcell(score, m):
            m = m.lower()
            if "bepipred" in m:
                return ("Strong", "#22c55e") if score >= 0.35 else ("Weak", "#64748b")
            elif "emini" in m:
                return ("Strong", "#22c55e") if score >= 1.0 else ("Weak", "#64748b")
            elif "kolaskar" in m:
                return ("Strong", "#22c55e") if score >= 1.0 else ("Weak", "#64748b")
            else:
                return ("Intermediate", "#eab308") if score > 0.8 else ("Weak", "#64748b")

        classifications = df["score"].apply(lambda x: classify_bcell(x, method))
        df["binding_affinity"] = classifications.apply(lambda x: x[0])
        df["color_code"] = classifications.apply(lambda x: x[1])

        # Ensure we map 'peptide' if it exists, and 'start' / 'end'
        if "peptide" not in df.columns and "residue" in df.columns:
            df["peptide"] = df["residue"]  # B cell sometimes outputs single residues

        records = df.to_dict(orient="records")

        for record in records:
            for key, value in record.items():
                if isinstance(value, float):
                    if pd.isna(value) or value == float("inf"):
                        record[key] = None

        return records

    except pd.errors.EmptyDataError:
        raise ValueError("IEDB returned empty or malformed data")
    except pd.errors.ParserError as e:
        raise ValueError(f"Failed to parse IEDB response as TSV: {str(e)}")

