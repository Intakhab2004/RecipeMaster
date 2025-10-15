const getFormattedItems = require("../helpers/formatItems");
const User = require("../models/User");
const RecentRecipe = require("../models/RecentRecipe");
const SavedRecipe = require("../models/SavedRecipe");
const { recipeSchema } = require("../schemas/recipeSchema");
const { default: mongoose } = require("mongoose");



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
                recipeSummary: currentRecipe
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

        const updatedRecipe = await RecentRecipe.findOneAndUpdate(
            { spoonacularId: recipeId, user: userId },
            {
                instructions: instructions,
                nutritions: nutritions
            },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: "Recipe details fetched successfully",
            recipeSummary: updatedRecipe
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


exports.saveRecipe = async(req, res) => {
    try{
        const { recipeId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId)
                                                .populate({
                                                    path: "favoriteRecipes",
                                                    select: "spoonacularId"
                                                });
        
        if(!user){
            console.log("User not found");
            return res.status(401).json({
                success: false,
                message: "Token validation failed"
            })
        }

        // Checking if recipe already in favorite list
        const alreadyExists = user.favoriteRecipes.some(
            (recipe) => recipe.spoonacularId.toString() === recipeId.toString()
        )
        if(alreadyExists){
            console.log("Recipe already exists");
            return res.status(401).json({
                success: false,
                message: "Recipe already exists in your collection"
            })
        }

        const recipe = await RecentRecipe.findOne({spoonacularId: recipeId});
        if(!recipe){
            console.log("Recipe not found or may be vanished");
            return res.status(404).json({
                success: false,
                message: "Recipe not available"
            })
        }

        // Saving the recipe in SavedRecipe model
        let savedRecipe = await SavedRecipe.findOne({spoonacularId: recipe.spoonacularId});
        if(!savedRecipe){
            const recipeData = recipe.toObject();
            delete recipeData._id;

            savedRecipe = await SavedRecipe.create(recipeData);
        }

        user.favoriteRecipes.push(savedRecipe._id);
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "Recipe saved successfully"
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


exports.deleteRecipe = async(req, res) => {
    try{
        const { recipeId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if(!user){
            console.log("User not found");
            return res.status(401).json({
                success: false,
                message: "Token validation failed"
            })
        }

        const recipe = await SavedRecipe.findOne({spoonacularId: recipeId, user: user._id});
        if(!recipe){
            console.log("Recipe do not exists");
            return res.status(403).json({
                success: false,
                message: "Recipe you are trying to delete not exists"
            })
        }

        // Deleting from SavedRecipe collections
        await SavedRecipe.findOneAndDelete({spoonacularId: recipeId, user: userId});

        await User.findByIdAndUpdate(
            userId,
            {$pull: {favoriteRecipes: recipe._id}},
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "Recipe deleted successfully"
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