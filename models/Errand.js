const mongoose = require('mongoose')

const ErrandSchema = new mongoose.Schema ({

    description: { type: String, required: true},
    dateErrand: { type: Date, required: true},
    timePickUp: { type: String, required: true},
    timeDeliver: { type: String},
    date_created: { type: Date, default: Date.now },
    status: { type: String, default: "Awaiting Acceptance"},
    date_updated: { type: Date, default: Date.now }

})

const ErrandModel = mongoose.model ('errand', ErrandSchema)

module.exports = ErrandModel