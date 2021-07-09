const express = require ('express')
const UserModel = require ('../models/User')
const router = express.Router()
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const userController = require('../controllers/UserController')
const { alrAuthenticated, authenticated } = require('../middleware/authenticate')

// =======================================
//              USER ROUTES
// =======================================

//testing and to be deleted
router.get('/', (req,res) => res.json({msg:'works'})) 

//Register User
router.post('/register', alrAuthenticated, userController.register)

//Log in User
router.post('/login', alrAuthenticated, userController.login)

//User's dashboard
router.get('/dashboard', authenticated, userController.dashboard)

//Reset Password of user
router.post('/reset-password', userController.resetPassword)

//Create an Errand
router.post('/create-errand', authenticated, userController.create)

//Accept an Errand
router.post('/accept-errand', authenticated, userController.acceptErrand) 

//Log out the user


module.exports = router