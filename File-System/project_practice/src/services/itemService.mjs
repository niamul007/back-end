// src/services/itemService.mjs
import { it } from "zod/locales";
import { getAllItem, saveAllItem } from "../model/models.mjs";
import crypto from "crypto";

export const getAllItemsService = async () => {
  const items = await getAllItem();
  
  // You can add logic here later, like sorting by date!
  return items;
};

export const createItem = async (itemData) => {
  const items = await getAllItem();
  const newItem = {
    id: crypto.randomUUID(),
    item: itemData.item,
    itemQty: Number(itemData.itemQty),
    createdAt: new Date().toISOString(),
    bought: false,
  };
  items.push(newItem);
  await saveAllItem(items);
  return newItem;
};

export const updateItem = async (id, upItem) => {
  const items = await getAllItem();
  
  // Check if item exists first so we can tell the controller
  if (!items.find(i => i.id === id)) throw new Error("NOT_FOUND");

  const updatedList = items.map((i) => {
    if (i.id === id) {
      return { ...i, item: upItem.newTxt };
    }
    return i;
  });

  await saveAllItem(updatedList); // FIX: You previously passed 'updateItem' (the function) instead of 'updatedList'
  return updatedList;
};

export const toggleItemService = async (id) => { // Renamed to avoid name collision with controller
  const allItems = await getAllItem();
  
  if (!allItems.find(i => i.id === id)) throw new Error("NOT_FOUND");

  const updated = allItems.map((item) => { // FIX: Changed 'i' to 'item' to match your internal logic
    if (item.id === id) {
      return { ...item, bought: !item.bought };
    }
    return item; // FIX: Return the original item if ID doesn't match
  });

  await saveAllItem(updated);
  return updated;
};

export const removeItem = async (id) => {
  const allItems = await getAllItem();
  const filteredList = allItems.filter((i) => i.id !== id);

  if (filteredList.length === allItems.length) {
    throw new Error("NOT_FOUND");
  }

  await saveAllItem(filteredList);
  return filteredList;
};

export const searchItem = async (name) => {
  const allItems = await getAllItem();
  
  // Logic: if search is empty, return everything
  if (!name) return allItems;

  const filtered = allItems.filter(
    (i) => i.item && i.item.toLowerCase().includes(name.toLowerCase())
  );
  
  return filtered; // FIX: You forgot to return the filtered list!
};

export const resetAll = async () => {
  const updated = [];
  await saveAllItem(updated);
  return updated
};
