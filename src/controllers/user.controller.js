import { User } from "../models/user.model.js";
import { Profile } from "../models/profile.model.js";


// import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    // console.log(username, fullName, email, password);

    // Check for missing fields
    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    // Check if user already exists (by email)
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ error: "User already exists with this email." });
    }

    // Optional: check for username duplication if it's also unique
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken." });
    }


    // Create the new user
    const newUser = await User.create({
      username,
      fullName,
      email,
      password
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ error: "Something went wrong during registration." });
  }
};


export const profile = async (req,res)=>{
    try {
        const userId = req.user?._id; // Get user ID from session (Passport)
        const { department, phoneNumber, section, collegeName, semester, rollNumber, bio } = req.body;

        console.log(department, phoneNumber, section, collegeName, semester, rollNumber, bio );
        
    
        if (!userId || !department || !phoneNumber || !section || !collegeName || !semester || !rollNumber) {
          return res.status(400).json({ error: "All fields are required." });
        }
    
        const newProfile = await Profile.create({
          userId,
          department,
          phoneNumber,
          section,
          collegeName,
          semester,
          rollNumber,
          bio
        });
    
        return res.status(201).json({ message: "Profile created successfully", profile: newProfile });
      } catch (error) {
        console.error("Error creating profile:", error);
        return res.status(500).json({ error: "Failed to create profile." });
      }
}

export const getProfile = async (req,res)=>{
  console.log("session",req.session);

  const userId = req.user?._id;
  console.log("userid",userId);
  

  if(!isValidObjectId(userId)){
    return new Error("Invalid User Id")
  }
  const details = await Profile.findOne({userId})?.populate("userId")
  console.log(details);

  if(!details){
    const details2 = await User.findById(userId)
    console.log("details2", details2);
    
    return res.status(200).json(details2)
  }
  
  return res.status(200).json(details)
}

export const updateProfile = async (req,res)=>{ 
  try {
    const userId = req.user?._id;

    const { department, phoneNumber, section, semester, rollNumber, bio } = req.body;

    if(!isValidObjectId(userId)){
      return new Error("Invalid User Id")
    }

    if (!department || !phoneNumber || !section || !semester) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const updatedUser = await Profile.findOneAndUpdate({userId}, {department,phoneNumber, section, semester, rollNumber, bio}, {new:true})
    return res.status(200).json({updatedUser})
  } catch (error) {
    console.log(error.message);
  }
}

export const changePassword = async (req,res)=>{
  try {
    const userId = req.user?._id
    if(!isValidObjectId(userId)){
      return res.status(404).json({error:"UserID not found or is invalid"})
    }
    const {currentPassword, newPassword} = req.body
    if(!currentPassword || !newPassword){
      return res.status(400).json({error : "all fields are required"})
    }

    const user = await User.findById(userId);
    const isMatch = await user.comparePassword(currentPassword, user.password);

    if(!isMatch){
      return res.status(409).json({error : "Your current password is not valid"})
    }

    user.password=newPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200).json({message : "Password change successfully"})

  } catch (error) {
    return res.status(500).json({error : error.message}); 
  }
}
