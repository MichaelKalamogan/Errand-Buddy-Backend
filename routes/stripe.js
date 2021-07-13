require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const router = express.Router()
const { authenticated } = require('../middleware/authenticate')

router.post('/', authenticated, async (req, res) => {

    let { amount, id } = req.body

    const payment = await stripe.paymentIntents.create ({
        amount: amount,
        currency:"SGD", 
        description:"Errand",
        payment_method: id,
        confirm: true

    })

    res.json({
        message: "Payment Successful",
        success: true
    })
})

module.exports = router