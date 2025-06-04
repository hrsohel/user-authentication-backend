const express = require("express")
const router = require("./controllers/route")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser");
const session = require("express-session")
const MongoStore = require("connect-mongo")
require("dotenv").config({})

app.use(
  cors({
      origin: (origin, callback) => {
      if (
        !origin ||
        origin === "http://localhost:5173" ||
        origin.endsWith(".localhost:5173") ||
        origin === "https://user-authentication-frontend-hazel.vercel.app"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "X-Auth-Token", "X-CSRF-Token"],
  })
);

mongoose.connect("mongodb+srv://hrsohel2705:JFw5XvJpNFwUJ1Zp@cluster0.dzk2x3p.mongodb.net/user-authentication?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Database connected."))
.catch((error) => console.error(error.message))
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router)

app.listen(4000, () => console.log("Server listening...."))