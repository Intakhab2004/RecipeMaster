const express = require("express");
const dbConnect = require("./config/dbConnect");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoute");
const recipeRoutes = require("./routes/recipeRoute");

const app = express();

require("dotenv").config();


// Required middlewares
app.use(express.json());
app.use(cookieParser());

// Mounting api-url on routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/recipe", recipeRoutes);


// Starting the server
const PORT = process.env.PORT || 5000;
const startServer = async() => {
    try{
        await dbConnect();
        app.listen(PORT, () => {
            console.log(`App is up and running at port no. ${PORT}`);
        })
    }
    catch(error){
        console.log("Something went wrong: ", error);
    }
}

startServer();

// Default Route
app.get("/", (req, res) => {
    console.log("Your server is up and running");
    return res.status(200).json({
        success: true,
        message: "Your server is running"
    })
})

