const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const Service = require('../models/service')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'] //Elfogadott fájl tipusok

// All Cars Route (GET METHOD)
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.licensePlate != null && req.query.licensePlate !== '') {
        searchOptions.licensePlate = new RegExp(req.query.licensePlate, 'i')
    }
    if(req.query.carMake != null && req.query.carMake !== '') {
        searchOptions.carMake = new RegExp(req.query.carMake, 'i')
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
        carYear:      req.body.carYear,
        carIssues:    req.body.carIssues
    })
    saveCarImage(car, req.body.carImage)

    try {
      const newCar = await car.save()
      res.redirect(`cars/${newCar.id}`)
    } catch {        
        res.render('cars/new', {
        car: car,
        errorMessage: 'Error creating Car'
        })
    }
})
// View Car Route
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
        const services = await Service.find({ serviceCar: car.id }).exec()
        res.render('cars/show', {
            car: car,
            servicesByCar: services
        })
    } catch {
        res.redirect('/')
    }
})
// Edit Car Route
router.get('/:id/edit', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
        res.render('cars/edit', { car: car })
    } catch {
        res.redirect('/cars')
    }
    
})
// Update Car Route
router.put('/:id', async (req, res) => {
    // saveCarImage(car, req.body.carImage) // Ezt javitani kell
    let car
    try {
        car = await Car.findById(req.params.id)
        car.licensePlate = req.body.licensePlate,
        car.carOwner =     req.body.carOwner,
        car.carMake =      req.body.carMake,
        car.carType =      req.body.carType,
        car.carFuel =      req.body.carFuel,
        car.carYear =      req.body.carYear,
        car.carIssues =    req.body.carIssues
        if (req.body.carImage != null && req.body.carImage !== '') {
            saveCarImage(car, req.body.carImage)
        }
        await car.save()
        res.redirect(`/cars/${car.id}`)
    } catch {
        if (car == null) {
            res.redirect('/')
        } else {
            res.render('cars/edit', {
            car: car,
            errorMessage: 'Error updating Car'
            })
        }
        
    }
})
// Delete Car Route
router.delete('/:id', async (req, res) => {
    let car
    try {
        car = await Car.findById(req.params.id)
        await car.remove()
        res.redirect('/cars')
    } catch {
        if (car == null) {
            res.redirect('/')
        } else {
            res.redirect(`/cars/${car.id}`)
        }
    }
})


function saveCarImage(car, carImageEncoded) {
    if (carImageEncoded == null)
    return
    const carImage = JSON.parse(carImageEncoded)
    if (carImage != null && imageMimeTypes.includes(carImage.type)) {
     car.carImage = new Buffer.from(carImage.data, 'base64')
     car.carImageType = carImage.type
    }
}

module.exports = router