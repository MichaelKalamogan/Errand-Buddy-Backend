const express = require('express')
const errandController = require('../controllers/ErrandController')
const likeController = require('../controllers/LikeController')
const router = express.Router()
const { authenticated } = require('../middleware/authenticate')

// =======================================
//              ERRANDS ROUTES
// =======================================

//Like the Errand
router.post('/like', likeController.like)

//Show details of the Errand
router.get('/show/:id', errandController.show)

//When Errand has been accepted by somebody
router.post('/:id/accepted', authenticated, errandController.accept)

//Completing the errand
router.post('/:id/completed', authenticated, errandController.complete)

//Deleting the errand
router.post('/:id/delete', authenticated, errandController.delete)

//Reviews for the errand
router.post('/:id/completed/review', authenticated, errandController.review)

module.exports = router