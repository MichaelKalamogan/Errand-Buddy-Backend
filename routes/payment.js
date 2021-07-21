require('dotenv').config()
const express = require('express')
const router = express.Router()
const { authenticated } = require('../middleware/authenticate')
const paymentController =  require('../controllers/PaymentController')


//checkout
router.post('/create-checkout-session', authenticated, paymentController.checkout)

module.exports = router