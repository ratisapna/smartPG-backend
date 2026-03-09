// controllers/authController.js

import { registerOwner, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
  try {

    const user = await registerOwner(req.body);

    res.status(201).json({
      message: "Owner registered successfully",
      user
    });

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }
};

export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json(result);

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }
};