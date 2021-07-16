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
        
        console.log('likes retrieved')
    },

    addLike: async (req, res) => {

        console.log('tried to add like')

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

        console.log('like added')
        
    },

    removeLike: async (req, res) => {

        console.log('tried to remove like')

        const { errand_Id,  userId } = req.body

        LikeModel.findOneAndDelete(
            {
                errandId: errand_Id,
                userId: userId
            }
        )
        
        res.status(200).json ({
            success: true,
            "msg": "Like removed"
        })
        console.log('like removed')
        
    },

}

module.exports = controller