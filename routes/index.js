const { Router } = require('express')
const cubeController = require('../controllers/cubes')
const accessoryController = require('../controllers/accessories')
const authController = require('../controllers/authentication')
const auth = require('../utils/auth')
const router = Router()

router.get('/', auth(false), cubeController.getIndex)
router.post('/', auth(false), cubeController.postIndex)
router.get('/about', auth(false), cubeController.about)
router.get('/create', auth(), cubeController.getCreate)
router.post('/create', auth(), cubeController.postCreate)
router.get('/details/:id', cubeController.getDetails)
router.get('/attach/accessories/:id', cubeController.getAttachAccessories)
router.post('/attach/accessories/:id', cubeController.postAttachAccessories)
router.get('/create/accessory', auth(), accessoryController.getCreateAccessory)
router.post('/create/accessory', auth(), accessoryController.postCreateAccessory)
router.get('/accessories', auth(), accessoryController.getAccessories)
router.get('/login', authController.login)
router.post('/login', authController.loginPost)
router.get('/register', authController.register)
router.post('/register', authController.registerPost)
router.get('/logout', auth(), authController.logout)
router.all('*', cubeController.notFound)

module.exports = router