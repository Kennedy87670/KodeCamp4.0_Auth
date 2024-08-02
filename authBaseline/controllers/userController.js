const User = require("../models/usersModel");
const bcrypt = require("bcrypt");

// Get all users with pagination, search, and filter
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const users = await User.paginate(query, options);

    res.json({
      message: "Successful",
      data: users.docs,
      totalDocs: users.totalDocs,
      totalPages: users.totalPages,
      page: users.page,
      limit: users.limit,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      user.id !== req.userDetails.userId &&
      req.userDetails.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.password = password
      ? bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      : user.password;

    // Only allow admin to update the role
    if (req.userDetails.role === "admin") {
      user.role = role || user.role;
    }

    await user.save();

    res.json({
      message: "Successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.userDetails.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await user.remove();

    res.json({
      message: "Deleted Successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
