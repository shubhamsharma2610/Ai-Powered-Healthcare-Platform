import app from './src/app.js'
import connectDB from "./src/config/db.js"
import dotenv from "dotenv"
dotenv.config()
// Database connection 

connectDB()


const PORT=process.env.PORT || 3001 

app.listen(PORT,(req,res)=>{
    console.log("Server is running on  http://localhost:3000")
})
