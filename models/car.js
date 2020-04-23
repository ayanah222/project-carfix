const mongoose = require ('mongoose')

const carSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Car', carSchema)