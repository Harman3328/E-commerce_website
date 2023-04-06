const bcrypt = require('bcrypt');

function generateHashedPassword(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

function checkPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

module.exports = { generateHashedPassword, checkPassword }; 