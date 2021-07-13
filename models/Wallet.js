const mongoose = require ('mongoose')

const WalletSchema = new mongoose.Schema (
    {   
        balance: { type: String, required: true, default: '0'},
        
        transaction: [
        {
            prev_bal: { type: String },
            new_bal: { type: String },
            amount_debited: { type: String },
            amount_credited: { type: String },
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