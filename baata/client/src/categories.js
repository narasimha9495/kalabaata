// Shared category metadata for labels + pin colours (mirrors theme.css accents).
export const CATEGORIES = [
  { key: "all", label: "All", color: "#1a1511" },
  { key: "heritage", label: "Heritage", color: "#b07d2e" },
  { key: "temple", label: "Temples", color: "#c0622c" },
  { key: "nature", label: "Nature", color: "#3f7d63" },
  { key: "crafts", label: "Crafts", color: "#8a4f6d" },
  { key: "food", label: "Food", color: "#a5402c" },
];
export const CAT_COLOR = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.color]));
export const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));
