const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");


const {
    logNutritionByRecipeId,
    logNutritionManually
} = require("../controllers/nutritions")


router.get("/recipe-nutrition", auth, logNutritionByRecipeId);
router.get("/manual-nutrition", auth, logNutritionManually);

module.exports = router;