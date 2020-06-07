const express = require('express');
const router = express.Router();
const Cube = require('../models/cube')
const { getCubes, getCubesS } = require('../controllers/getCubes');


router.get('/', (req, res) => {
    res.render('index', { title: "Cube | Home Page", cubes: getCubesS() })
})
router.post('/', (req, res) => {
    const { name, difficultyFrom, difficultyTo } = req.body;
    //da ia

    function searchCubes(name, difficultyFrom, difficultyTo) {
        const cubes = getCubesS();
        if (name && !difficultyTo && !difficultyFrom)
            return cubes.filter(el => el.name.toLowerCase().includes(name.toLowerCase()))
        if (!name && difficultyTo && difficultyFrom) {
            return cubes.filter(el => el.difficulty >= difficultyFrom && el.difficulty <= difficultyTo)
        }
        if (name && difficultyTo && difficultyFrom) {
            return cubes.filter(el => el.name.toLowerCase().includes(name.toLowerCase()) && el.difficulty >= difficultyFrom && el.difficulty <= difficultyTo)
        }
        if (!name && difficultyTo && !difficultyFrom) {
            return cubes.filter(el => el.difficulty <= difficultyTo)
        }
        if (!name && !difficultyTo && difficultyFrom) {
            return cubes.filter(el => el.difficulty >= difficultyFrom)
        } if (!name && !difficultyTo && !difficultyFrom) {
            return cubes;
        }
    };

    res.render('index', { title: 'Searched cubes', cubes: searchCubes(name, difficultyFrom, difficultyTo) })
})
router.get('/about', (req, res) => {
    res.render('about', { title: "About Page" })
})
router.get('/create', (req, res) => {
    res.render('create', { title: 'Create Cube' })
})
router.post('/create', (req, res) => {
    const { name, imageUrl, description, difficulty } = req.body;
    const newCube = new Cube(name, description, imageUrl, +difficulty);
    newCube.addCube();
    res.redirect('/');
})
router.get('/home', (req, res) => {
    res.redirect('/')
});
router.get('/details', (req, res) => {
    res.redirect('/')
});
router.get('/details/:id', (req, res) => {
    const id = req.params.id;
    // res.send(`Details id is - ${id}`);
    let cubes = getCubesS();
    let cube = cubes.find(row => row.id === id)
    res.render('details', {cube})
})
router.all('/*/', (req, res) => {
    res.render('404.hbs', { title: "Error Page" })
})

module.exports = router;