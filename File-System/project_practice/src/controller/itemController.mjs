import * as itemService from "../services/itemService.mjs";
import AppError from "../utils/appError.mjs";
import catchAsync from "../utils/catchAsync.mjs";

// 1. GET ALL
export const getItem = catchAsync(async (req, res, next) => {
  const allItems = await itemService.getAllItemsService(); // Use a service for this too!
  res.status(200).json(allItems);
});

// 2. POST
export const postItem = catchAsync(async (req, res, next) => {
  const newItem = await itemService.createItem(req.body);
  
  res.status(201).json({
    status: "success",
    data: newItem, // Changed from 'newItem' to match the variable above
  });
});

// 3. DELETE
export const delItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // We use try/catch inside catchAsync ONLY to transform service errors into AppErrors
  try {
    const remainingItems = await itemService.removeItem(id);
    res.status(200).json({
      status: "success",
      data: remainingItems, // FIX: must match the variable name
    });
  } catch (err) {
    if (err.message === "NOT_FOUND") return next(new AppError("Not found", 404));
    throw err;
  }
});

// 4. UPDATE
export const updateItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedList = await itemService.updateItem(id, req.body);

  res.status(200).json({
    status: "success",
    data: updatedList, // FIX: must match the variable name
  });
});

// 5. TOGGLE
export const toggleItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedList = await itemService.toggleItemService(id);
  
  res.status(200).json({ 
    status: "success",
    data: updatedList 
  });
});

// 6. SEARCH
export const searchItems = catchAsync(async (req, res, next) => {
    const { name } = req.query;
    
    // The Service does the work and returns an array (filtered or full)
    const filteredResults = await itemService.searchItem(name);

    // We ALWAYS send 200, even if the array is empty []. 
    // This stops the frontend "Search failed" error.
    res.status(200).json({
        status: 'success',
        results: filteredResults.length,
        data: filteredResults // This is the data.data your frontend needs!
    });
});