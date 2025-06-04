const express = require("express")
const { addUser, loginUser, getAllUser, getSingleUser } = require("./userController")
const { authorizeUser, authorizeSubDomain } = require("./middlewares")
const router = express.Router()

router.get("/", (req, res) => {
    res.json({message: "Hello"})
})
router.post("/add-user", addUser)
router.post("/login-user", loginUser)
router.post("/user-profile", authorizeUser, (req, res) => {
    try {
        console.log("user-profile", req.hostname)
        return res.json({success: true, message: "You have access!", data: req.user, cookie: req.cookies})
    } catch (error) {
        console.log(error)
        return res.json({success: false, message: "unauthorized user!"})
    }
})
router.get("/get-all-user", getAllUser)
router.get("/get-single-user", authorizeUser, getSingleUser)
router.get("/authenticate-subdomain", authorizeSubDomain, (req, res) => {
    try {
        console.log("from subdomain main", req.cookies)
        console.log("from subdomain main", req.hostname)
        return res.json({success: true, message: "You have access!", cookie: req.cookies})
    } catch (error) {
        console.log(error)
        return res.json({success: false, message: "unauthorized user!"})
    }
})


module.exports = router