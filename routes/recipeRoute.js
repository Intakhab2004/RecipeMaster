const express = require("express");
const router = express.Router();


const {
    recipeGenerator,
    recipeSummary,
    getRecentRecipe,
    saveRecipe,
    deleteRecipe
} = require("../controllers/recipe");

router.post("/generate-recipe", recipeGenerator);
router.put("/recipe-details", recipeSummary);
router.get("/get-recent-recipe", getRecentRecipe);
router.post("/save-recipe", saveRecipe);
router.delete("/delete-recipe", deleteRecipe);


module.exports = router;
