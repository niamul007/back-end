
export function validator(req, res, next) {
  const { item, itemQty } = req.body;

  if (item === undefined || itemQty === undefined) {
    return res.status(400).json({ error: "Missing data" });
  }

  if (typeof item !== "string" || item.trim().length < 2) {
    return res
      .status(400)
      .json({ error: "Item name must be greater than 2 char" });
  }

  if (isNaN(itemQty) || Number(itemQty) <= 0) {
    return res.status(400).json({ error: "Quantity must be  a number" });
  }
  next();
}
