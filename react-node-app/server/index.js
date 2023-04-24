// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const db = require('./database')
const cors = require('cors');
const bodyParser = require('body-parser');
const encrypt = require('./Encrypt')
const jwt = require('./JWToken')
const cookieParser = require('cookie-parser');
const { DATETIME } = require("mysql/lib/protocol/constants/types");
const revokedToken = new Set();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true
}));

app.use(cookieParser());

app.get("/products", (req, res) => {
  db.queryDatabase(`SELECT products.productLine, products.productName, products.productCode
  FROM products
  order by productLine;`, [])
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/product/:productCode", (req, res) => {
  const productCode = req.params.productCode;
  db.queryDatabase('SELECT * FROM products WHERE productCode=?', [productCode])
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error)
      res.send(error);
    });
});

app.post("/search/:searchValue", (req, res) => {
  const searchValue = req.params.searchValue;
  db.queryDatabase('SELECT products.productName, products.productCode FROM products WHERE productName LIKE ?', [`%${searchValue}%`])
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post("/createaccount", function (req, res) {
  const formData = req.body;
  const pass = encrypt.generateHashedPassword(req.body.password);

  db.queryDatabase('SELECT employees.password FROM employees WHERE employeeNumber=?', [formData.email])
    .then((result) => {
      if (result.length !== 0 && result[0].password === null) {
        db.queryDatabase('UPDATE employees set password=? WHERE employeeNumber=?', [pass, formData.email])
          .then((result) => {
            console.log(result)
            res.send({ success: true })
          })
          .catch((error) => {
            console.log(error)
            res.send({ success: false })
          })
      } else {
        db.queryDatabase('SELECT customers.password FROM customers WHERE customerNumber=?', [formData.email])
          .then((result) => {
            if (result.length !== 0 && result[0].password === null) {
              db.queryDatabase('UPDATE customers set password=? WHERE customerNumber=?', [pass, formData.email])
                .then((result) => {
                  console.log(result);
                  res.send({ success: true })
                })
                .catch((error) => {
                  console.log(error)
                  res.send({ success: true })
                })
            } else {
              res.send({ success: false })
            }
          })
          .catch((error) => {
            console.log(error)
            res.send({ success: false })
          });
      }
    })
    .catch((error) => {
      console.log(error)
      res.send({ success: false })
    });
})

app.post("/login", function (req, res) {
  const formData = req.body;
  db.queryDatabase('SELECT employees.employeeNumber,  employees.password FROM employees WHERE employeeNumber=?',
    [formData.email])
    .then((result) => {
      if (result.length !== 0 && result[0].password !== null) {
        if (encrypt.checkPassword(formData.password, result[0].password)) {
          res.send({
            success: true,
            accessToken: jwt.token(formData.email, 'admin', '1h'),
            refreshToken: jwt.token(formData.email, 'admin', '7d')
          });
        } else {
          res.send({ success: false, err: "Incorrect password" });
        }
      } else {
        db.queryDatabase('SELECT customers.customerNumber, customers.password FROM customers WHERE customerNumber=?',
          [formData.email])
          .then((result) => {
            if (result.length !== 0 && result[0].password !== null) {
              if (encrypt.checkPassword(formData.password, result[0].password)) {
                res.send({
                  success: true,
                  accessToken: jwt.token(formData.email, 'user', '1h'),
                  refreshToken: jwt.token(formData.email, 'user', '7d')
                })
              } else {
                res.send({ success: false, err: "Incorrect password" })
              }
            } else {
              res.send({ success: false, err: "Incorect Username" })
            }
          })
          .catch((error) => {
            console.log(error)
            res.send({ success: false, err: "Database Error" });
          })
      }
    })
    .catch((error) => {
      console.log(error);
      res.send({ success: false, err: "Database error" });
    })
})

app.get("/verifyaccesstoken", function (req, res) {
  const token = req.cookies.accessToken
  if (revokedToken.has(token)) {
    res.send({ isValid: false })
  } else {
    const verifyExpire = jwt.verifyToken(token)
    jwt.verifyUsername(token)
      .then((result) => {
        const valid = result && verifyExpire
        res.send({ isValid: valid })
      })
      .catch((error) => {
        console.log(error)
        res.send({ isValid: false })
      })
  }
})

app.get("/verifyRefreshToken", function (req, res) {
  const token = req.cookies.refreshToken
  if (revokedToken.has(token)) {
    res.send({ isValid: false })
  } else {
    const verifyExpire = jwt.verifyToken(token)
    jwt.verifyUsername(token)
      .then((result) => {
        const valid = result && verifyExpire
        if (valid) {
          const aToken = jwt.newAccessToken(token)
          res.send({ success: true, accessToken: aToken })
        } else {
          res.send({ success: false })
        }
      })
      .catch((error) => {
        console.log(error)
        res.send({ success: false })
      })
  }
})

app.get("/logout", function (req, res) {
  const accessToken = req.cookies.accessToken
  const refreshToken = req.cookies.refreshToken

  revokedToken.add(accessToken)
  revokedToken.add(refreshToken)

  res.send("logged out")

})

app.get("/orderNumbers", function (req, res) {
  const token = req.cookies.accessToken
  const username = jwt.getUsername(token)

  db.queryDatabase('SELECT orders.orderNumber, orders.status FROM orders WHERE customerNumber=?', [username])
    .then((result) => {
      res.send({ success: true, info: result })
    })
    .catch((error) => {
      console.log(error)
      res.send({ success: false })
    })
})

app.get("/order/:orderNumber", function (req, res) {
  const orderNumber = req.params.orderNumber
  db.queryDatabase(`SELECT orderdetails.productCode, orderdetails.quantityOrdered, products.productName
  FROM orderdetails inner join products on orderdetails.productCode=products.productCode 
  where orderdetails.orderNumber=?`, [orderNumber])
    .then((result) => {
      res.send({ success: true, info: result })
    })
    .catch((error) => {
      console.log(error)
      res.send({ success: false })
    })
})

app.get("/getrole", function (req, res) {
  const token = req.cookies.accessToken
  const role = jwt.getPermission(token)
  res.send({ permission: role })

})

app.get("/payments", function (req, res) {
  const token = req.cookies.accessToken
  const username = jwt.getUsername(token)
  db.queryDatabase(`select checkNumber, paymentDate, amount from payments where customerNumber=?`, [username])
    .then((result) => {
      res.send({ info: result })
    }).catch((error) => {
      console.log(error)
      res.send({ info: [] })
    })
})

app.get("/customerinfo", function (req, res) {
  const token = req.cookies.accessToken
  const username = jwt.getUsername(token)
  const role = jwt.getPermission(token)

  if (role === "user") {
    db.queryDatabase('select * from customers where customerNumber=?', [username])
      .then((result) => {
        res.send({ info: result })
      }).catch((error) => {
        console.log(error)
        res.send({ info: [] })
      })
  } else {
    db.queryDatabase(`select *
    from employees
    inner join offices on employees.officeCode = offices.officeCode
    where employeeNumber=?`, [username])
      .then((result) => {
        res.send({ info: result })
      }).catch((error) => {
        console.log(error)
        res.send({ info: [] })
      })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});