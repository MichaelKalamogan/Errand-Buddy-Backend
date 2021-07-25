require('dotenv').config()
const axios = require('axios')
const { response } = require('express')


//Getting the latitude and longtitude of the location through Google Maps
const Geocode =  async (postal) =>  {
    console.log(process.env.GEOCODE_API_KEY)
    let latLongInfo = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: postal,
            key: process.env.GEOCODE_API_KEY
        }
    })  

    
    
    return latLongInfo.data.results[0].geometry.location

  
}

module.exports = Geocode