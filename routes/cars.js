const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'] //Elfogadott fájl tipusok

// All Cars Route (GET METHOD)
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.licensePlate != null && req.query.licensePlate !== '') {
        searchOptions.licensePlate = new RegExp(req.query.licensePlate, 'i')
    }
    try {
    const cars = await Car.find(searchOptions)
    res.render('cars/index',{
        cars: cars,
        searchOptions: req.query })
}   catch {
    res.redirect('/')
    }
})

// New Car Route (GET METHOD)
router.get('/new', (req, res) => {
    res.render('cars/new', { car: new Car() })

})

// Create Car Route (POST METHOD)
router.post('/', async (req, res) => {
     const car = new Car({
        licensePlate: req.body.licensePlate,
        carOwner:     req.body.carOwner,
        carMake:      req.body.carMake,
        carType:      req.body.carType,
        carFuel:      req.body.carFuel,
        carYear:      req.body.carYear
    })
    saveCarImage(car, req.body.carImage)

    try {
      const newCar = await car.save()
     // res.redirect(`cars/${newCar.id}`) // NOT YET IMPLEMENTED
      res.redirect('cars') // TEMPORARY REDIRECTION
    } catch {        
        res.render('cars/new', {
        car: car,
        errorMessage: 'Error creating Car'
        })
    }
    
})

function saveCarImage(car, carImageEncoded) {
    if (carImageEncoded == null) return
    const carImage = JSON.parse(carImageEncoded)
    if (carImage != null && imageMimeTypes.includes(carImage.type)) {
     car.carImage = new Buffer.from(carImage.data, 'base64')
     car.carImageType = carImage.type   
    }
}

module.exports = router