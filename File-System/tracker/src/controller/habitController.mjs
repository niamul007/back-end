import AppError from "../../../project_practice/src/utils/appError.mjs";
import * as habitService from "../service/habitService.mjs";
import catchAsync from "../utility/catchAsync.mjs";

export const getAllData = catchAsync(async (req, res, next) => {
  const data = await habitService.showAllHabit();

  // Wrap it so the Frontend knows where to look
  return res.status(200).json({
    status: "success",
    data: data,
  });
});

export const postData = catchAsync(async (req, res, next) => {
  // 1. Get data from service
  const newItem = await habitService.addHabit(req.body.task);

  // 2. Send structured response
  res.status(201).json({
    status: "success",
    data: newItem,
  });
});

export const removeItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  try {
    const delitem = await habitService.delHabit(id);
    res.status(200).json({
      status: "success",
      data: delitem,
    });
  } catch (err) {
    if (err.message === "NOT_FOUND")
      return next(new AppError("Not found", 400));
    throw err;
  }
});

export const toggleData = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const toggle = await habitService.toggleItem(id);
  res.status(200).json({
    status: "success",
    data: toggle,
  });
});

export const resetItem = catchAsync(async (req,res,next) =>{
  const reset = await habitService.reset();
  res.status(200).json({
    status: "success",
    data: reset,
  })
})
