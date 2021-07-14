const express = require('express')
const errandController = require('../controllers/ErrandController')
const router = express.Router()
const { authenticated } = require('../middleware/authenticate')

// =======================================
//              ERRANDS ROUTES
// =======================================

//Show details of the Errand
router.get('/show/:id', authenticated, errandController.show)

//When Errand has been accepted by somebody
router.post('/show/:id/accepted', authenticated, errandController.accept)

//Completing the errand
router.post('/:id/completed', authenticated, errandController.complete)

//Reviews for the errand
router.post('/:id/completed/review', authenticated, errandController.review)

module.exports = router