const express = require("express")
const router = require("./controllers/route")
const app = express()
const mongoose = require("mongoose")

// console.log(process.env.MONGODB_URL)
mongoose.connect("mongodb+srv://hrsohel2705:JFw5XvJpNFwUJ1Zp@cluster0.dzk2x3p.mongodb.net/user-authentication?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Database connected."))
.catch((error) => console.error(error.message))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router)

app.listen(4000, () => console.log("Server listening...."))