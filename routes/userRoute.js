const express = require("express");
const router = express.Router();


const {
    sendOTP,
    signUp,
    verifyOtp,
    signIn
} = require("../controllers/auth");

router.post("/otp-send", sendOTP);
router.post("/sign-up", signUp);
router.post("/verify-otp", verifyOtp);
router.post("/sign-in", signIn);

module.exports = router;