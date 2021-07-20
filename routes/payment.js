require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const { authenticated } = require('../middleware/authenticate')
const paymentController =  require('../controllers/PaymentController')

router.post('/check', (req, res) => res.send('working'))

//checkout
router.post('/create-checkout-session', authenticated, paymentController.checkout)

module.exports = router