const express = require('express')
const router = express.Router()
const Car = require('../models/car')

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
        licensePlate: req.body.licensePlate
    })
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

module.exports = router