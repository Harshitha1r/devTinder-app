const jwt = require('jsonwebtoken')
const User = require('../Schema/userSchema')
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        const isTokenValid = jwt.verify(token, "harshitha@123")
        if (isTokenValid._id) {
            const user = await User.findById(isTokenValid._id)
            req.user = user
            next();
        } else {
            res.status(401).send("User not logged in")
        }
    }
    catch (err) {
        res.status(400).send("Error:" + err)
    }
}

module.exports = userAuth