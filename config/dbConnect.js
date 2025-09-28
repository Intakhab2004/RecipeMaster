const mongoose = require("mongoose");


const dbConnect = async() => {
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Database connected with the server successfully");
    }
    catch(error){
        console.log("Something went wrong while connecting with the DB");
        console.error("An error occured: ", error);

        process.exit(1);
    }
}

module.exports = dbConnect;