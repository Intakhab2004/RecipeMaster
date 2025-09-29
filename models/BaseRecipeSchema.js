const mongoose = require("mongoose");


const baseRecipeSchema = new mongoose.Schema({
    spoonacularId: {
        type: Number,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    imageURL: String,
    summary: String,
    ingredients: [String],
    instructions: [String],

    nutritions: {
        calories: String,
        protein: String,
        carbs: String,
        fat: String
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
    
}, {timestamps: true})

module.exports = baseRecipeSchema;