// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

// const cors = require("cors");
// const dotenv = require("dotenv");
// const multer = require("multer");
// const helment = require("helmet");
// const morgan = require("morgan");


// const path = require("path");
// const { fileURLToPath } = require("url"); // may need to change to direct imports

// const {register} = require("./controllers/auth.js");

import { fileURLToPath } from "url";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

import {register} from "./controllers/auth.js";



import path from "path";

const filename = fileURLToPath(import.meta.url);

const dirname = path.dirname(filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);



/* Mongoose Setup */

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedToplogy: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((err) => console.log(err));



