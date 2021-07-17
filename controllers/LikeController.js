const express = require ('express')
const UserModel = require ('../models/User')
const ErrandModel = require('../models/Errand')
const LikeModel =  require('../models/Like')

const controller = {

    like: async (req, res) => {

        const { errandId,  userId } = req.body

        let likes = await LikeModel.find({ errandId : errandId})

        if (!likes) {

            res.status(400).json(
                { 
                    success: false,
                    "msg": "unable to get likes"
                })
            
            return
        }


        res.status(200).json(
            {
                success: true,
                likes
            })
        

    },

    addLike: async (req, res) => {

        const { errandId,  userId } = req.body

        const Like = await LikeModel.create(
            {
                errandId: errandId,
                userId: userId
            }
        )

        if(Like) {
            res.status(200).json ({
                success: true,
                "msg": "Liked"
            })
        }       
    },

    removeLike: async (req, res) => {

        const { errandId,  userId } = req.body

        await LikeModel.findOneAndDelete(
            {
                errandId: errandId,
                userId: userId
            }
        )
        
        res.status(200).json ({
            success: true,
            "msg": "Like removed"
        })       
    },
}

module.exports = controller