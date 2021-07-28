const express = require('express')
const chatController = require('../controllers/ChatController')
const router = express.Router()

router.post('/newconversation', chatController.newConversation)

router.post('/newmessage',chatController.newMessage)

router.get('/:conversationId', chatController.getMessages)

router.get('/buyerconversations/:username', chatController.getBuyerConversations)

router.get('/sellerconversations/:username', chatController.getSellerConversations)

module.exports = router