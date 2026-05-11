import mongoose from "mongoose"

async function connectDB(){
    const mongoURI = process.env.MONGO_URI
  
    try {
        await mongoose.connect(mongoURI)
        console.log("Database Connected...")
    } catch (error) {
        console.error("db error", error.message)
        process.exit(1)
    }
}

export default connectDB 