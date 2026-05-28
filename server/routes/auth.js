const express = require("express");
const router = express.Router();

const {login, register, verifyRegister, resendVerification} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/verify/:verificationToken", verifyRegister);
router.post("/resend-verification", resendVerification);

module.exports = router;