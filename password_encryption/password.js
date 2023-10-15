const bcrypt = require('bcrypt')
const saltRounds = 10;

function generateHash(delete_password) {
    return bcrypt.hash(delete_password, saltRounds)
}

function validatePassword(delete_password, hash) {
    return bcrypt.compare(delete_password, hash)
}


exports.generateHash = generateHash
exports.validatePassword = validatePassword