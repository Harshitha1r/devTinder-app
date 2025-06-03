const jwt = require('jsonwebtoken')
const User = require('../Schema/userSchema')
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        const isTokenValid = jwt.verify(token, process.env.SECRET_KEY)
        if (isTokenValid._id) {
            const user = await User.findById(isTokenValid._id)
            req.user = user
            next();
        } else {
            res.status(401).json({message:"User not authorized"})
        }
    }
    catch (err) {
        res.status(500).json({message:err.message})
    }
}

module.exports = userAuth