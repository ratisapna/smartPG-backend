// controllers/authController.js

import { registerUser, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: `${user.role} registered successfully`,
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