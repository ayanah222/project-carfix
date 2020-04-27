const mongoose = require ('mongoose')

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
    },
    carOwner: {                     
        type: String,
        required: true
    },
    carImage: {                     
        type: Buffer,
        required: false
    },
    carImageType: {                     
        type: String,
        required: false
    }
})

carSchema.virtual('carImagePath').get(function() {
    if (this.carImage != null && this.carImageType != null) {
        return `data:${this.carImageType};charset=utf-8;base64,${this.carImage.toString('base64')}`
    }
}
)

module.exports = mongoose.model('Car', carSchema)