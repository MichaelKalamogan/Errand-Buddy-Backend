const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConversationSchema = new mongoose.Schema (
    
    {   
        buyer: { type: String },
        seller: { type: String },
        errand_Id: { type: String },
        errand_desc: { type: String }
                
    },

    {
        timestamps: true
    }
)

const Conversation = mongoose.model('conversation', ConversationSchema)

module.exports = Conversation