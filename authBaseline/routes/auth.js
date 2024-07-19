var express = require('express');
const { register, login, forgotPassword, resetPassword, profile } = require('../controllers/authController');
const verifyAuth = require('../middleware/verifyAuth');
var router = express.Router();

/* GET home page. */
router.post("/register", register)
router.post("/login", login)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", verifyAuth, profile);

module.exports = router;
