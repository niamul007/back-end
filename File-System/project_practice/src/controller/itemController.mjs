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

export async function delItem(req, res) {
  // FIX: Added req, res
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

export async function updateItem(req, res) {
  console.log("Update requested for ID:", req.params.id);
  console.log("New Text received:", req.body.newTxt);

  try {
    const read = await getAllItem();
    const updated = read.map((i) => {
      if (i.id === req.params.id) {
        console.log("MATCH FOUND! Changing name to:", req.body.newTxt);
        return { ...i, item: req.body.newTxt };
      }
      return i;
    });

    await saveAllItem(updated);
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}

export async function toggleItem(req, res) {
  try {
    const { id } = req.params;
    const allItems = await getAllItem();
    
    const updated = allItems.map((item) => {
      if (item.id === id) {
        // The ! (NOT) operator flips true to false and false to true
        return { ...item, bought: !item.bought };
      }
      return item;
    });

    await saveAllItem(updated);
    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    res.status(500).json({ error: "Toggle failed" });
  }
}

// itemController.mjs
export const searchItems = async (req, res) => {
  try {
    const name = req.query.name; // Explicitly get 'name'
    const allItems = await getAllItem();

    if (!name || name.trim() === "") {
        return res.json(allItems);
    }

    const filtered = allItems.filter(i => 
        i.item && i.item.toLowerCase().includes(name.toLowerCase())
    );

    res.json(filtered);
  } catch (error) {
    console.error(error); // Log the actual error to your terminal
    res.status(500).json({ error: "Search failed" });
  }
};