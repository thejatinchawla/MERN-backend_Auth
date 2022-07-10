const jwt = require("jsonwebtoken")
const Details = require("../models/details")

const auth = async (req,res,next) =>{
    try {
    const token = req.cookies.loginJWT 
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
    console.log(verifyUser)
    const user = await Details.findOne({_id:verifyUser._id})
    // console.log(user.cpassword);

    req.token = token
    req.user = user 
    next()
    } catch (error) {
        res.status(401).send(error)
    }
}
module.exports = auth
    