const router = require("express").Router();
const accountSid = 'process.env.ACCOUNTSID'
const authToken = 'process.env.AUTHTOKEN'
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const connection = require('../config');



router.get('/createposttable', (req, res) => {
  let sql = 'CREATE TABLE user (id int AUTO_INCREMENT, name VARCHAR(255),number VARCHAR(255),email VARCHAR(255),password VARCHAR(255),address VARCHAR(255),fathername VARCHAR(255),bachdegree VARCHAR(255), collegename VARCHAR(255),workexp VARCHAR(255),PRIMARY KEY (id))';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("post table created");

  });
});


router.post('/newuser', (req, res) => {
  var name = req.body.name;
  var number = req.body.number;
  var email = req.body.email;
  var password = req.body.password;
  var address = req.body.address;
  var fathername = req.body.fathername;
  var bachdegree = req.body.bachdegree;
  var collegename = req.body.collegename;
  var workexp = req.body.workexp;
  var salt = bcrypt.genSaltSync(10);
  var hashpassword = bcrypt.hashSync(password, salt);
  connection.query('SELECT email FROM user WHERE email = ?', [email], function (error, result) {
    if (error) {
      console.log(error);
    }
    if (result.length > 0) {
      return res.json({ message: "the email already exist" })
    }
    else {
      let sql = "INSERT INTO `user` (`name`,`number`, `email`,`password`,`address`,`fathername`,`bachdegree`,`collegename`,`workexp`) VALUES('" + name + "','" + number + "','" + email + "','" + hashpassword + "','" + address + "','" + fathername + "', '" + bachdegree + "','" + collegename + "', '" + workexp + "')";
      let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("User Created");

      });

    }
  })
})















router.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM user WHERE email = ?', [email], async function (error, results, fields) {
    if (error) {
      res.send({
        "code": 400,
        "failed": "error ocurred"
      })
    } else {
      if (results.length > 0) {
        const comparision = await bcrypt.compare(password, results[0].password)
        if (comparision) {
          res.send({
            "code": 200,
            "success": "login sucessfull"
          })
        }
        else {
          res.send({
            "code": 204,
            "success": "Email and password does not match"
          })
        }
      }
      else {
        res.send({
          "code": 206,
          "success": "Email does not exits"
        });
      }
    }
  });
})

module.exports = router;
