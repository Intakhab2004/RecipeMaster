const { z } = require("zod");


exports.siginSchema = z.object({
    identifier: z.string(),
    password: z.string()
})