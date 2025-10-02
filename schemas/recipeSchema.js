const { z } = require("zod");


exports.recipeSchema = z.object({
    ingredients: z.string()
                          .min(1, "Ingredient is required")
                          .min(2, "Ingredients must be of atleast 2 characters")
})