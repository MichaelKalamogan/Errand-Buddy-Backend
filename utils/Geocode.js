require('dotenv').config()
const axios = require('axios')
const { response } = require('express')

const Geocode =  async () =>  {

    const location = 'Singapore 219648'

    // let data = {
    //     "results": [
    //         {
    //             "address_components": [
    //                 {
    //                     "long_name": "219648",
    //                     "short_name": "219648",
    //                     "types": [
    //                         "postal_code"
    //                     ]
    //                 },
    //                 {
    //                     "long_name": "Kallang",
    //                     "short_name": "Kallang",
    //                     "types": [
    //                         "neighborhood",
    //                         "political"
    //                     ]
    //                 },
    //                 {
    //                     "long_name": "Singapore",
    //                     "short_name": "Singapore",
    //                     "types": [
    //                         "locality",
    //                         "political"
    //                     ]
    //                 },
    //                 {
    //                     "long_name": "Singapore",
    //                     "short_name": "SG",
    //                     "types": [
    //                         "country",
    //                         "political"
    //                     ]
    //                 }
    //             ],
    //             "formatted_address": "Singapore 219648",
    //             "geometry": {
    //                 "location": {
    //                     "lat": 1.315288,
    //                     "lng": 103.846929
    //                 },
    //                 "location_type": "APPROXIMATE",
    //                 "viewport": {
    //                     "northeast": {
    //                         "lat": 1.326443,
    //                         "lng": 103.8629364
    //                     },
    //                     "southwest": {
    //                         "lat": 1.3041329,
    //                         "lng": 103.8309216
    //                     }
    //                 }
    //             },
    //             "place_id": "ChIJgbji-cIZ2jER-fGbJlWdg5s",
    //             "types": [
    //                 "postal_code"
    //             ]
    //         }
    //     ],
    //     "status": "OK"
    // }

    let latLongInfo = await axios.get ('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: location,
            key: process.env.GEOCODE_API_KEY
        }
    })
    
    return latLongInfo.data.results[0].geometry.location
}

module.exports = Geocode