const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();


const {
    recipeGenerator,
    recipeSummary,
    saveRecipe,
    deleteRecipe
} = require("../controllers/recipe");

router.post("/generate-recipe", auth, recipeGenerator);
router.put("/recipe-details", auth, recipeSummary);
router.post("/save-recipe", auth, saveRecipe);
router.delete("/delete-recipe", auth, deleteRecipe);


module.exports = router;
