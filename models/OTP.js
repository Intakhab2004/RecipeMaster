const mongoose = require("mongoose");


const OTPSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
})


const otpModel = mongoose.model("OTP", OTPSchema);
module.exports = otpModel;