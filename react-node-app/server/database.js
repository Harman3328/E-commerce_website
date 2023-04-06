let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'classicmodels'
});

connection.connect(function (err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});

async function queryDatabase(sql, values) {
  try {
    const result = await query(sql, values);
    return result;
  } catch (error) {
    console.log(error);
  }
}

function query(sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}


module.exports = { queryDatabase }; 