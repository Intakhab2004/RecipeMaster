const mongoose = require("mongoose");


const nutritionLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },

    recipe: {
        type: mongoose.Types.ObjectId,
        ref: "SavedRecipe"
    },

    customMeals: {
        type: String
    },

    nutrition: {
        calories: { type: String },
        protein: { type: String },
        carbs: { type: String },
        fat: { type: String }
    },

    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: "30d"}
    },
})

const nutritionLogModel = mongoose.model("NutritionLog", nutritionLogSchema);
module.exports = nutritionLogModel;