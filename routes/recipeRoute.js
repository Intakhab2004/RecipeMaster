const express = require("express");
const router = express.Router();


const {
    recipeGenerator,
    recipeSummary
} = require("../controllers/recipe");

router.post("/generate-recipe", recipeGenerator);
router.put("/recipe-details", recipeSummary);


module.exports = router;
