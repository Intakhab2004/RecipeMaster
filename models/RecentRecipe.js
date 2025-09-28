const mongoose = require("mongoose");
const baseRecipeSchema = require("./BaseRecipeSchema");

// Cloning base schema for TTL(Time to live) behaviour
const recentlyViewedSchema = baseRecipeSchema.clone();

// TTL index for auto-delete after 24 hours
recentlyViewedSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const recentlyViewedModel = mongoose.model("RecentlyViewedRecipe", recentlyViewedSchema);
module.exports = recentlyViewedModel;