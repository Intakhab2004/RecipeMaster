const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");


const {
    getRecentRecipe,
    getUserDetails
} = require("../controllers/getData")


router.get("/get-recent-recipe", auth, getRecentRecipe);
router.get("/user-details", auth, getUserDetails);

module.exports = router;