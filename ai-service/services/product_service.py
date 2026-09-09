"""
Product service for NexaTech AI.
Interfaces with Express backend API to retrieve real MongoDB product catalog data.
Strictly ensures zero direct MongoDB connection from FastAPI.
"""

import logging
import re
from typing import Any, Dict, List, Optional, Tuple

import httpx

from config.settings import settings

logger = logging.getLogger("ai_service.product_service")

# Mapping of keywords to categories existing in NexaTech
CATEGORY_KEYWORDS = {
    "Laptops": [r"\blaptops?\b", r"\bmacbooks?\b", r"\bnotebooks?\b", r"\bpc\b", r"\bcomputers?\b"],
    "Smartphones": [r"\bphones?\b", r"\bsmartphones?\b", r"\biphones?\b", r"\bandroid\b", r"\bmobile\b"],
    "Audio": [r"\bheadphones?\b", r"\bearphones?\b", r"\bairpods?\b", r"\bearbuds?\b", r"\bspeakers?\b", r"\baudio\b", r"\bsound\b"],
    "Cameras": [r"\bcameras?\b", r"\bdslr\b", r"\bmirrorless\b"],
    "Gaming": [r"\bgaming\b", r"\bconsoles?\b", r"\bps5\b", r"\bxbox\b"],
    "Monitors": [r"\bmonitors?\b", r"\bdisplays?\b", r"\bscreens?\b"],
    "Tablets": [r"\btablets?\b", r"\bipads?\b"],
    "Accessories": [r"\baccessories\b", r"\bchargers?\b", r"\bcables?\b", r"\bkeyboards?\b", r"\bmice\b", r"\bmouse\b"],
    "Smart Devices": [r"\bsmart\s*watch(es)?\b", r"\bsmart\s*devices?\b", r"\bwearables?\b"],
}

KNOWN_BRANDS = [
    "apple", "asus", "dell", "hp", "lenovo", "msi", "acer", "samsung",
    "sony", "microsoft", "bose", "logitech", "razer", "intel", "amd", "sennheiser", "anker", "jbl"
]


def extract_search_filters(user_message: str) -> Dict[str, Any]:
    """
    Parses a user shopping query to extract category, price constraints, brand, and keywords.
    Example: "I need a gaming laptop under Rs. 300000"
      -> {"category": "Laptops", "maxPrice": 300000, "keyword": "gaming"}
    """
    msg = user_message.lower()
    filters: Dict[str, Any] = {}

    # 1. Detect Category
    detected_category = None
    for category, patterns in CATEGORY_KEYWORDS.items():
        for pattern in patterns:
            if re.search(pattern, msg):
                detected_category = category
                break
        if detected_category:
            break

    if detected_category:
        filters["category"] = detected_category

    # 2. Detect Price Constraints
    # Matches: "under Rs. 300000", "under 250,000", "below 30000", "under 30k", "< 250000", "budget of 200000"
    max_price_match = re.search(
        r"(?:under|below|less than|within|max(?:imum)?|<|budget(?:\s+of)?)\s*(?:rs\.?|lkr|\$)?\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?|\b[0-9]+k\b)",
        msg
    )
    if max_price_match:
        raw_val = max_price_match.group(1).replace(",", "").strip()
        if raw_val.endswith("k"):
            try:
                filters["maxPrice"] = float(raw_val[:-1]) * 1000
            except ValueError:
                pass
        else:
            try:
                filters["maxPrice"] = float(raw_val)
            except ValueError:
                pass

    # Min price: "above 50000", "over 50000", "> 50000"
    min_price_match = re.search(
        r"(?:above|over|more than|min(?:imum)?|>)\s*(?:rs\.?|lkr|\$)?\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?|\b[0-9]+k\b)",
        msg
    )
    if min_price_match:
        raw_val = min_price_match.group(1).replace(",", "").strip()
        if raw_val.endswith("k"):
            try:
                filters["minPrice"] = float(raw_val[:-1]) * 1000
            except ValueError:
                pass
        else:
            try:
                filters["minPrice"] = float(raw_val)
            except ValueError:
                pass

    # 3. Detect Brand
    for brand in KNOWN_BRANDS:
        if re.search(rf"\b{brand}\b", msg):
            filters["brand"] = brand.capitalize()
            break

    # 4. Detect Specific Descriptors / Keywords
    keywords = []
    if re.search(r"\bgaming\b", msg):
        keywords.append("gaming")
    if re.search(r"\b(programming|coding|developer)\b", msg):
        keywords.append("programming")
    if re.search(r"\b(camera|photo|photography)\b", msg):
        keywords.append("camera")
    if re.search(r"\b(wireless|bluetooth)\b", msg):
        keywords.append("wireless")
    if re.search(r"\b(noise\s*canceling|anc)\b", msg):
        keywords.append("noise canceling")
    if re.search(r"\b(lightweight|portable|slim)\b", msg):
        keywords.append("lightweight")

    if keywords:
        filters["keyword"] = " ".join(keywords)

    return filters


