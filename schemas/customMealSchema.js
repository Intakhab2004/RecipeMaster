const { z } = require("zod");


exports.customMealSchema = z.object({
    recipeName: z.string()
                         .min(1, "Recipe name is required")
                         .min(2, "Recipe name must of atleast 2 characters")
                         .max(30, "Recipe name must not be more than 30 characters"),

    calories: z.string()
                       .regex(/^\d+$/, "Input must in Numbers"),

    protein: z.string()
                       .regex(/^\d+$/, "Input must in Numbers"),

    carbs: z.string()
                       .regex(/^\d+$/, "Input must in Numbers"),

    fat: z.string()
                       .regex(/^\d+$/, "Input must in Numbers")
})