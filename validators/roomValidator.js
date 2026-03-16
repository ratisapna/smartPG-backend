import { body } from "express-validator";

export const roomValidator = [
  body("roomNumber").trim().notEmpty().withMessage("Room number is required"),
  body("floor").isNumeric().withMessage("Floor must be a number"),
  body("totalBeds")
    .isInt({ min: 1 })
    .withMessage("Total beds must be at least 1"),
  body("rentPerBed")
    .isNumeric({ min: 0 })
    .withMessage("Rent per bed must be a positive number"),
];
