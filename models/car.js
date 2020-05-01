const mongoose = require ('mongoose')
const Service = require('./service')

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
        type: String,
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
    },
    carIssues: {                     
        type: String,
    }
})

carSchema.virtual('carImagePath').get(function() {
    if (this.carImage != null && this.carImageType != null) {
        return `data:${this.carImageType};charset=utf-8;base64,${this.carImage.toString('base64')}`
    }
}
)
carSchema.pre('remove', function(next) {
    Service.find({ serviceCar: this.id }, (err, services) => {
        if (err) {
            next(err)
        } else if (services.length > 0) {
            next(new Error('This car has services still'))
            console.log('Service record detected, preventing deletion of car!')
        } else {
            next()
            console.log('No service record detected, deleting car!')
        }
    })
})

// Alternativ megoldás, törlésnél a szerviz rekordok is törlésre kerülnek:

// carSchema.pre('remove', function(next) {
//     Service.find({serviceCar: this.id}, (err, services) => {
//         if (err) {
//             next (err)
//         } else if (services.length > 0) {
//             services.forEach(service => service.remove())
//             next()
//             console.log('Service records detected, deleting service records as well!')
//         } else {
//             next()
//             console.log('No service record detected, deleting car!')
//         }
//     })
// })

module.exports = mongoose.model('Car', carSchema)