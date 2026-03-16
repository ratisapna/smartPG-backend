import { body } from "express-validator";

export const documentValidator = [
  body("type")
    .isIn(["AADHAAR", "COLLEGE_ID", "EMPLOYEE_ID", "PASSPORT", "OTHER"])
    .withMessage("Invalid document type"),
  body("fileName").notEmpty().withMessage("File name is required"),
  body("fileType").notEmpty().withMessage("File type is required"),
];
