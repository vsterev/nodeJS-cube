const { Router } = require('express')
const cubeController = require('../controllers/cubes')
const accessoryController = require('../controllers/accessories')
const router = Router()

router.get('/', cubeController.getIndex)
router.post('/', cubeController.postIndex)
router.get('/about', cubeController.about)
router.get('/create', cubeController.getCreate)
router.post('/create', cubeController.postCreate)
router.get('/details/:id', cubeController.getDetails)
router.get('/attach/accessories/:id', cubeController.getAttachAccessories)
router.post('/attach/accessories/:id', cubeController.postAttachAccessories)
router.get('/create/accessory', accessoryController.getCreateAccessory)
router.post('/create/accessory', accessoryController.postCreateAccessory)
router.get('/accessories', accessoryController.getAccessories)
router.all('*', cubeController.notFound)

module.exports = router