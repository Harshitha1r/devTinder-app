const User = require('../Schema/userSchema')
const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const hashedPas = await bcrypt.hash(data.password, 10)
        const user = new User({
            firstName: data.firstName, lastName: data.lastName,
            email: data.email, password: hashedPas, age: data.age, skills: data.skills,photoUrl:data.photoUrl,
            about:data.about,gender:data.gender
        })
        await user.save()
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
        res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)})
        res.json({message:"User added successfully",data:user})
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

authRouter.post('/login', async (req, res) => {
    const data = req.body;
    console.log(data)
    try {
        const userFound = await User.findOne({ email: data.email })
                    console.log(userFound)
        if (userFound) {
            const isValid = await bcrypt.compare(data.password, userFound.password)
            if (isValid) {
                const token = jwt.sign({ _id: userFound._id }, process.env.SECRET_KEY)
                res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
                res.json({ message: "Logged in successfully",data:userFound })
            } else {
                throw new Error("Password is not valid")
            }
        } else {
            throw new Error("Invalid Username and Password")
        }

    }
    catch (err) {
        res.status(500).json({message:err.message})
    }
})

authRouter.post('/logout', async(req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });    
  res.json({ message: "Logged out successfully" })
})

module.exports = authRouter