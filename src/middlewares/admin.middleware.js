import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";

export const verifyAdmin = async (req,next,res)=>{
    const userId = req.user?._id;
    console.log(userId);
    
    if(isValidObjectId(userId)){
        res.status(404).send("UserId is invalid");
    }

    const user = await User.findOne({_id : userId});

    if(!user.isAuthorized){
       return res.status(404).send("Unauthorized")
    }

    next();

}