const express = require("express");
const router = express.Router();


const {
    logNutritionByRecipeId,
    logNutritionManually
} = require("../controllers/nutritions")


router.get("/recipe-nutrition", logNutritionByRecipeId);
router.get("/manual-nutrition", logNutritionManually);

module.exports = router;