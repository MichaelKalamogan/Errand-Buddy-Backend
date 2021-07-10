const mongoose = require('mongoose')

const ErrandSchema = new mongoose.Schema ({

    creator: { type: String, required: true },
    description: { type: String, required: true },
    dateErrand: { type: Date, required: true },
    timePickUp: { type: String, required: true },
    timeDeliver: { type: String, required: true},
    date_created: { type: Date, default: Date.now },
    status: { type: String, default: "Awaiting Acceptance" },
    date_updated: { type: Date, default: Date.now },
    fulfilled_by: { type: String }

})

const ErrandModel = mongoose.model ('errand', ErrandSchema)

module.exports = ErrandModel