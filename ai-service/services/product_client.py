"""
Backwards-compatibility wrapper for product_service.
"""

from .product_service import (
    CATEGORY_KEYWORDS,
    KNOWN_BRANDS,
    extract_search_filters,
    fetch_matching_products,
    fetch_products_by_names,
    format_card,
    format_products_for_context,
    format_products_for_comparison_context,
)

__all__ = [
    "CATEGORY_KEYWORDS",
    "KNOWN_BRANDS",
    "extract_search_filters",
    "fetch_matching_products",
    "fetch_products_by_names",
    "format_card",
    "format_products_for_context",
    "format_products_for_comparison_context",
]
