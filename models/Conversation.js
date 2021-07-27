const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConversationSchema = new mongoose.Schema (
    
    {   
        members: { type: Array }, // at Pos 0 is always the user and at Pos 1 is always the seller
        errand_Id: { type: String },
        errand_desc: { type: String }
                
    },

    {
        timestamps: true
    }
)

const Conversation = mongoose.model('conversation', ConversationSchema)

module.exports = Conversation