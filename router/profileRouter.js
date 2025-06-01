const express = require('express')
const profileRouter = express.Router();
const userAuth = require('../Config/utils')
const bcrypt = require('bcrypt')

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send({ message: "User info retrieved successfully", data:user })
    }
    catch (err) {
        res.status(40).send("Err" + err)
    }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        const data = req.body
        const allowedFields = ["firstName", "lastName", "skills","photoUrl","age","about"]
        if (Object.keys(data).every(key => allowedFields.includes(key))) {
            const user = req.user
            Object.keys(data).forEach(key => user[key] = data[key])
            await user.save();
            res.json({ message: "Updated successfully", data:user })
        } else {
            throw new Error("Failed to update")
        }

    }
    catch (err) {
        res.status(400).send("Error:" + err.message)
    }
})

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const password = req.body.password;
        const hashedPas = await bcrypt.hash(password, 10)
        const user = req.user
        user.password = hashedPas
        await user.save();
        res.json({ message: "Updated successfully", user })
    }
    catch (err) {
        res.status(400).send("Error:" + err.message)
    }
})

module.exports = profileRouter