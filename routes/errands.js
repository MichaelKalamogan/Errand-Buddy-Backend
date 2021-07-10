const express = require('express')
const errandController = require('../controllers/ErrandController')
const router = express.Router()
const { authenticated } = require('../middleware/authenticate')

// =======================================
//              ERRANDS ROUTES
// =======================================

//Show details of the Errand
router.get('/show/:id', authenticated, errandController.show)


module.exports = router