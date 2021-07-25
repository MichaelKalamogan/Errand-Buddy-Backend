require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

function stripeSession (user, line_items) {

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items, // line_items have to be defined before calling the function
        customer_email : user.email,
        mode: 'payment',
        success_url: `http://localhost:3000/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/canceled`,
      });

    return session

}

module.exports = stripeSession