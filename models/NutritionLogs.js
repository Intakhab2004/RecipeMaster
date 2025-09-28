const mongoose = require("mongoose");


const mealSchema = new mongoose.Schema({
    recipe: {
        type: mongoose.Types.ObjectId,
        ref: "SavedRecipe"
    },

    customMeals: {
        type: String
    },

    nutrition: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
    },
})


const nutritionLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    meals: [mealSchema], 

    date: {
        type: Date,
        default: Date.now,
    },
})

const nutritionLogModel = mongoose.model("NutritionLog", nutritionLogSchema);
module.exports = nutritionLogModel;