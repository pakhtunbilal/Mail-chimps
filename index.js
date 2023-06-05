const express = require('express')
const https = require('https')
const bodyparser = require('body-parser')
const request = require('request')
const { dirname } = require('path')
require ('dotenv').config();

console.log(process.env.AUTH)

const app = express()
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/Signup.html")
});

app.post("/", function(req, res) {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    const data = {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    };
   
    const jsonData = JSON.stringify(data);
    const url = "https://us11.api.mailchimp.com/3.0/lists/4de570e2cb/members"
    const options = {
      method: "POST",
      "auth": 'process.env.AUTH',
    };
   
    const request = https.request(url, options, function(response) {
      response.on("data", function(data) {
        console.log(JSON.parse(data))
        if(response.statusCode === 200){
          res.sendFile(__dirname + '/Success.html')
        }
        else{
          res.sendFile(__dirname + '/Failure.html')
        }
      })
    });
   
    request.write(jsonData);
    request.end();
   
  })

  app.post('/failure', (req,res)=>{
    res.redirect('/')
  })

app.listen(process.env.PORT || 3000);

        