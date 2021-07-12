require('dotenv').config()
const express = require ('express')
const UserModel = require ('../models/User')
const ErrandModel = require('../models/Errand')


const controller = {

    //Show full details of the errand
    show: async (req,res) => {
        
        //Send details of the errand and a summary of the credibility of the person who posted the ad
        let errandDetails =  await ErrandModel.findById(req.params.id)
        let userDetails = await UserModel.findById(errandDetails.user_id, 'reviews.rating')

        res.json({errandDetails: errandDetails, userDetails: userDetails})
    },
}

module.exports = controller