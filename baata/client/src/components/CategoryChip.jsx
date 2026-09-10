import { CAT_LABEL } from "../categories.js";
export default function CategoryChip({ category }) {
  return <span className={`chip ${category}`}>{CAT_LABEL[category] || category}</span>;
}
