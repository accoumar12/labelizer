export const format = (value: number, precision = 2) => {
  const decimalFormat = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: precision,
  });
  if (value == null || Number.isNaN(value)) return null;
  if (value === 0) return "-";
  return decimalFormat.format(value);
};
