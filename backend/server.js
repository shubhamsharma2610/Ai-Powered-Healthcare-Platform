
import 'dotenv/config';
import app from './src/app.js'

const { default: connectDB } = await import("./src/config/db.js")

// Database connection
connectDB()

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
