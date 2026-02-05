import { getAllItem, saveAllItem } from "../model/models.mjs";
import crypto from "crypto";
const getItem = async (req, res) => {
  try {
    const read = await getAllItem();
    res.status(200).json(read);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch clients" });
  }
};

const postItem = async (req, res) => {
  const { item, itemQty } = req.body;
  try {
    const content = await getAllItem();
    const newItem = {
      id: crypto.randomUUID(),
      item: item,
      itemQty: Number(itemQty),
      createdAt: new Date().toISOString(),
    };
    content.push(newItem);
    await saveAllItem(content);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to save item to database" });
  }
};
