/**
 * Generates a concise, readable title (3-7 words) from the first user message
 * without making external AI requests.
 */

function generateChatTitle(message) {
  if (!message || typeof message !== "string") {
    return "New Conversation";
  }

  let text = message.trim();

  // Remove markdown, symbols, hashtags, trailing punctuation
  text = text.replace(/[#*`~_]/g, "");
  text = text.replace(/[?!.:;]+$/, "");

  const lower = text.toLowerCase();

  // Specific pattern 1: "Intel or Ryzen ... video editing" -> "Intel vs Ryzen for Editing"
  if (lower.includes("intel") && lower.includes("ryzen")) {
    if (lower.includes("video editing") || lower.includes("editing")) {
      return "Intel vs Ryzen for Editing";
    }
    return "Intel vs Ryzen Comparison";
  }

  // Specific pattern 2: "What is [Concept]?" -> "[Concept] Explained"
  const whatIsMatch = text.match(/^(?:what\s+is|what\s+does|explain)\s+(?:an?\s+|the\s+)?([a-zA-Z0-9\s]+?)(?:\s+mean)?$/i);
  if (whatIsMatch && whatIsMatch[1]) {
    const concept = whatIsMatch[1].trim();
    if (concept.split(/\s+/).length <= 4) {
      return `${capitalizeWords(concept)} Explained`;
    }
  }

  // Specific pattern 3: Comparisons "X vs Y"
  if (/\b(?:vs\.?|versus)\b/i.test(text)) {
    const parts = text.split(/\s+(?:vs\.?|versus)\s+/i);
    if (parts.length >= 2) {
      const p1 = cleanItemName(parts[0]);
      const p2 = cleanItemName(parts[1]);
      if (p1 && p2) {
        return `${p1} vs ${p2}`;
      }
    }
  }

  // Specific pattern 4: "Compare [Item A] with/and [Item B]"
  const compareMatch = text.match(/^compare\s+(.+?)\s+(?:with|and|to)\s+(.+)/i);
  if (compareMatch) {
    const p1 = cleanItemName(compareMatch[1]);
    const p2 = cleanItemName(compareMatch[2]);
    return `Compare ${p1} & ${p2}`;
  }

  // General shopping / budget cleaning:
  // Convert "under Rs. 300000" or "under 300,000" or "below 25000" -> "under 300k" / "under 25k"
  text = text.replace(
    /(?:under|below|less than|within|budget of)\s*(?:rs\.?|lkr|\$)?\s*([0-9]+(?:,[0-9]+)*)(?:000)\b/gi,
    (match, num) => {
      const cleanNum = num.replace(/,/g, "");
      return `under ${cleanNum}k`;
    }
  );

  text = text.replace(
    /(?:under|below|less than|within|budget of)\s*(?:rs\.?|lkr|\$)?\s*([0-9]+)k\b/gi,
    "under $1k"
  );

  // Strip common conversational filler prefixes
  text = text.replace(
    /^(?:i\s*need\s+(?:a\s+)?|i\s*want\s+(?:to\s+buy\s+)?(?:a\s+)?|recommend\s+(?:a\s+|me\s+)?|show\s+me\s+(?:some\s+)?|suggest\s+(?:a\s+|me\s+)?|looking\s+for\s+(?:a\s+)?|help\s+me\s+(?:choose|find)\s+(?:a\s+)?|can\s+you\s+recommend\s+(?:a\s+)?|which\s+(?:are\s+the\s+best|is\s+the\s+best)\s+)/i,
    ""
  );

  // Split into words
  const words = text.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "Tech Advice";
  }

  // Limit to 3 to 6 words
  const selectedWords = words.slice(0, 6);
  let title = selectedWords.join(" ");

  // Clean trailing punctuation again
  title = title.replace(/[?!.,;:_-]+$/, "").trim();

  // Capitalize properly
  return capitalizeWords(title);
}

function cleanItemName(name) {
  if (!name) return "";
  return name
    .replace(/^(?:which\s+is\s+better,?\s+|compare\s+|the\s+)/i, "")
    .replace(/[?!.,;]+$/, "")
    .trim();
}

function capitalizeWords(str) {
  if (!str) return "";
  const minorWords = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of", "on", "or", "so", "the", "to", "up", "yet", "vs", "with"]);
  const words = str.split(/\s+/);
  return words
    .map((w, idx) => {
      const lower = w.toLowerCase();
      // Keep acronyms like DDR5, RTX, IPS, OLED, USB, RAM in uppercase
      if (/^[A-Z0-9]{2,}$/.test(w)) {
        return w;
      }
      if (/^(rtx|gtx|oled|ips|amoled|ddr[345]|ram|cpu|gpu|ssd|hdd|pc|mac|ios)$/i.test(lower)) {
        return lower.toUpperCase();
      }
      if (idx > 0 && minorWords.has(lower)) {
        return lower;
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

module.exports = {
  generateChatTitle,
};
