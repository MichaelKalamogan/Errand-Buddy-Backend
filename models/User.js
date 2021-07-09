const mongoose = require ('mongoose')

const UserSchema = new mongoose.Schema ({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    wallet_balance: { type: Number, default: 0 },
    date_updated: { type: Date, default: Date.now },
    reviews: [{
        rating: { type: Number },
        comment:{ type: String },
        user_id: { type: String },
        created: { type: Date, default: Date.now}
    }],

})

const User = mongoose.model ('user', UserSchema)

module.exports = User