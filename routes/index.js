const { Router } = require('express')
const cubeController = require('../controllers/cubes')
const accessoryController = require('../controllers/accessories')
const authController = require('../controllers/authentication')
const auth = require('../utils/auth')
const router = Router()

router.get('/', auth(false), cubeController.get.index)
router.post('/', auth(false), cubeController.post.index)
router.get('/about', auth(false), cubeController.get.about)
router.get('/create', auth(), cubeController.get.create)
router.post('/create', auth(), cubeController.post.create)
router.get('/details/:id', auth(), cubeController.get.details)
router.get('/attach/accessories/:id', auth(), cubeController.get.attachAccessories)
router.post('/attach/accessories/:id', auth(), cubeController.post.attachAccessories)
router.get('/create/accessory', auth(), accessoryController.get.createAccessory)
router.post('/create/accessory', auth(), accessoryController.post.createAccessory)
router.get('/accessories', auth(), accessoryController.get.accessories)
router.get('/login', authController.get.login)
router.post('/login', authController.post.login)
router.get('/register', authController.get.register)
router.post('/register', authController.post.register)
router.get('/logout', auth(), authController.get.logout)
router.get('/edit/:id', auth(), cubeController.get.edit)
router.post('/edit/:id', auth(), cubeController.post.edit)
router.get('/delete/:id', auth(), cubeController.get.remove)
router.post('/delete/:id', auth(), cubeController.post.remove)
router.get('/passchange/', auth(), authController.get.passChange)
router.post('/passchange/', auth(), authController.post.passChange)
router.all('*', auth(false), cubeController.get.notFound)

module.exports = router