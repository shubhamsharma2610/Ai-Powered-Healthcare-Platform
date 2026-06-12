import 'dotenv/config';
import app from './src/app.js'

const { default: connectDB } = await import("./src/config/db.js")

// Database connection
connectDB()

// ✅ Use PORT from environment (Render sets this to 10000)
const PORT = process.env.PORT || 3001

// ✅ CRITICAL: Bind to '0.0.0.0' for Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`)
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`)
})