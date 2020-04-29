const express = require('express')
const router = express.Router()
const Service = require('../models/service')
const Car = require('../models/car')


// All Services Route (GET METHOD)
router.get('/', async (req, res) => {
    let query = Service.find()
    if (req.query.serviceBefore != null && req.query.serviceBefore != '') {
        query =  query.lte('serviceDate', req.query.serviceBefore)
    }
    if (req.query.serviceAfter != null && req.query.serviceAfter != '') {
        query =  query.gte('serviceDate', req.query.serviceAfter)
    }
    try{
        const services = await query.exec()
        res.render('services/index', {
        services: services,
        searchOptions: req.query
            })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
    
})

// New Service Route (GET METHOD)
router.get('/new', async (req, res) => {
    renderNewPage(res, new Service())
})

// Create Service Route (POST METHOD)
router.post('/', async (req, res) => {
    const service= new Service({
        serviceDate:        new Date(req.body.serviceDate),
        serviceCar:         req.body.serviceCar,
        serviceOdometer:    req.body.serviceOdometer,
        serviceDescription: req.body.serviceDescription 
    })
    try{
        const newService = await service.save()
        // res.redirect(`services/${newService.id}`) // NOT YET IMPLEMENTED
      res.redirect('services') // TEMPORARY REDIRECTION
    } catch {
        renderNewPage(res, service, true)
    }
    })
   

async function renderNewPage(res, service, hasError = false) {
    try {
    const cars = await Car.find({})
    const params = {
        cars:  cars,
      service: service
    }
    if (hasError) params.errorMessage = 'Error creating Service'
    res.render('services/new', params)
} catch {
    res.redirect('/services')
    }
}

module.exports = router