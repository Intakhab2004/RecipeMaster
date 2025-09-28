const mongoose = require("mongoose");
const baseRecipeSchema = require("./BaseRecipeSchema");


const savedRecipeModel = mongoose.model("SavedRecipe", baseRecipeSchema);
module.exports = savedRecipeModel;