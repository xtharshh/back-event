import mongoose, { Schema, model } from "mongoose";

const registerForEvent = new Schema({
    eventId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Event"
    },
    userRegistered : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
},{timestamps:true})

export const RegisteredEvent = model("RegisteredEvent", registerForEvent)