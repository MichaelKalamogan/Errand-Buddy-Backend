require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = {

    //Check if user is authenticated/logged in to access personal information
    authenticated: (req, res, next) => {

        const token = req.headers('x-auth-token')
    
        if(!token) {
            return res.status(401).json({msg: 'Not Logged in'})
        }
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded.user
        next()
    },

    //Check if already authenticated/logged in
    alrAuthenticated: (req, res, next) => {

        const token = req.headers('x-auth-token')
    
        if(token) {
            return res.redirect('/api/users/dashboard')
        }

        next()
    }
    

}

