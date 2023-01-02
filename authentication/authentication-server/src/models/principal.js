const mongoose = require('mongoose')

const principalSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true 

    },
    name: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    roles: [],
})

module.exports = mongoose.model('Principal', principalSchema)