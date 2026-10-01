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


def classify_binding(percentile_rank: float) -> tuple[str, str]:
    """
    Apply semaphore classification based on percentile rank.

    Rules:
        percentile_rank <= 0.5  → Strong (Green #22c55e)
        0.5 < percentile_rank <= 2.0 → Intermediate (Yellow #eab308)
        percentile_rank > 2.0  → Weak (Gray #64748b)

    Args:
        percentile_rank: The percentile rank value from IEDB

    Returns:
        Tuple of (binding_affinity label, hex color code)
    """
    if percentile_rank <= 0.5:
        return "Strong", "#22c55e"
    elif percentile_rank <= 2.0:
        return "Intermediate", "#eab308"
    else:
        return "Weak", "#64748b"


def parse_iedb_response(raw_text: str) -> list[dict]:
    """
    Parse the IEDB MHC-I API tab-separated response into structured data
    with binding affinity classification.

    The IEDB API returns TSV data with columns that vary by method.
    Common columns include: allele, seq_num, start, end, length, peptide,
    and one or more score/rank columns.

    Args:
        raw_text: Raw TSV text from the IEDB API

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
        classifications = df[rank_col].apply(classify_binding)
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
