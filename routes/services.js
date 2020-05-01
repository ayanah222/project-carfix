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
        const services = await query.populate('serviceCar').exec()
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
        res.redirect(`services/${newService.id}`)
    } catch {
        renderNewPage(res, service, true)
    }
    })
  
// Show Service Route
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
                                     .populate('serviceCar')
                                     .exec()
        res.render('services/show', { service: service })
    } catch {
        res.redirect('/')
    }
})

// Edit Service Route
router.get('/:id/edit', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
      renderEditPage(res, service)
    } catch {
      res.redirect('/')
    }
    
})

// Update Service Route
router.put('/:id', async (req, res) => {
    let service 
      try{
        service = await Service.findById(req.params.id)
        service.serviceCar = req.body.serviceCar
        service.serviceDate = new Date(req.body.serviceDate)
        service.serviceOdometer = req.body.serviceOdometer
        service.serviceDescription = req.body.serviceDescription
        await service.save()
        res.redirect(`/services/${service.id}`)
         } catch {
             if (service != null) {
                renderEditPage(res, service, true)
             } else {
                 redirect('/')
             }
           }
    })
// Delete Service Route
router.delete('/:id', async (req, res) => {
    let service
      try {
        service = await Service.findById(req.params.id)
        await service.remove()
        res.redirect('/services')
    } catch
     {
        if (service != null) {
        res.render('services/show', {
            service: service,
            errorMessage: 'Could not remove service'
        })
    }   else {
        res.redirect('/')
    }
  }
})

async function renderNewPage(res, service, hasError = false) 
{
renderFormPage(res, service, 'new', hasError) 
}

async function renderEditPage(res, service, hasError = false) 
{
renderFormPage(res, service, 'edit', hasError)
}

async function renderFormPage(res, service, form, hasError = false) {
    try {
    const cars = await Car.find({})
    const params = {
        cars:  cars,
      service: service
    }
    if (hasError) {
        if (form === 'edit') {
            params.errorMessage = 'Error Updating Service'
        } else {
            params.errorMessage = 'Error Creating Service'
        }
    }
    res.render(`services/${form}`, params)
} catch {
    res.redirect('/services')
    }
}

module.exports = router