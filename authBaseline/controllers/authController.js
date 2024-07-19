const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/usersModel");
const UserToken = require("../models/userToken");
const { sendEmail } = require("../utils/emailUtil");

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "User created successfully",
      message: "Successful",
      data: {
        fullName,
        email,
      },
    });
  } catch (error) {
    next(error); // Proper error handling
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "Invalid Credentials",
        message: "User Not Found",
      });
    }

    const doPasswordsMatch = bcrypt.compareSync(password, user.password);

    if (!doPasswordsMatch) {
      return res.status(401).json({
        status: "Invalid Credentials",
        message: "Check your Details",
      });
    }

    const userToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: "Login successful",
      message: "You have successfully logged in",
      userToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = uuidv4();
    await new UserToken({ userId: user._id, token }).save();
    const resetLink = `http://localhost:7001/reset-password/${token}`;
    await sendEmail(
      email,
      "Forgot Password",
      `Click the link to reset your password: ${resetLink}<br>The token is: ${token}`
    );

    res.json({ message: "Password reset token sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const userToken = await UserToken.findOne({ token });

    if (!userToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(userToken.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    await UserToken.deleteOne({ token });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user profile
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.userDetails.userId).select(
      "fullName email"
    );
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
