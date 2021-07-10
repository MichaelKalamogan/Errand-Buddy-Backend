require('dotenv').config()
const express = require ('express')
const UserModel = require ('../models/User')
const ErrandModel = require('../models/Errand')
const router = express.Router()

const controller = {

    //Show full details of the errand
    show: async (req,res) => {

    },
}

module.exports = controller