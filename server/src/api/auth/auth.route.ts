import express from "express";

const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
  // Handle user login
  res.send("User logged in");
});

authRouter.post("/register", (req, res) => {
  // Handle user registration
  res.send("User registered");
});

export default authRouter;
