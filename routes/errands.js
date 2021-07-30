const express = require('express')
const errandController = require('../controllers/ErrandController')
const likeController = require('../controllers/LikeController')
const router = express.Router()
const { upload } = require('../config/multer-config')
const { authenticated } = require('../middleware/authenticate')

// =======================================
//              ERRANDS ROUTES
// =======================================

//Retrieve likes
router.post('/like', likeController.like)

//Add likes
router.post('/like/addLike', likeController.addLike)

//Remove likes
router.post('/like/removeLike', likeController.removeLike)

//Show details of the Errand
router.get('/show/:id', errandController.show)

//When Errand has been accepted by somebody
router.post('/:id/accepted', authenticated, errandController.accept)

//Completing the errand
router.post('/:id/completed', authenticated, errandController.complete)

//Info to update the errand
router.get('/:id/update', authenticated, errandController.edit)

//Buddy to cancel errand order that he accepted
router.post('/:id/buddycancel', authenticated, errandController.buddyCancel)

//Update the errand
router.patch('/:id/update', authenticated, upload.single("image"), errandController.update)

//Deleting the errand
router.delete('/:id/delete', authenticated, errandController.delete)

//Reviews for the errand
router.post('/:id/completed/review', authenticated, errandController.review)

//Update payment
router.patch('/successfulpayment', authenticated, errandController.successfulPayment)

module.exports = router