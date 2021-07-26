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
            errand_Id: req.body.errand.id , members: {$in: [req.body.userId]} 
        })
        
        //If exists send the conversation Id to redirect
        if (conversation) {
            res.json({
                exists: true,
                conversation: conversation
            })

            return
        }

        //Initiate new conversation
        const newConversation = new ConversationModel.create({
            members: [ req.body.userId, req.body.sellerId],
            errand_Id: req.body.errand.id,
            errand_desc: req.body.errand.name,
        })

        res.json({
            success: true,
            conversation:  newConversation
        })
        
    },

    getConversations: async (req, res) => {
        const conversations = await ConversationModel.find({
            members: {$in: [req.body.userId]} 
        })

        res.status(200).json(conversations)
    },

    newMessage: async (req, res) => {

        const newMessage = await MessageModel.create(req.body)

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