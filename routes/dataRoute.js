const express = require("express");
const router = express.Router();


const {
    getRecentRecipe,
    getUserDetails
} = require("../controllers/getData")


router.get("/get-recent-recipe", getRecentRecipe);
router.get("/user-details", getUserDetails);

module.exports = router;