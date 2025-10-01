const express = require("express");
const router = express.Router();


const {
    recipeGenerator,
    recipeSummary,
    saveRecipe,
    deleteRecipe
} = require("../controllers/recipe");

router.post("/generate-recipe", recipeGenerator);
router.put("/recipe-details", recipeSummary);
router.post("/save-recipe", saveRecipe);
router.delete("/delete-recipe", deleteRecipe);


module.exports = router;
