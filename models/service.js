const mongoose = require ('mongoose')

const serviceSchema = new mongoose.Schema({
    // serviceTitle: {    // Nem Használt, a serviceDate lesz titleként haszálva.
    //     type: String,
    //     required: true
    // },
    serviceDescription: {
        type: String,
    },
    serviceDate: {
        type: Date,
        required: true
    },
    serviceOdometer: {
        type: Number,
        required: true
    },
    serviceCreateDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    serviceCar: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Car'
    }
})

module.exports = mongoose.model('Service', serviceSchema)