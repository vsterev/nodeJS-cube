const mongoose = require('mongoose');
const cubeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please enter name !'],
        match: [/^(\w\s?){5,}$/, 'Name should contains english letter, numbers and whitespase!']
    },
    description: { type: String, maxlength: [2000, 'No more than 2000 characters!'] } || 'No description',
    imageUrl: {
        type: String,
        match: [/^(https?)\:\/\/.*/, 'Url should begin with http or https!']
    } || 'https://www.imghack/com/id?389872',
    difficulty: {
        type: Number,
        min: 1,
        max: 6
    },
    accessories: [{ type: mongoose.Types.ObjectId, ref: 'Accessories' }],
    // createrId: { type: String }
    createrId: { type: mongoose.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Cube', cubeSchema);