const express = require('express')
const chatController = require('../controllers/ChatController')
const router = express.Router()

router.post('/conversation', chatController.newConversation)

router.post('/message',chatController.newMessage)

router.get('/:conversationId', chatController.getMessages)

router.get('/conversation/:userId', chatController.getConversations)



module.exports = router