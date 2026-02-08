import { error } from "node:console";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });
  // 1. If validation FAILS
  if (!result.success) {
    // We only touch result.error if success is false!
    return res.status(400).json({
      status: "fail",
      errors: result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }
  // 2. If validation SUCCEEDS
  // Re-assign the cleaned data to req so your controller can use it
  req.body = result.data.body;
  req.params = result.data.params;
  
  next(); 
};

