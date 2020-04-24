const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const uploadPath = path.join('public', Car.carImageBasePath) //Össze joinolja a két elérési útvonalat
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'] //Elfogadott fájl tipusok
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

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
router.post('/', upload.single('carPicture'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const car = new Car({
        licensePlate: req.body.licensePlate,
        carMake:      req.body.carMake,
        carType:      req.body.carType,
        carFuel:      req.body.carFuel,
        carYear:      req.body.carYear,
        carPicture:  fileName
    })
    try {
      const newCar = await car.save()
     // res.redirect(`cars/${newCar.id}`) // NOT YET IMPLEMENTED
      res.redirect('cars') // TEMPORARY REDIRECTION
    } catch {
        if (car.carPicture != null) {
            removeCarPicture(car.carPicture)
        }
        
        res.render('cars/new', {
        car: car,
        errorMessage: 'Error creating Car'
        })
    }
    
})

function removeCarPicture(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

module.exports = router