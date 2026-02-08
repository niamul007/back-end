// utils/catchAsync.mjs
const catchAsync = (fn) => {
  return (req, res, next) => {
    // We execute the function and "catch" any error to pass it to next
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;