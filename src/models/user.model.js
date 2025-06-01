import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import dotenv from "dotenv";


dotenv.config({ path: ".env" });

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // Optimized for search queries
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      trim: true,
      index: true, // Faster lookups
    },
    isAuthorized :{
      type : Boolean,
      default : false
    },

    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Prevents password from being returned in queries
    },
  })

userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password,10);
  next();
})

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);
