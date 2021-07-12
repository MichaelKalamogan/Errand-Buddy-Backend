const mongoose = require ('mongoose')

const WalletSchema = new mongoose.Schema (
    {   
        balance: { type: Number, required: true, default: 0},
        
        transaction: [
        {
            type: { type: String },
            from: { type: String },
            to: { type: String },
            date: {type: Date, default: Date.now}
        }]
    },

    {
        timestamps: true
    }
)

const Wallet = mongoose.model('wallet', WalletSchema)

module.exports = Wallet