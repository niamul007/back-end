import * as habitService from "../service/habitService.mjs";
import catchAsync from "../utility/catchAsync.mjs";

export const getAllData = catchAsync(async (req, res, next) => {
  const data = await habitService.showAllHabit();
  
  // Wrap it so the Frontend knows where to look
  return res.status(200).json({
    status: "success",
    data: data 
  });
});


export const postData = catchAsync(async (req, res, next) => {
    // 1. Get data from service
    const newItem = await habitService.addHabit(req.body.task);
    
    // 2. Send structured response
    res.status(201).json({
        status: "success",
        data: newItem
    });
});