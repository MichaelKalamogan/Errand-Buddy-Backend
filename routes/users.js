const express = require ('express')
const UserModel = require ('../models/User')
const router = express.Router()
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const userController = require('../controllers/UserController')

//User routes

router.get('/', (req,res) => res.json({msg:'works'}))
router.post('/register', userController.register)


module.exports = router