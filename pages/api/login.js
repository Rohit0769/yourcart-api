// Importing necessary modules and models
import Product from "@/models/Product";
import mongoose from "mongoose";
import User from "@/models/User";
import connectDb from "@/middleware/mongoose";
import { userAgent } from "next/server";
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');



// Connecting to the MongoDB database
// (Assuming connectDb is a function that connects to the database)
connectDb();

// Defining the API route handler
const handler = async (req, res) => {
    // Handling only POST requests
    if (req.method == 'POST') {
        // Finding a user in the database based on the provided email
        let user = await User.findOne({ "email": req.body.email });
        const bytes = CryptoJS.AES.decrypt(user.password, process.env.KEY_SECKRET);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);



        if (user) {
            // If a user is found, check if the provided password is correct
            if (req.body.email == user.email && req.body.password == originalText) {
                var token = jwt.sign({ email: user.email, name: user.name },  process.env.KEY_JWT,{
                    expiresIn:"20d"
                });
                res.status(200).json({success: true, token, email:user.email});
            } else {
                // If the password is incorrect, return an error response
                res.status(400).json({ success: false, error: "Invalid Credentials" });
            }
        } else {
            // If no user is found with the provided email, return an error response
            res.status(400).json({ success: false, error: "No User Found" });
        }
    } else {
        // Handling other HTTP methods and returning an error response
        res.status(400).json({ error: "This method is not allowed" });
    }
}

// Exporting the API route handler
export default connectDb(handler);
