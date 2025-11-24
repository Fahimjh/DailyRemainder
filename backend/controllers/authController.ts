import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: any = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
