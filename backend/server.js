import app from './src/app.js'





const PORT=process.env.PORT || 3001
app.listen(PORT,(req,res)=>{
    console.log("Server is running http://localhost:3000")
})
