const express = require("express");
const router = express.Router();

const {login, register, verifyRegister} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/verify/:verificationToken", verifyRegister);

module.exports = router;