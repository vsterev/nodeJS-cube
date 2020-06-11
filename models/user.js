const mongoose = require('mongoose');
const cubeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String }
})

module.exports = mongoose.model('User', cubeSchema);