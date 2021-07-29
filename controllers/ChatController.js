require('dotenv').config()
const express = require ('express')
const ConversationModel = require ('../models/Conversation')
const MessageModel = require ('../models/Message')

// =======================================
//              CHAT ROUTES
// =======================================

const controller = {

    //Sending all the errands available 
    newConversation: async (req,res) => {

        //Check if conversation already exists
        let conversation = await ConversationModel.findOne({
            'errand_Id': req.body.errand_Id, 'buyer': req.body.buyer} 
        )
        
        //If exists send the conversation Id to redirect
        if (conversation) {
            res.json({
                exists: true,
                conversation: conversation
            })

            return
        }

        //Initiate new conversation
        const newConversation = await ConversationModel.create({
            buyer: req.body.buyer,
            seller: req.body.seller,
            errand_Id: req.body.errand_Id,
            errand_desc: req.body.errand_desc,
        })

        res.json({
            success: true,
            conversation:  newConversation
        })
        
    },

    getBuyerConversations: async (req, res) => {

        const conversations = await ConversationModel.find({
            buyer: req.params.username} 
        )

        res.status(200).json(conversations)
    },
    
    getSellerConversations: async (req, res) => {

        const conversations = await ConversationModel.find({
            seller: req.params.username} 
        )

        res.status(200).json(conversations)

    },

    newMessage: async (req, res) => {

        const newMessage = await MessageModel.create(req.body.message)

        res.status(200).json(newMessage)
    },

    getMessages: async(req, res) => {

        const { conversationId } = req.params

        const messages = await MessageModel.find({
            conversationId: conversationId
        })

        res.status(200).json(messages)
    }
}


module.exports = controller