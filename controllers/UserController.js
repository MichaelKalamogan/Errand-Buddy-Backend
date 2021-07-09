const express = require ('express')
const UserModel = require ('../models/User')
const router = express.Router()
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')

const controller = {

    register: async(req, res) => {

        const { name, password, email } = req.body

        let result = await UserModel.findOne ({
            email: email
        })
        
        
        if (result) {
            //redirect back to registration page if registered 
            //res.redirect('/users/register')
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
    }
    
}

module.exports = controller