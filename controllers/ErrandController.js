require('dotenv').config()
const express = require ('express')
const UserModel = require ('../models/User')
const ErrandModel = require('../models/Errand')
const WalletModel = require('../models/Wallet')
const sendEmail = require('../middleware/email')


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
        if (req.user.id === errand.user_id) {

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
        if (req.user.id !== buddy.id) {

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
        let poster =  await UserModel.findById(errand.user_id)
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
                $set : {
                    balance: `${poster_new_balance}`,
                },
                $push: { transaction : posterTransaction }
            }
        )
        
        //Update Buddy's wallet and balance

        let buddy_new_balance =  Number(buddy.wallet.balance) + errand_cost

        let buddyTransaction = {

            prev_bal: `${buddy.wallet.balance}`,
            new_bal: `${buddy_new_balance}`,
            amount_credited: `${errand_cost}`,
            type: "Payment for Errand",
            from: poster.username,
            to: buddy.username,
            date: Date.now()
        }

        await WalletModel.findByIdAndUpdate(buddy.wallet.id, 
            {
                $set : {
                    balance: `${buddy_new_balance}`,
                },
                $push: { transaction : buddyTransaction }
            }
        )

        //Send email to errand poster and buddy to dispute if needed and send review

        let posterEmailBody = `Payment amounting to $${errand_cost} was debited from your wallet for errand id:${errand.id}.
                                If there are disputes please email us wihtin 14 days. Thank you`

        let buddyEmailBody = `Payment amounting to $${errand_cost} was credited to your wallet for errand id:${errand.id}.
                                If there are disputes please email us wihtin 14 days. Do leave a review of the job. Thank you`

        await sendEmail(poster.email, 'Payment debited from wallet', posterEmailBody, 'email send to errand poster')
        await sendEmail(buddy.email, 'Payment credited to wallet', buddyEmailBody, 'email sent to buddy' )
    }
}

module.exports = controller