const mongoose = require('mongoose');
const accessoriesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, maxlength: 2000 } || 'No description',
    imageUrl: { type: String } || 'https://www.imghack/com/id?389872',
    cubes: [{ type: mongoose.Types.ObjectId, ref: 'Cube' }]
})

accessoriesSchema.path('imageUrl').validate(function (url) {
    return url.startsWith('http') ||url.startsWith('https')
}, 'not correct http link')
module.exports = mongoose.model('Accessories', accessoriesSchema);