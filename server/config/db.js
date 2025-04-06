const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
        }catch(err){
            console.error(err.message);
            process.exit(1);
        }
    };


// Define schema
module.exports=connectDB;