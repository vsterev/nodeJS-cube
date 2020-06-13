const { cubeModel, accessoryModel } = require('../models')
function getIndex(req, res, next) {
    const user = req.user;
    cubeModel.find()
        .then(cubes => {
            res.render('index.hbs', { title: 'Cubes | Home page', cubes, user })
        })
        .catch(err => console.log(err))
}
function postIndex(req, res, next) {
    const { name, from, to } = req.body;
    const user = req.user;
    let criteria = {}
    if (name) {
        criteria = { ...criteria, name: { $regex: name, $options: 'i' } }
    }
    if (from) {
        criteria = { ...criteria, difficulty: { $gte: +from } }
    }
    if (to) {
        criteria = { ...criteria, difficulty: { ...criteria.difficulty, $lte: +to } }
    }
    cubeModel.find(criteria)
        .then(cubes => {
            res.render('index.hbs', { title: 'Cubes | Filter page', cubes, name, from, to, user })
        }).catch(err => console.log(err))
}
function getCreate(req, res, next) {
    const user = req.user;
    res.render('create.hbs', { title: 'Create Cube | Cube Workshop', user })
}
function postCreate(req, res, next) {
    const { name = null, description = null, imageUrl = null, difficulty = null } = req.body;
    const createrId = req.user.id;
    cubeModel.create({ name, description, imageUrl, difficulty, createrId })
        .then(cube => {
            console.log(cube);
            res.redirect('/')
        })
        .catch(err => console.log(err))
}
function about(req, res, next) {
    const user = req.user;
    res.render('about.hbs', { title: 'Cube | About page', user })
}
function getDetails(req, res, next) {
    const id = req.params.id;
    cubeModel.findById(id).populate('accessories')
        .then(cube => res.render('details.hbs', { title: 'Cube details', cube }))
        .catch(err => res.render('404.hbs', { msg: err }))
}
function getAttachAccessories(req, res, next) {
    const id = req.params.id;
    cubeModel.findById(id)
        .then(async (cube) => {
            const accessories = await accessoryModel.find({ cubes: { $nin: id } })
            // accessoryModel.find({})
            //     .then(accessories => {
            //         res.render('attachAccessory.hbs', { cube, accessories })
            //     })
            //     .catch(error => console.log(error))
            res.render('attachAccessory.hbs', { cube, accessories })
        })
        .catch(err => console.log(err))
}
async function postAttachAccessories(req, res, next) {
    const cubeID = req.params.id;
    const { accessoryID } = req.body;
    await cubeModel.findByIdAndUpdate(cubeID, { $push: { accessories: accessoryID } });
    await accessoryModel.findByIdAndUpdate(accessoryID, { $push: { cubes: cubeID } });
    await res.redirect(`/details/${cubeID}`)
}
function notFound(req, res, next) {
    res.render('404.hbs', { title: 'Cube | Not found page' })
}
module.exports = { getIndex, postIndex, getCreate, postCreate, about, getDetails, notFound, getAttachAccessories, postAttachAccessories }

