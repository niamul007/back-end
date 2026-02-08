import { getAllItem, saveAllItem } from "../model/models.mjs";
import crypto from "crypto";
import AppError from "../utils/appError.mjs";
import catchAsync from "../utils/catchAsync.mjs";

export const getItem = catchAsync(async (req, res, next) => {
  const read = await getAllItem();

  if (!read) {
    return next(new AppError("Database is empty", 404));
  }

  res.status(200).json(read);
});

export const postItem = catchAsync(async (req, res, next) => {
  const { item, itemQty } = req.body;

  // 1. Zod would usually handle this, but here is a manual check
  if (!item || !itemQty) {
    return next(
      new AppError("Please provide both item name and quantity", 400),
    );
  }

  const content = await getAllItem();

  const newItem = {
    id: crypto.randomUUID(),
    item: item,
    itemQty: Number(itemQty),
    createdAt: new Date().toISOString(),
    bought: false,
  };

  content.push(newItem);

  // 2. Try to save. If it fails, catchAsync will automatically throw a 500 error.
  await saveAllItem(content);

  // 3. SUCCESS PATH: Just send the response.
  // No need for AppError here because everything went well!
  res.status(201).json({
    status: "success",
    data: newItem,
  });
});


export const delItem = catchAsync(async (req, res, next) => {
  // 1. Added 'next'
  const { id } = req.params;
  const allItems = await getAllItem();

  // 2. Count items before filtering
  const initialLength = allItems.length;

  // 3. Filter the list
  const filteredList = allItems.filter((i) => i.id !== id);

  // 4. If lengths are the same, nothing was removed = 404
  if (filteredList.length === initialLength) {
    return next(new AppError("No item found with that ID", 404));
  }

  // 5. Save the NEW list
  await saveAllItem(filteredList);

  // 6. Respond (Standard for DELETE is 204 No Content, or 200 with the new list)
  res.status(200).json({
    status: "success",
    data: filteredList,
  });
});

export const updateItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { newTxt } = req.body;

  const items = await getAllItem();

  // 1. Check if the item actually exists first
  const itemExists = items.find((i) => i.id === id);

  if (!itemExists) {
    // We use 404 because the user provided an ID that doesn't exist
    return next(new AppError("No item found with that ID", 404));
  }

  // 2. Perform the update
  const updatedList = items.map((i) => {
    if (i.id === id) {
      return { ...i, item: newTxt };
    }
    return i;
  });

  // 3. Persist the changes
  await saveAllItem(updatedList);

  // 4. Respond with the updated item or the whole list
  res.status(200).json({
    status: "success",
    data: updatedList,
  });
});

export const toggleItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const allItems = await getAllItem();

  // 1. Check if the item actually exists in the array
  const itemExists = allItems.some(item => item.id === id);
  
  if (!itemExists) {
    // Corrected the parenthesis here
    return next(new AppError("No item found with that ID", 404));
  }

  // 2. Toggle the 'bought' status
  const updated = allItems.map((item) => {
    if (item.id === id) {
      return { ...item, bought: !item.bought };
    }
    return item;
  });

  // 3. Persist and respond
  await saveAllItem(updated);
  
  res.status(200).json({ 
    status: "success",
    message: "Item status toggled successfully" 
  });
});

// itemController.mjs
export const searchItems = catchAsync(async (req, res, next) => {
    const { name } = req.query; // Clean destructuring
    const allItems = await getAllItem();

    // 1. If no search term, just return everything
    if (!name || name.trim() === "") {
        return res.status(200).json(allItems);
    }

    // 2. Filter logic (case-insensitive)
    const filtered = allItems.filter(
        (i) => i.item && i.item.toLowerCase().includes(name.toLowerCase())
    );

    // 3. Handle "No Results Found"
    // We check if length is 0. 
    if (filtered.length === 0) {
        return next(new AppError(`No items found matching "${name}"`, 404));
    }

    // 4. Send the results
    res.status(200).json({
        status: 'success',
        results: filtered.length,
        data: filtered
    });
});