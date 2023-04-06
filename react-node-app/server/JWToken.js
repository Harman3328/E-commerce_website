const jwt = require('jsonwebtoken')
const db = require('./database')
const secretKey = 'mysecretkey';

function token(id, permission, expire) {
    const payload = { username: id, role: permission };
    const options = { expiresIn: expire };
    return jwt.sign(payload, secretKey, options);
}

function newAccessToken(t) {
    const decoded = jwt.verify(t, secretKey);
    const uName = decoded.username;
    const perm = decoded.role
    return token(uName, perm, "1h")
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime
    } catch (err) {
        console.log(err)
        return false;
    }
}

function getUsername(t) {
    const decoded = jwt.verify(t, secretKey);
    return decoded.username
}

function getPermission(t) {
    const decoded = jwt.verify(t, secretKey);
    return decoded.role
}

function verifyUsername(token) {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, secretKey);
            const userId = decoded.username;

            db.queryDatabase(
                `SELECT employees.employeeNumber FROM employees WHERE employeeNumber=?`,
                [userId]
            )
                .then((result) => {
                    if (result.length === 1) {
                        resolve(true);
                    } else {
                        db.queryDatabase(
                            `SELECT customers.customerNumber FROM customers WHERE customerNumber=?`,
                            [userId]
                        )
                            .then((result) => {
                                if (result.length === 1) {
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}



module.exports = { token, verifyToken, verifyUsername, newAccessToken, getUsername, getPermission }