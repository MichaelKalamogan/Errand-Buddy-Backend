const mongoose = require('mongoose')

const ErrandSchema = new mongoose.Schema (
    {   
        //User's database user_id to track errands
        user_id: { type: String, required: true },

        //User nickname to be displayed
        username: { type: String, required: true },
        category: { type: String, required: true },
        items: { type: String, required: true },
        image: { type: String },
        cloudinary_id: {type: String},
        likes: [
            {   
                total: {type: Number, default: 0},
                liked_by: [{ type: String }]
            }
        ],
        description: { type: String, required: true },
        pickupLocation: { type: String, required: true },
        pickupLatitude: { type: Number },
        pickupLongtitude: { type: Number },
        deliveryLocation: { type: String, required: true},
        deliveryLatitude: { type: Number },
        deliveryLongtitude: { type: Number},
        pickupTime: { type: Date, required: true },
        deliveryTime: { type: Date, required: true},
        itemPrice: { type: String, required: true },
        errandFee: { type: String, required: true },
        paid: { type: Boolean, default: false },
        status: { type: String, default: "available" },
        sessionId: { type: String },
        fulfilled_by: { type: String }
    }, 

    {   
        timestamps: true 
    }
)

const ErrandModel = mongoose.model ('errand', ErrandSchema)

module.exports = ErrandModel