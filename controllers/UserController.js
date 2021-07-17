require('dotenv').config()
const express = require ('express')
const UserModel = require ('../models/User')
const ErrandModel = require('../models/Errand')
const WalletModel = require('../models/Wallet')
const router = express.Router()
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const cloudinary = require('../config/cloudinary-config')
const multer =  require('multer')
const streamifier = require('streamifier')
const { streamUpload } = require('../config/multer-config')
const nodemailer = require('nodemailer');


const controller = {

    //Register new user
    register: async(req, res) => {

        const { name, password, password2, email, username } = req.body

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

        if(password !== password2) {
            //redirect back to registration page if registered 
            //res.redirect('/api/users/register')
            res.json({ "msg":'Passwords do not match' })
            return
        }
            
        //Hashing the password and salt rounds of 10 using bcryptjs
        const hash = await bcrypt.hashSync(password, 10)

        //create new wallet
        let newWallet = await WalletModel.create({
            transaction: [{
                type: "initiate wallet"
            }]
        })

        await UserModel.create ({
            name: name,
            username: username,
            email: email,
            password: hash,
            wallet: newWallet.id
        })

        res.json({ "msg" : 'User registered'})
    },

    //Log in
    login: async (req, res) => {

        const { email, password } = req.body

        //checking if there is already such an email registered in database
        let user = await UserModel.findOne ({
            email: email
        })
        
        //If no such user, redirect to registration page
        if (!user) {
            //res.redirect('/api/users/register')
            return res.status(400).json({ "msg" :'Invalid credentials'})
        }

        //Match password entered with database password
        const checkPassword = await bcrypt.compareSync(password, user.password)

        //if password don't match, redirect back to login page
        if(!checkPassword) {
            return res.status(400).json({ "msg":'Invalid credentials'})
        }

        //Payload for jsonwebtoken
        const payload = {
            user: { id: user.id }
        }

        //Creating the jsonwebtoken
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7 days" })
    
        //Sending the created jsonwebtoken 
        res.json(
            { 
                "msg": "success", 
                token: token,
                userId: user.id
            })
    },

    //Submit password reset request
    forgotPassword: async (req, res) => {

        const { email } = req.body

        //Checking if there is already such an email registered in database
        let user = await UserModel.findOne ({
            email: email
        })
        
        //If no such user, redirect to registration page
        if (!user) {
            //res.redirect('/api/users/register')
            return res.status(400).json({ msg:'Invalid credentials'})
        }

        //creating a jwt to create and verify the reset password link
        let resetToken = process.env.JWT_SECRET + resetUser.password

        const payload = {
            email: email
        }

        const token = jwt.sign (payload, resetToken, {expiresIn: 60})

        //The reset password link that will be sent to the user's email
        const link = `http://Errand-Buddy-BE.herokuapp.com/api/users/reset-password/${user._id}/${token}`

        let transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const message = {
            from: process.env.EMAIL_ADDRESS, // Sender address
            to: email ,         //  recipients
            subject: 'Reset Errand-Buddy Login Password', // Subject line
            text: link // link to reset
        };

        transport.sendMail(message, function(err, info) {
            if (err) {
                console.log(err)
            } else {
           
                res.json({"msg" : "Reset password link has been sent to your email"})
            }
        })

    },

    //Reset page if reset link is valid
    resetPassword: async (req,res) => {

        const {id, token} = req.params

        const resetUser = await UserModel.findOne({_id : id})

        const resetToken = process.env.JWT_SECRET + resetUser.password


        try {
            const decoded = jwt.verify(token, resetToken)
            
            res.json({"msg" : "valid link"})

        } catch(error) {
           console.log(error.message)
           res.json({"msg": error.message})
        }

    },

    submitResetPassword: async(req,res) => {
        
        
        const {id, password, password2} = req.body

        //ensuring the user knows the password being keyed in
        if (password !== password2) {

            res.json({"msg":"passwords don't match"})
            return
        }

        //Hash the password using bcrypt and saltrounds of 10
        const hash = bcrypt.hashSync(password, 10);

        let passUpdate = await UserModel.updateOne(
            { _id: id},

            {
                $set: {
                    password: hash,
                    updated_at: Date.now()
                }
            }

        )

        if (!passUpdate) {
            res.json ({"msg": 'password update failed'})

        } else {

            res.json ({"msg": 'password updated'})
        }
    },  

    //User's dashbaord page
    dashboard: async (req, res) => {

        //Getting the user details and errands created
        let user = await UserModel.findById(req.user.id).select("-password")
        let user_errands = await ErrandModel.find({ creator: req.user.id })
        // added
        let balance = await WalletModel.findById(user.wallet);
        let inProgress = await ErrandModel.find({
            fulfilled_by: req.user.id, 
            status: "Accepted: In-Progress"
        })
        let completed = await ErrandModel.find({
            fulfilled_by: req.user.id, 
            status: "Completed"
        })

        res.json({
            user: user, 
            errands: user_errands,
            balance,
            inProgress,
            completed
        })
    },

    //Create an Errand
    create: async (req, res) => {
console.log(465666);
        const { 
            category, 
            items, 
            description, 
            pickupLocation, 
            deliveryLocation,
            pickupTime,
            deliveryTime,
            itemPrice,
            errandFee, 

        } = req.body

        let newUpload = await streamUpload(req)

        const user = await UserModel.find({_id: req.user.id}, 'username')

        console.log(items, 123456);

        await ErrandModel.create ({

            user_id: req.user.id,
            username: user[0].username,
            category: category,
            items: items,
            image: newUpload.secure_url,
            cloudinary_id: newUpload.public_id,
            description: description,
            pickupLocation: pickupLocation,
            deliveryLocation: deliveryLocation,
            pickupTime: pickupTime,
            deliveryTime: deliveryTime,
            itemPrice: itemPrice,
            errandFee: errandFee,

        })

        res.json(
            {
                success: true,
                'msg': 'Errand successfully created'
            }
        )

    },


    //Log out the user


}

module.exports = controller