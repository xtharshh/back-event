import { isValidObjectId } from "mongoose";
import { Event } from "../models/event.model.js";
import { RegisteredEvent } from "../models/registeredEvent.model.js";
import { appendToEventSheet } from "../utils/googlesheets.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

const notifyAllUsers = async (content) => {
  const users = await User.find({});
  const notifications = users.map((user) => ({
    userId: user._id,
    content,
  }));
  await Notification.insertMany(notifications);
};

export const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      dateTime,
      location,
      category,
      coordinatorName,
      coordinatorContact,
      coordinatorEmail,
      club,
      department,
      facultyName,
      facultyEmail,
      description,
    } = req.body;

    if (
      !eventName ||
      !dateTime ||
      !location ||
      !category ||
      !coordinatorName ||
      !coordinatorContact ||
      !coordinatorEmail ||
      !club ||
      !department ||
      !facultyName ||
      !facultyEmail ||
      !description
    ) {
      console.log("fill the required fields");
      
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Event image is required." });
    }

    // Upload to Cloudinary
    const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);

    if (!result || !result.secure_url) {
      return res.status(500).json({ error: "Image upload failed." });
    }

    const newEvent = await Event.create({
      eventName,
      dateTime,
      location,
      category,
      coordinatorName,
      coordinatorContact,
      coordinatorEmail,
      club,
      department,
      facultyName,
      facultyEmail,
      description,
      eventImage : result.secure_url,
    });


    await notifyAllUsers(`🎉 New Event: ${eventName} is live!`);

    return res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Event Creation Error:", error);
    return res.status(500).json({ error: "Failed to create event." });
  }
};

export const getEvent = async (req, res) => {
   try {
    const getAllEvents = await Event.find({}).sort({dateTime : 1});

    if(!getAllEvents){
      return new Error("No events Found");
    }

    return res.status(200).json({events : getAllEvents})

   } catch (error) {
    return res.status(500).json({error : error.message})
   } 
};

export const getEventById = async(req,res)=>{
  try {
    const {eventid} = req.params;
  
    if(!isValidObjectId(eventid)){
      return new Error("Invalid event Id");
    }
  
    const event = await Event.find({_id:eventid})
    if(!event){
      res.status(404).json({error: "Event not found"})
    }
    return res.status(200).json(event)
  } catch (err) {
    res.status(500).json({error:err.message})
  }

};

export const registerForEvent = async (req, res) => {
  try {
    const { eventid } = req.params;
    const userId = req.user?._id;
    const {
      name,
      email,
      department,
      phoneNumber,
      section,
      collegeName,
      semester,
      rollNumber,
      eventName,
    } = req.body;

    if (!userId || !eventid) {
      return res.status(400).json({ message: "userId and eventId are required" });
    }

    const alreadyRegistered = await RegisteredEvent.findOne({
      userRegistered: userId,
      eventId: eventid,
    });

    if (alreadyRegistered) {
      return res.status(409).json({ message: "You are already registered for this event" });
    }

    if (!name || !email || !department || !phoneNumber || !section || !collegeName || !semester || !rollNumber || !eventName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Add to Google Sheet
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const safeEventName = eventName.replace(/[^a-zA-Z0-9]/g, "_");

    const rowData = [
      name,
      email,
      rollNumber,
      phoneNumber,
      collegeName,
      department,
      section,
      semester,
      eventName,
      new Date().toLocaleString(),
    ];

    await appendToEventSheet(spreadsheetId, safeEventName, rowData);

    // Save to DB
    const eventRegistered = await RegisteredEvent.create({
      eventId: eventid,
      userRegistered: userId,
    });

    res.status(200).json({ message: `Registered successfully for the event ${eventName}`, event:eventRegistered });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getRegisteredEvent = async (req, res) => {
  try {
    console.log("Entered");

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const registeredEvents = await RegisteredEvent.find({ userRegistered: userId }).populate("eventId");
    console.log("events",registeredEvents);
    
    // if (!registeredEvents || registeredEvents.length === 0) {
    //   return res.status(400).json({ error: "User is not registered for any event" });
    // }


    return res.status(200).json(registeredEvents);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getNoOfEventCount = async(req,res)=>{
  try {
    const {eventId} = req.params;
    if(!isValidObjectId(eventId)){
      return res.status(400).json({error:"Invalid Event Id"});
    }
    const count = await RegisteredEvent.find({eventId}).countDocuments();

    return res.status(200).json({count});
  } catch (error) {
    return res.status(500).json({error : error.message})
  }
}



