require('dotenv').config()
const express = require ('express')
const sendEmail = require('../middleware/email')
const { number } = require('joi')
const UserModel = require('../models/User')
const ErrandModel =  require('../models/Errand')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const controller = {

    checkout: async (req, res) => {

        let { line_items, user_id, errandId } = req.body // get errand id to update mongoose of session id in case payment fails
        
        let user = await UserModel.findById(user_id)
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            customer_email : user.email,
            mode: 'payment',
            success_url: `http://localhost:3000/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/canceled`,
          });
        
        await ErrandModel.findByIdAndUpdate (errandId,
            { 
                $set: { 
                    sessionId: session.id,
                }
            }, 
        )

        res.status(200).json({ sessionId: session.id})
    }
}

module.exports = controller