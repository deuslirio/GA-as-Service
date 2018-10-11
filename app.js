const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path');
const app = express();
var algs = require('./ga.js');
var getRawBody = require('raw-body')
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use(cors())
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs


// app.get('/send',cors(), function(req, res) {
//   console.log('enviando')
//   const msg = {
//     to: req.query.to,
//     from: req.query.from,
//     subject: req.query.subject,
//     text: req.query.full_message,
//   };
//   // sgMail.send(msg);
//   sgMail
//     .send(msg, (error, result) => {
//       if (error) {
//         //Do something with the error
//         console.log(error);
//         res.end("error");
//       } else {
//         //Celebrate
//         // console.log("Message sent: " + result);
//         res.end("sent");
//       }
//     });
//
// })

app.get("/newPop", function(req, res){
const gen = {
    pop:  JSON.parse(req.query.pop),
    mr:  JSON.parse(req.query.mr),
    cr:  JSON.parse(req.query.cr),
    k:  JSON.parse(req.query.k),
  };
 // console.log(gen.pop);
res.end(JSON.stringify(algs.genetic_algorithm(gen.pop, gen.mr, gen.cr, gen.k)));
console.log(new Date());
})

app.use(express.static('.'));

app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
 });

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
  }).listen(process.env.PORT || 3000);
