import mongoose, {Schema, model} from "mongoose";

const profileSchema = new Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    department : {
        type : String,
        required : true, 
    },
    phoneNumber : {
        type : Number,
        required: true
    },
    section : {
        type : String,
        required: true
    },
    collegeName : {
        type : String,
        required : true
    },
    semester : {
        type : Number,
        required  : true
    },
    rollNumber : {
        type : String,
        required : true
    },
    bio : {
        type : String
    }
},{timestamps:true})

export const Profile = model("Profile" , profileSchema);