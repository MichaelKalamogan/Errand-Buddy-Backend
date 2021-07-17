const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema (
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        date: { type: Date, default: Date.now },
        wallet: { type: Schema.Types.ObjectId, ref: 'wallet' },
        reviews: [{
            rating: { type: Number },
            review: { type: String },
            errand_id: { type: String }, 
            errand_summary: { type: String },
            user_name: { type: String },
            user_id: { type: String },
            created: { type: Date, default: Date.now}
        }],
    }, 
    
    {
        timestamps: true
    }
)

const User = mongoose.model ('user', UserSchema)

module.exports = User