const express = require('express');
const dotenv = require('dotenv').config();
const sgmail = require('@sendgrid/mail');
const bodyParser = require('body-parser');
const accountSid ='AC40eee1555fcb9695ae95442f106f886b'
const authToken = '2136672f5cb163825240d9c2853ad873'
const route = require('./routes/api');
const client = require('twilio')(accountSid, authToken);

//const APIKEY = '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'      

sgmail.setApiKey(process.env.SENDGRID_API);
const app = express();


app.get('/emailsent',(req,res)=>{
    const msg = {
        to: 'jsrilekha.17@gmail.com',
        from: 'jsrilekha.17@gmail.com', // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
      };
      sgmail.send(msg)
      res.send("email sent");
      

})

app.get('/otp', (req,res)=>{
    const client = require('twilio')(accountSid, authToken);
client.verify.services('VAafb26c77efa584dc40152bf14c98bb4a')
.verifications
.create({to: `+${req.query.phonenumber}`, channel: req.query.channel})
.then((data) =>{
     console.log(data);
     res.send('verification code sent successfully');
})
.catch((error)=>{
console.log(error.message);
})
})
   


app.get("/verify", (req,res)=>{
    client
    .verify.services('VAafb26c77efa584dc40152bf14c98bb4a')
    .verifications
    .create({
        to: `+${req.query.phonenumber}`,
        code:req.query.code,
        channel:"sms"
        
    })
    .then((data) => {
        //console.log(verification_check.status);
        res.status(200).send(data)
    })

})




app.use(bodyParser.urlencoded({
    extended: true
}));

// accept json 

app.use(express.json());

app.use('/api',route);
app.get('/html', (req,res)=>{

    res.send("<h1>WELCOME</h1>")
})
app.get('/login', (req,res)=>{
    res.render('login');
})
app.listen(3000,(req,res)=>{
    console.log("server listen to port");
})          
