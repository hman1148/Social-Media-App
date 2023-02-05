import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../Models/User.js";


/* Register User */
export const register = async (req, res) => {
    // grab all attributes of the user schema
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePaths,
            friends,
            location,
            occupation
        } = req.body;

        // begin to encrypt the user password
        const salt = await bycrpt.genSalt();
        const passwordHash = await bycrpt.hash(password, salt);

        // where we create the user with the encrypted password 
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePaths,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 100000), // dummy value,
            impressions: Math.floor(Math.random() * 10000)
        });

        // create the new user and send the json data to the front end
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

/* Loggin in */
export const login = async (req, res) => {
    // our authentication
    try {
        // we use mongoose to locate the user when they attempt to login
        const {email, password} = req.body;
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ msg: "User does not exist." });
        }

        const isMatch = await bycrpt.compare(password, user.password);
       
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        // delete the password so its not sent to the front end
        delete user.password;

        // if everything workds, then send the user data to the front end
        res.status(200).json({token, user});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}