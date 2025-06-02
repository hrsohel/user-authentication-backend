const express = require("express")
const { addUser, loginUser } = require("./userController")
const { authorizeUser } = require("./middlewares")
const router = express.Router()

router.get("/", (req, res) => {
    res.json({message: "Hello"})
})
router.post("/add-user", addUser)
router.post("/login-user", loginUser)
router.post("/user-profile", authorizeUser, (req, res) => {
    try {
        return res.json({message: "You have access!", data: req.user})
    } catch (error) {
        console.log(error)
        return res.json({message: "unauthorized user!"})
    }
})


module.exports = router