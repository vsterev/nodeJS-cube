const mongoose = require('mongoose');
const cubeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, maxlength: 2000 } || 'No description',
    imageUrl: { type: String } || 'https://www.imghack/com/id?389872',
    difficulty: { type: Number, min:1, max:6 },
    accessories: [{ type: mongoose.Types.ObjectId, ref: 'Accessories' }]
})

module.exports = mongoose.model('Cube', cubeSchema);