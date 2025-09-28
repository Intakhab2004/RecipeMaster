const { z } = require("zod");


exports.verifySchema = z.object({
    otpCode: z.string()
                      .length(6, "OTP must be of 6 digits")
})