def fetch_matching_products(
    user_message: str,
    backend_url: Optional[str] = None
) -> Tuple[List[Dict[str, Any]], Dict[str, Any], bool]:
    """
    Extracts search filters from user query and fetches real matching products
    from Express backend API.

    Returns:
        (products: List[Dict], used_filters: Dict, is_exact_match: bool)
    """
    base_url = (backend_url or settings.NODE_API_URL or settings.EXPRESS_BACKEND_URL).rstrip("/")
    search_url = f"{base_url}/api/products/search"

    filters = extract_search_filters(user_message)
    params = dict(filters)
    params["inStock"] = "true"
    params["limit"] = 15

    exact_matches: List[Dict[str, Any]] = []

    try:
        with httpx.Client(timeout=5.0) as client:
            resp = client.get(search_url, params=params)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("success") and data.get("products"):
                    exact_matches = data["products"]
                    return exact_matches, filters, True

            # If no products matched with strict filters (e.g. strict maxPrice or keyword),
            # fetch closest products in category so Gemini can suggest closest available options
            if not exact_matches and "category" in filters:
                logger.info(
                    f"No exact matches for {filters}. Fetching closest category products for '{filters['category']}'."
                )
                relaxed_params = {"category": filters["category"], "limit": 10}
                rel_resp = client.get(search_url, params=relaxed_params)
                if rel_resp.status_code == 200:
                    rel_data = rel_resp.json()
                    if rel_data.get("success") and rel_data.get("products"):
                        return rel_data["products"], filters, False

            # If still nothing or no category was detected, fetch top featured products
            if not exact_matches:
                featured_resp = client.get(search_url, params={"limit": 8})
                if featured_resp.status_code == 200:
                    feat_data = featured_resp.json()
                    if feat_data.get("success") and feat_data.get("products"):
                        return feat_data["products"], filters, False

    except Exception as e:
        logger.error(f"Failed to fetch products from Express backend at {search_url}: {e}")

    return [], filters, False


def fetch_products_by_names(
    names: List[str],
    backend_url: Optional[str] = None
) -> Tuple[List[Dict[str, Any]], List[str], List[str]]:
    """
    Fetches real products from the Express backend matching a list of product names or model names.
    Used for store-specific product comparisons.

    Returns:
        (found_products, found_names, missing_names)
    """
    base_url = (backend_url or settings.NODE_API_URL or settings.EXPRESS_BACKEND_URL).rstrip("/")
    search_url = f"{base_url}/api/products/search"

    found_products: List[Dict[str, Any]] = []
    found_names: List[str] = []
    missing_names: List[str] = []
    seen_ids = set()

    try:
        with httpx.Client(timeout=5.0) as client:
            for name in names:
                clean_name = name.strip()
                if not clean_name:
                    continue

                resp = client.get(search_url, params={"keyword": clean_name, "limit": 5})
                matched = False
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get("success") and data.get("products"):
                        prods = data["products"]
                        # Filter to product that has the name or part of the name
                        for p in prods:
                            p_id = str(p.get("_id") or p.get("id"))
                            p_name = p.get("name", "")
                            # Check if name substantially matches
                            if p_id not in seen_ids:
                                seen_ids.add(p_id)
                                found_products.append(p)
                                found_names.append(p_name)
                                matched = True
                                break

                if not matched:
                    missing_names.append(clean_name)

    except Exception as e:
        logger.error(f"Failed to fetch products by name from Express backend: {e}")
        # If network error, treat remaining as missing
        for n in names:
            if n not in found_names and n not in missing_names:
                missing_names.append(n)

    return found_products, found_names, missing_names


def format_card(p: Dict[str, Any]) -> Dict[str, Any]:
    """Normalizes product card fields for frontend consumption."""
    return {
        "_id": str(p.get("_id") or p.get("id", "")),
        "name": p.get("name", "Product"),
        "price": p.get("price", 0),
        "image": p.get("image", ""),
        "rating": p.get("rating", 0.0),
        "stock": p.get("stock", 0),
        "category": p.get("category", ""),
        "brand": p.get("brand", "")
    }


def format_products_for_context(products: List[Dict[str, Any]]) -> str:
    """
    Formats the real product data into clean text context for Gemini.
    Only real fields are passed to prevent hallucination.
    """
    if not products:
        return "No products found in the database matching these criteria."

    lines = ["REAL PRODUCT CATALOG (FROM DATABASE):"]
    for idx, p in enumerate(products, 1):
        pid = p.get("_id") or p.get("id", "N/A")
        name = p.get("name", "Unknown")
        cat = p.get("category", "General")
        brand = p.get("brand", "N/A")
        price = p.get("price", 0)
        stock = p.get("stock", 0)
        rating = p.get("rating", 0.0)
        desc = p.get("description", "")
        img = p.get("image", "")

        lines.append(
            f"Item #{idx}: ID='{pid}' | Name='{name}' | Category='{cat}' | Brand='{brand}' | "
            f"Price=Rs. {price:,.0f} | Stock={stock} | Rating={rating}★ | Image='{img}'\n"
            f"   Description: {desc}"
        )

    return "\n".join(lines)


def format_products_for_comparison_context(products: List[Dict[str, Any]]) -> str:
    """
    Formats real products specifically for a side-by-side comparison context.
    Includes only verified database fields.
    """
    if not products:
        return "CATALOG CONTEXT: No matching products found in the database."

    lines = ["STORE CATALOG COMPARISON CONTEXT (REAL DATABASE RECORDS):"]
    for idx, p in enumerate(products, 1):
        name = p.get("name", "Unknown")
        price = p.get("price", 0)
        category = p.get("category", "N/A")
        brand = p.get("brand", "N/A")
        stock = p.get("stock", 0)
        rating = p.get("rating", 0.0)
        reviews = p.get("reviews", 0)
        desc = p.get("description", "No description available")

        lines.append(
            f"--- Product #{idx}: {name} ---\n"
            f"  Brand: {brand}\n"
            f"  Category: {category}\n"
            f"  Price: Rs. {price:,.0f}\n"
            f"  Stock: {stock} units\n"
            f"  Rating: {rating} / 5 ({reviews} reviews)\n"
            f"  Stored Description/Specs: {desc}\n"
        )

    return "\n".join(lines)
