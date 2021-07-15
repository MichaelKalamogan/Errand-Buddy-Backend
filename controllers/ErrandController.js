require('dotenv').config()
const express = require ('express')
const UserModel = require ('../models/User')
const ErrandModel = require('../models/Errand')
const WalletModel = require('../models/Wallet')
const sendEmail = require('../middleware/email')
const mongoose = require ('mongoose')
const mongodb = require('mongodb')


const controller = {

    //Show full details of the errand
    show: async (req,res) => {
        
        //Send details of the errand and a summary of the credibility of the person who posted the ad
        let errandDetails =  await ErrandModel.findById(req.params.id)
        let userDetails = await UserModel.findById(errandDetails.user_id, 'reviews.rating')

        res.json({errandDetails: errandDetails, userDetails: userDetails})
    },

    accept: async (req,res) => {

        let errand = ErrandModel.findById(req.params.id)

        //Ensuring that the person who posted the errand does not accept his own order
        if (req.user.id === errand.user_id) { // FE will check the user.id. and if the errand is the same person's, shoudl be a cancel button instead of accept.

            res.json({"msg": "Cannot accept own order"})
            return
        }
        
        await ErrandModel.findByIdAndUpdate(req.params.id, 
            { 
                $set: { 
                    status: 'Accepted: In-Progress',
                    fulfilled_by: req.user.id 
                }
            }, 

            { new : true }

        )

        res.json({"msg": "Job accepted successfully"})
    }, 

    complete: async(req,res) => {

        let errand = await ErrandModel.findById(req.params.id)
        let buddy = await UserModel.findById(errand.fulfilled_by)

        //Ensuring that the person who accepted the order is the person completing the order
        if (req.user.id !== buddy.id) { // FE will check the user.id. and if the errand is the same person's, shoudl be a cancel button instead of accept.

            res.json({"msg": "Not your order to complete"})
            return
        }



        //Change status to completed
        errand = await ErrandModel.findByIdAndUpdate(req.params.id, 
            { 

                $set: { 
                    status: 'Completed',
                }
            }, 

            { new : true }
        )

        // transfer money from errand poster wallet to wallet of person who fulfilled
        let poster = await UserModel.findById(errand.user_id)
        let poster_wallet = await WalletModel.findById(poster.wallet)


        let errand_cost = Number(errand.itemPrice) + Number(errand.errandFee)

        let poster_new_balance = Number(poster_wallet.balance) - errand_cost
        
        //Transaction to insert into wallet
        let posterTransaction = {

                prev_bal: `${poster_wallet.balance}`,
                new_bal: `${poster_new_balance}`,
                amount_debited: `${errand_cost}`,
                type: "Payment for Errand",
                from: poster.username,
                to: buddy.username,
                date: Date.now()
        }

        //Update Errand Poster's Wallet
        await WalletModel.findByIdAndUpdate(poster.wallet, 
            {
                $set: {
                    balance: `${poster_new_balance}`,
                },
                $push: { transaction : posterTransaction }
            }
        )
        
        //Update Buddy's wallet and balance
        let buddy_wallet =  await WalletModel.findById(buddy.wallet)
        let buddy_new_balance =  Number(buddy_wallet.balance) + errand_cost

        let buddyTransaction = {

            prev_bal: `${buddy_wallet.balance}`,
            new_bal: `${buddy_new_balance}`,
            amount_credited: `${errand_cost}`,
            type: "Payment for Errand",
            from: poster.username,
            to: buddy.username,
            date: Date.now()
        }

        await WalletModel.findByIdAndUpdate(buddy.wallet, 
            {
                $set : {
                    balance: `${buddy_new_balance}`,
                },
                $push: { transaction : buddyTransaction }
            }
        )

        //Send email to errand poster and buddy to dispute if needed and send review

        let posterEmailBody = `Payment amounting to $${errand_cost} was debited from your wallet for errand id:${errand.id}. If there are disputes please email us within 14 days. Thank you`

        let buddyEmailBody = `Payment amounting to $${errand_cost} was credited to your wallet for errand id:${errand.id}. If there are disputes please email us within 14 days. Please also do leave a review of the job. Thank you`

        // await sendEmail(poster.email, 'Payment debited from wallet', posterEmailBody, 'email send to errand poster')
        // await sendEmail(buddy.email, 'Payment credited to wallet', buddyEmailBody, 'email sent to buddy')

        res.json({"msg": "job completed succesfully"})
    },

    review: async(req,res) => { 

        const { rating , review } = req.body

        let errand = await ErrandModel.findById(req.params.id)

        if (req.user.id !== errand.fulfilled_by) {
            res.json({
                "msg" : "Not authorised to review"
            })

            return
        }

        let buddy = await UserModel.findById(errand.fulfilled_by)
        let poster = await UserModel.findById(errand.user_id)
        
        let existing_review = await UserModel.findOne({"reviews.errand_id": errand.id})

        // if(existing_review) {

        //     res.json({
        //         "msg" : "Review already provided"
        //     })

        //     return
        // }
        // let newReview = { 

        //     rating: rating,
        //     review: review,
        //     errand_id: errand.id,
        //     user_name: buddy.username,
        //     user_id: buddy.id      
        // }

        // await UserModel.findByIdAndUpdate(errand.user_id, {    
                
        //     $push: { reviews : newReview }   
        // })

        const average = await UserModel.aggregate([
            { $match: { _id: mongodb.ObjectId(errand.user_id) }},
            { $unwind: { path: '$reviews' }},
            { 
              $group: {
                _id: '$_id',
                averageReview: { $avg: '$reviews.rating' },
              },
            },
          ]);

        console.log(average)

        res.json ({

            "msg" : "Reviews successfully submitted"
        })
    }
}

module.exports = controller