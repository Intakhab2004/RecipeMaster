const getFormattedItems = require("../helpers/formatItems");
const User = require("../models/User");
const RecentRecipe = require("../models/RecentRecipe");
const { recipeSchema } = require("../schemas/recipeSchema");



exports.recipeGenerator = async(req, res) => {
    try{
        const { ingredients } = req.body;
        const userId = req.user.id;

        // Zod validation
        const validationResult = recipeSchema.safeParse({ingredients});
        if(!validationResult.success){
            console.log("Validation failed on ingredients: ", validationResult.error.issues);
            return res.status(401).json({
                success: false,
                message: "Please fill the input correctly",
                errors: validationResult.error.issues
            })
        }

        const user = await User.findById(userId);
        if(!user){
            console.log("User not exists with the given id");
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Formatting the ingredients input
        const ingredientList = getFormattedItems(ingredients);

        // Calling Spoonacular api
        const response = await fetch(
            `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&number=3&apiKey=${process.env.SPOONACULAR_API}`
        );
        const data = await response.json();

        // Changing the name of the field of the response object to save in DB as according to my field name
        const recipes = data.map(recipe => ({
            spoonacularId: recipe.id,
            title: recipe.title,
            imageURL: recipe.image,
            ingredients: [...recipe.usedIngredients, ...recipe.missedIngredients].map(ingredient => ingredient.name.trim()),
            user: user._id
        }))

        // Saving entry to the DB for all recipes
        await Promise.all(
            recipes.map(recipe => 
                RecentRecipe.updateOne(
                    { spoonacularId: recipe.spoonacularId },
                    { $set: recipe },
                    { upsert: true}
                )
            )
        )

        return res.status(200).json({
            success: true,
            message: "Recipes fetched successfully",
            recipes
        })
    }
    catch(error){
        console.log("Something went wrong: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


exports.recipeSummary = async(req, res) => {
    try{
        const { recipeId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if(!user){
            console.log("User not found");
            return res.status(404).json({
                success: false,
                message: "Token validation failed"
            })
        }
        
        if(!recipeId){
            console.log("Recipe id not found");
            return res.status(401).json({
                success: false,
                message: "Recipe id is required"
            })
        }

        // Checking if the recipe exists or not
        const currentRecipe = await RecentRecipe.findOne({spoonacularId: recipeId, user: userId});
        if(!currentRecipe){
            console.log("Recipe is no longer available");
            return res.status(404).json({
                success: false,
                message: "Recipe is no longer available"
            })
        }

        if(currentRecipe.instructions.length > 0){
            console.log("Recipe data is already available");
            return res.status(200).json({
                success: true,
                message: "Recipe data is already available",
                currentRecipe
            })
        }

        // Spoonacular APIs
        const url1 = `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=${process.env.SPOONACULAR_API}`
        const url2 = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${process.env.SPOONACULAR_API}`

        // Calling both api parallely
        const [res1, res2] = await Promise.all([fetch(url1), fetch(url2)]);
        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
        
        const instructions = data1[0].steps.map(st => st.step.trim());
        const nutritions = {
            calories: data2.calories,
            protein: data2.protein,
            carbs: data2.carbs,
            fat: data2.fat
        }

        currentRecipe.instructions = instructions;
        currentRecipe.nutritions = nutritions;
        await currentRecipe.save();

        return res.status(200).json({
            success: true,
            message: "Recipe details fetched successfully",
            currentRecipe
        })
    }
    catch(error){
        console.log("Something went wrong: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


exports.getRecentRecipe = async(req, res) => {
    try{
        const userId = req.user.id;

        const user = await User.findById(userId);
        if(!user){
            console.log("Token has not provided");
            return res.status(401).json({
                success: false,
                message: "Token validation failed"
            })
        }

        const recentRecipe = await RecentRecipe.find({user: userId});
        if(recentRecipe){
            return res.status(403).json({
                success: false,
                message: "Something went wrong while fetching the recipes"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Recent recipe fetched successfully",
            recentRecipe
        })
    }
    catch(error){
        console.log("Something went wrong: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}