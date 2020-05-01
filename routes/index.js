const express = require('express')
const router = express.Router()
const Service = require('../models/service')
const Car = require('../models/car')

router.get('/', async (req, res) => {
    let services
    let car 
    try {
      services = await Service.find().sort({ serviceCreateDate: 'desc'}).populate('serviceCar').limit(10).exec()
      car = await Car.find()
    } catch {
        services = []
    }
    res.render('index', {services: services,
    car: car,})
})

module.exports = router