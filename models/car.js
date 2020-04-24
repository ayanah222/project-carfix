const mongoose = require ('mongoose')

const carImageBasePath = 'uploads/carPictures'

const carSchema = new mongoose.Schema({
    licensePlate: {                     //Index van rajta, Unique kulcsal
        type: String,
        required: true
    },
    carMake: {                     
        type: String,
        required: true
    },
    carType: {                     
        type: String,
        required: true
    },
    carFuel: {                     
        type: String,
        required: true
    },
    carYear: {                     
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Car', carSchema)
module.exports.carImageBasePath = carImageBasePath