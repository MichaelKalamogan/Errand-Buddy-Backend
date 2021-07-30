require('dotenv').config()
const express = require ('express')
const UserModel = require ('../models/User')
const ErrandModel = require('../models/Errand')
const WalletModel = require('../models/Wallet')
const LikeModel = require('../models/Like')
const sendEmail = require('../middleware/email')
const { Types } = require('mongoose')
const { update } = require('../models/User')
const { number } = require('joi')
const cloudinary = require('../config/cloudinary-config')
const {streamUpload} = require('../config/multer-config')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const controller = {

    //Show full details of the errand
    show: async (req,res) => {
        
        //Send details of the errand and a summary of the credibility of the person who posted the ad
        let errandDetails =  await ErrandModel.findById(req.params.id)
        let userDetails = await UserModel.findById(errandDetails.user_id, 'username reviews')
        let userAverage = "No Reviews yet"
        
        if(userDetails.reviews.length > 1) {
            
            let ratingObject = await UserModel.aggregate([
                { $match: { _id: Types.ObjectId(errandDetails.user_id)}},
                { $unwind: { path: '$reviews' }},
                { 
                  $group: {
                    _id: '$_id',
                    averageReview: { $avg: '$reviews.rating' },
                  },
                },
            ]);

            userAverage = Math.round((ratingObject[0].averageReview+ Number.EPSILON) * 100) / 100
        }   

        res.json(
            {
                errandDetails: errandDetails, 
                allReviews: userDetails.reviews, 
                averageRating: userAverage
            }
        )
    },

    accept: async (req,res) => {

        let errand = await ErrandModel.findById(req.params.id)

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

        // await sendEmail(poster.email, 'Payment debited from wallet', posterEmailBody)
        // await sendEmail(buddy.email, 'Payment credited to wallet', buddyEmailBody)

        res.json({"msg": "job completed succesfully"})
    },
    
    //
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

        if(existing_review) {

            res.json({
                "msg" : "Review already provided"
            })

            return
        }

        let newReview = { 

            rating: rating,
            review: review,
            errand_id: errand.id,
            errand_summary: errand.items,
            errand_image: errand.image,
            user_name: buddy.username,
            user_id: buddy.id,
            created: Date.now()
        }

        await UserModel.findByIdAndUpdate(errand.user_id, {    
                
            $push: { reviews : newReview }   
        })

        res.json ({

            "msg" : "Reviews successfully submitted"
        })
    },

    //Sending the errand information to render in the frontend for updating
    edit: async(req,res) => {

        let updateErrand = await ErrandModel.findById(req.params.id)

        res.json(
            {
                success: true,
                updateErrand
            }
        )
    },

    //Updating the database with the updated errand details
    update: async(req,res) => {

        const { 
            category, 
            items, 
            description, 
            pickupLocation, 
            deliveryLocation,
            pickupTime,
            deliveryTime,
            itemPrice,
            errandFee, 

        } = req.body

        let newTotalPrice = Number(itemPrice)+ Number(errandFee)

        let initialErrand = await ErrandModel.findById(req.params.id)
 
        if (initialErrand.user_id !== req.user.id) {
            res.status(403).json({
                "msg":"Not authorised to delete"
            })

            return
        }

        //To send an email, if needed, to the buddy to inform him of changes
        let order_accepted =  false
        if (initialErrand.status === "Accepted: In-Progress") {
            order_accepted = true
        }
        

        if(initialErrand.status === "Completed") {
            res.json({
                "msg" : "Not allowed to amend completed orders"
            })

            return
        }

        let newUpload = await streamUpload(req)
        let updatedErrand

        if(newUpload) {

            if(initialErrand.cloudinary_id) {
                cloudinary.uploader.destroy(initialErrand.cloudinary_id)
            }

            updatedErrand = await ErrandModel.findOneAndUpdate(
                { _id: req.params.id},
                {
                    $set: {
                        paid: false,
                        category: category,
                        items: items,
                        image: newUpload.secure_url,
                        cloudinary_id: newUpload.public_id,
                        description: description,
                        pickupLocation: pickupLocation,
                        deliveryLocation: deliveryLocation,
                        pickupTime: pickupTime,
                        deliveryTime: deliveryTime,
                        itemPrice: itemPrice,
                        errandFee: errandFee, 
                        totalPrice: newTotalPrice
                    }
                },

                { new : true }
            )

        } else {

            updatedErrand = await ErrandModel.findOneAndUpdate(
                { _id: req.params.id},
                {
                    $set: {
                        paid: false,
                        category: category,
                        items: items,
                        description: description,
                        pickupLocation: pickupLocation,
                        deliveryLocation: deliveryLocation,
                        pickupTime: pickupTime,
                        deliveryTime: deliveryTime,
                        itemPrice: itemPrice,
                        errandFee: errandFee,
                        totalPrice: newTotalPrice
                    }
                }, 

                { new : true }
            )


        }   

        //Send email to buddy informing of changes
        if (order_accepted) {

            let buddy = await UserModel.findById(updatedErrand.fulfilled_by)
            let emailBody = `${updatedErrand.username} made some changes to your errand order number ${updatedErrand._id}. Please take note of the updated changes and inform the seller if you are unable to fulfill the order.`
            sendEmail(buddy.email, 'Changes Made to Your Job Order', emailBody)

        }

        if (newTotalPrice > initialErrand.totalPrice) {

            let errandDifference = newTotalPrice - initialErrand.totalPrice
            res.json(
                {
                    priceChange: true,
                    errandInfo: {
                        errandId: updatedErrand.id,
                        errandName: updatedErrand.items,
                        errandPrice: errandDifference,
                        errandImage: updatedErrand.image,
                    },
                    'msg': 'Errand successfully created'
                }
            )

        } else { 
            res.json(
                { 
                    success: true,
                    updatedErrand, 
                    "msg" : "success" 
                }
            )
        }
        
 


    },

    delete: async(req, res) => {
        
        let deleteErrand = await ErrandModel.findById(req.params.id)

        if (deleteErrand.user_id !== req.user.id) {
            res.status(403).json({
                "msg":"Not authorised to delete"
            })

            return
        }

        let buddy = await UserModel.findById(deleteErrand.fulfilled_by)
        let user =  deleteErrand.username

        //To send an email, if needed, to the buddy to inform him of changes
        let order_accepted =  false
        if (deleteErrand.status === "Accepted: In-Progress") {
            order_accepted = true
        }

        await ErrandModel.deleteOne( {_id: req.params.id})
        await LikeModel.deleteMany({ errandId: req.params.id})

        if(deleteErrand.cloudinary_id) {
            cloudinary.uploader.destroy(deleteErrand.cloudinary_id)
        }

        if (order_accepted) {
           
            let emailBody = `${user} deleted your errand order number ${deleteErrand._id}. Please take note. Do take a look at our site on other available errands.`
            await sendEmail(buddy.email, 'Errand deleted', emailBody)
        }

        res.json(
            { 
                success: true, 
                "msg" : "success" 
            }
        )

    },

    successfulPayment: async (req, res) => {

        const { sessionId } = req.body

        const session = await stripe.checkout.sessions.retrieve ( sessionId )  
        const amountPaid = session.amount_total/100 // Because stripe amounts are in cents

        if(session.payment_status === "paid") {

            await ErrandModel.findOneAndUpdate({sessionId: sessionId } ,         
                { 
                    $set: { 
                        paid: true
                    },
                }, 
            )

            let poster = await UserModel.findOne({email: session.customer_email})
            let poster_wallet = await WalletModel.findById(poster.wallet)

            let walletPrevBal = Number(poster_wallet.balance)
            let walletNewBal = walletPrevBal + amountPaid

            let newTransaction = {

                prev_bal: walletPrevBal,
                new_bal: walletNewBal,
                amount_credited: amountPaid,
                type: "Payment for Errand",
                from: poster.username,
                date: Date.now()
        }

            await WalletModel.findByIdAndUpdate(poster.wallet, 
                {
                    $set: {
                        balance: walletNewBal,
                    },
                    $push: { transaction : newTransaction }
                }
            )
        }

        res.json({success:true})


    },

    buddyCancel: async (req, res) => {

        const  errandId  =  req.params.id
        
        let errand = await ErrandModel.findById(errandId)

        if (errand.fulfilled_by !== req.user.id) {
            console.log('here')
            res.json({
                success: false,
                "msg": "Unauthorised"
            })

            return
        }

        let updatedErrand = await ErrandModel.findOneAndUpdate({_id: errandId } ,         
            { 
                $set: { 
                    fulfilled_by: "",
                    status: "available"
                }
            }, 
        )

        let user = await UserModel.findById(errand.user_id)
        let emailBody = `Your buddy cancelled the acceptance of your order "${errandId.items}". Please take note of the updated changes.`
        await sendEmail(user.email, 'Buddy cancelled your order', emailBody)

        res.json({success:true})
    }
}

module.exports = controller