const express = require("express");
const router = express.Router();


const {
    sendOTP,
    uniqueUsername,
    signUp,
    verifyOtp,
    signIn
} = require("../controllers/auth");

router.post("/otp-send", sendOTP);
router.get("unique-username", uniqueUsername);
router.post("/sign-up", signUp);
router.post("/verify-otp", verifyOtp);
router.post("/sign-in", signIn);

module.exports = router;