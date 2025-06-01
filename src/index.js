import { connectDB } from "./db/index.js";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
    origin: [process.env.CORS_ORIGIN, process.env.PRODUCTION_URL],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Import routes
import userRoutes from './routes/user.routes.js';

// Use routes
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Server is running'
    });
});

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        server.on("error", (err) => {
            console.log("Server error:", err);
        }); 
      
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });
