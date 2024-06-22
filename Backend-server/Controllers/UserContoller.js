import UserModel from "../models/UserModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = createToken({ id: user._id });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: user,
    });
  } catch (error) {
    console.error("Error in Login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const RegisterUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || username.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = createToken({ id: newUser._id });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token: token,
      user: newUser,
    });
  } catch (error) {
    console.error("Error in Registration:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const google = async (req, res, next) => {
  const { email, username, profilePic } = req.body;
  
  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      const token = createToken({ id: user._id });
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        user: user,
      });
    }

    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const newUser = new UserModel({
      profilePic: profilePic,
      username: username,
      email,
      password: hashedPassword,
    });

    user = await newUser.save();
    const token = createToken({ id: user._id });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token: token,
      user: user,
    });
  } catch (error) {
    console.error("Error in Google OAuth:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Login failed.",
      error: error.message,
    });
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { username, email, password, profilePic } = req.body;

  if (req.user.id !== id) {
    return res.status(403).json({ message: "Unauthorized to update this account" });
  }

  try {
    if (password) {
      req.body.password = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: { username, email, password, profilePic } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error in Update:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  
  if (req.user.id !== id) {
    return res.status(403).json({ message: "Unauthorized to delete this account" });
  }

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    res.status(200).json(deletedUser);
  } catch (err) {
    console.error("Error in Delete:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { LoginUser, RegisterUser, google, updateUser, deleteUser };
