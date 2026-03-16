import { validationResult } from "express-validator";

/**
 * Middleware to handle validation results
 * Returns 400 with errors if validation fails
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation Failure for:", req.originalUrl);
    console.log("Request Body:", req.body);
    console.log("Errors:", JSON.stringify(errors.array(), null, 2));
    return res.status(400).json({
      success: false,
      message: "Validation failed: " + errors.array().map(e => e.msg).join(", "),
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};
