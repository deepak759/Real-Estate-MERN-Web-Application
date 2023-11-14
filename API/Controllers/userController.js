import User from "../Models/User_model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const getUser = (req, res) => {
  res.send("hello");
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  try {
    await user.save();
    res.status(200).json("user Created succesfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
 
  try {
    const validUser =await User.findOne({ email });
 
    if (!validUser) return next(errorHandler(404, "User Not Found"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "wrong credentials"));
  
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const {password:pass,...rest}=validUser._doc;
    res.cookie("acces_token", token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
