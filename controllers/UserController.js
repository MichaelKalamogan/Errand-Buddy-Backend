require('dotenv').config()
const express = require ('express')
const UserModel = require ('../models/User')
const Errand = require('../models/Errand')
const router = express.Router()
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')

const controller = {

    //Register new user
    register: async(req, res) => {

        const { name, password, password2, email } = req.body

        //checking if there is already such an email registered in database
        let user = await UserModel.findOne ({
            email: email
        })
              
        if (user) {
            //redirect back to registration page if registered 
            //res.redirect('/api/users/register')
            res.json({msg:'user exists'})
            return
        }
            
        //Hashing the password and salt rounds of 10 using bcryptjs
        const hash = await bcrypt.hashSync(password, 10)

        await UserModel.create ({
                    name: name,
                    email: email,
                    password: hash
        })

        res.json({msg: 'User registered'})
    },

    //Log in
    login: async (req,res) => {

        const { email, password } = req.body

        //checking if there is already such an email registered in database
        let user = await UserModel.findOne ({
            email: email
        })
        
        //If no such user, redirect to registration page
        if (!user) {
            //res.redirect('/api/users/register')
            return res.status(400).json({ msg:'Invalid credentials'})
        }

        //Match password entered with database password
        const checkPassword = await bcrypt.compareSync(password, user.password)

        //if password don't match, redirect back to login page
        if(!checkPassword) {
            return res.status(400).json({ msg:'Invalid credentials'})
        }

        //Payload for jsonwebtoken
        const payload = {
            user: { id: user.id }
        }

        //Creating the jsonwebtoken
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7 days" })

        //Sending the created jsonwebtoken 
        res.json({ token: token })
    },

    //Reset Password of user
    resetPassword: async (req, res) => {

    },

    //User's dashbaord page
    dashboard: async (req, res) => {

    },

    //Create an Errand
    create: async (req, res) => {

    },

    //Accept an Errand
    acceptErrand: async(req, res) => {

    },

    //Log out the user


}

module.exports = controller