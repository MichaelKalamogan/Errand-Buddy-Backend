const express = require ('express')
const UserModel = require ('../models/User')
const router = express.Router()
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const userController = require('../controllers/UserController')
const { upload } = require('../config/multer-config')
const { alrAuthenticated, authenticated } = require('../middleware/authenticate')


// =======================================
//              USER ROUTES
// =======================================

//Register User
router.post('/register', alrAuthenticated, userController.register)

//Log in User
router.post('/login', alrAuthenticated, userController.login)

//User's dashboard
router.get('/dashboard', authenticated, userController.dashboard)

//Reset Password of user
router.post('/forgot-password', userController.forgotPassword)

//Create an Errand
router.post('/create-errand', authenticated, upload.single("image"), userController.create)

//submit new password
router.patch('/reset-password/submit', userController.submitResetPassword)

// Reset password page
router.get('reset-password/:id/:token', userController.resetPassword)



//Log out the user


module.exports = router