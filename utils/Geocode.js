require('dotenv').config()
const axios = require('axios')
const { response } = require('express')


//Getting the latitude and longtitude of the location through Google Maps
const Geocode =  async (postal) =>  {

    let latLongInfo = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: postal,
            key: process.env.GEOCODE_API_KEY
        }
    })  

    let x

    if(latLongInfo.data.results[0].geometry.location) {
        
        x = latLongInfo.data.results[0].geometry.location
    }

    return x

  
}

module.exports = Geocode