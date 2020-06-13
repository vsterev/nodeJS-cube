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
    const user = req.user;
    cubeModel.findById(id).populate('accessories')
        .then(cube => {
            cube.toEdit = false;
            if (cube.createrId.toString() === req.user.id) {
                cube.toEdit = true;
            }
            res.render('details.hbs', { title: 'Cube details', cube, user })
        })
        .catch(err => res.render('404.hbs', { msg: err }))
}
function getAttachAccessories(req, res, next) {
    const id = req.params.id;
    const user = req.user;
    cubeModel.findById(id)
        .then(async (cube) => {
            const accessories = await accessoryModel.find({ cubes: { $nin: id } })
            // accessoryModel.find({})
            //     .then(accessories => {
            //         res.render('attachAccessory.hbs', { cube, accessories })
            //     })
            //     .catch(error => console.log(error))
            res.render('attachAccessory.hbs', { cube, accessories, user })
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
function edit(req, res, next) {
    const cubeId = req.params.id;
    const user = req.user;
    const options = [
        { value: 1, title: '1 - Very Easy' },
        { value: 2, title: '2 - Easy' },
        { value: 3, title: '3 - Medium (Standard 3x3)' },
        { value: 4, title: '4 - Intermediate' },
        { value: 5, title: '5 - Expert' },
        { value: 6, title: '6 - Hardcore' }
    ];

    cubeModel.findById(cubeId)
        .then(cube => {
            const { difficulty } = cube;
            options.map(r => {
                if (r.value === difficulty) {
                    return r.selected = true
                }
                return
            })
            console.log(options);
            res.render('edit', { title: 'Edit cube', cube, user, options })
        })
        .catch(err => next(err));
}
function editPost(req, res, next) {
    const cubeId = req.params.id;
    const { name = null, description = null, imageUrl = null, difficulty = null, createrId = null } = req.body;
    cubeModel.findById(cubeId)
        .then(cube => {
            if (!cube.createrId) {
                next(() => 'SOmething is wrong')
            }
            if (cube.createrId.toString() === req.user.id) {   //.toString() because in model is mongoose ObjectID
                cubeModel.findByIdAndUpdate(cubeId, { name, description, imageUrl, difficulty })
                    .then(() => {
                        res.redirect(`/details/${cubeId}`)
                        return;
                    })
                    .catch(err => console.log(err))

            }
            throw new Error('You are not the creator of this cube.')
            // next(()=>err=`You are not the creator of this cube.`)
        })
        .catch(err => console.log(err))

}
function remove(req, res, next) {
    const cubeId = req.params.id;
    const user = req.user;
    cubeModel.findById(cubeId)
        .then(cube => {
            const options = [
                { value: 1, title: '1 - Very Easy', selected: 1 === cube.difficulty },
                { value: 2, title: '2 - Easy', selected: 2 === cube.difficulty },
                { value: 3, title: '3 - Medium (Standard 3x3)', selected: 3 === cube.difficulty },
                { value: 4, title: '4 - Intermediate', selected: 4 === cube.difficulty },
                { value: 5, title: '5 - Expert', selected: 5 === cube.difficulty },
                { value: 6, title: '6 - Hardcore', selected: 6 === cube.difficulty }
            ];
            res.render('delete', { cube, user, options })
            return;
        })
        .catch(err => next(err));
}
function removePost(req, res, next) {
    const cubeId = req.params.id;
    const user = req.user;
    cubeModel.findOneAndDelete({ _id: cubeId, createrId: user.id })
        .then((cube) => {
            res.redirect('/')
            console.log(cube)
        })
        .catch(err => next(err))
}

module.exports = {
    getIndex, postIndex, getCreate, postCreate, about, getDetails, notFound,
    getAttachAccessories, postAttachAccessories, edit, editPost, remove, removePost
}

