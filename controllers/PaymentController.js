require('dotenv').config()
const express = require ('express')
const sendEmail = require('../middleware/email')
const { number } = require('joi')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { v4: uuidv4 } = require('uuid')
const { authenticated } = require('../middleware/authenticate')




const controller = {

    checkout: async (req, res) => {

        console.log(req.body)
        let { product } = req.body

        console.log(product.name)
    
        // const idempotencyKey = uuidv4()
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'sgd',
                  product_data: {
                    name: product.name,
                    images: [product.image]
                  },
                  unit_amount: product.price *100,
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/?success=true`,
            cancel_url: `http://localhost:3000/?canceled=true`,
          });

          res.redirect(303, session.url)
    
        // const payment = await stripe.paymentIntents.create ({
        //     amount: amount,
        //     currency:"SGD", 
        //     description:"Errand",
        //     payment_method: id,
        //     confirm: true
    
        // })
    
        // res.json({
        //     message: "Payment Successful",
        //     success: true
        // }) 
    }
}

module.exports = controller