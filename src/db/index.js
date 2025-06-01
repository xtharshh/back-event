import mongoose from 'mongoose'
import { DB_Name } from '../constants.js'
import dotenv from 'dotenv'

dotenv.config({path:".env"})

export const connectDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
    } catch (error) {
        throw new Error(error.message);
    }
}