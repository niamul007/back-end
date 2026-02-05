import { getAllItem, saveAllItem } from "../model/models.mjs";
import crypto from "crypto";

export const getItem = async (req, res) => {
  try {
    const read = await getAllItem();
    res.status(200).json(read);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch clients" });
  }
};

export const postItem = async (req, res) => {
  const { item, itemQty } = req.body;
  try {
    const content = await getAllItem();
    const newItem = {
      id: crypto.randomUUID(),
      item: item,
      itemQty: Number(itemQty),
      createdAt: new Date().toISOString(),
      bought: false,
    };
    content.push(newItem);
    await saveAllItem(content);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to save item to database" });
  }
};

export async function delItem(req, res) { // FIX: Added req, res
  const { id } = req.params; // FIX: Use params for URL IDs

  try {
    const allItems = await getAllItem();
    
    // FIX: Save the result of the filter to a new variable
    const filteredList = allItems.filter((i) => i.id !== id);

    // FIX: Save the NEW list, not the old one
    await saveAllItem(filteredList);
    
    // Respond with the new list so the frontend can update
    res.status(200).json(filteredList);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the item" });
  }
}