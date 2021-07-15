const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LikeSchema = new mongoose.Schema (
    
    {   
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },

        errandId: {
            type: Schema.Types.ObjectId,
            ref: 'errand'
        }
        
    },

    {
        timestamps: true
    }
)

const Like = mongoose.model('like', LikeSchema)

module.exports = Like