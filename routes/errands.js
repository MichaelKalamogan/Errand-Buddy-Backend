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

//Update the errand
router.post('/:id/update', authenticated, upload.single("image"), errandController.update)

//Deleting the errand
router.post('/:id/delete', authenticated, errandController.delete)

//Reviews for the errand
router.post('/:id/completed/review', authenticated, errandController.review)

module.exports = router