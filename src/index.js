import { connectDB } from "./db/index.js";
import app from "./app.js";
import http from 'http'
const server = http.createServer(app)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

// CORS Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;


connectDB()
        .then(()=>{
            app.on("error", (err) => {
                console.log("An error occurred while connecting with the database:", err);
              }); 
          
              // Socket.IO logic
              // initSocket(server);
          
              // Start server
              app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
              });
        })
        .catch((err)=>{
            throw new Error(err.message); 
        })
