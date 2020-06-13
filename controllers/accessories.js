const { accessoryModel } = require('../models');
function getCreateAccessory(req, res, next) {
    const user = req.user;
    res.render('createAccessory', { title: 'Create Accessory', user })
}
function postCreateAccessory(req, res, next) {
    const { name, description, imageUrl, cubes } = req.body;

    accessoryModel.create({ name, description, imageUrl, cubes })
        .then(a => {
            console.log('New Accessory is addes => ' + a);
            res.redirect('/accessories');
        })
        .catch(err => console.log(err))
}
function getAccessories(req, res, next) {
    const user = req.user;
    accessoryModel.find({})
        .then(accessories => res.render('accessories-list.hbs', { title: 'Accessory list', accessories, user }))
        .catch(err => next(err))
}
module.exports = { getCreateAccessory, postCreateAccessory, getAccessories }
