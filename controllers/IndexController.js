const express = require('express')
const router = express.Router()
const UserModel = require ('../models/User')
const ErrandModel = require ('../models/Errand')
const geocode = require ('../utils/Geocode')


// =======================================
//              INDEX ROUTES
// =======================================

const controller = {

    //Sending all the errands available 
    home: async (req,res) => {

        let errandsAvailable = await ErrandModel
            .find({ status: "available" })
            .sort({ pickupTime: 1 }) 

        res.json({errands: errandsAvailable})

        
    }
}


module.exports = controller