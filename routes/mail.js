const express = require('express')
const mailRouter = express.Router()
const nodemailer = require('nodemailer');


mailRouter.post('/', (req, res) => {
   
  const output = `
          <h4 style = "color: blue">Date: <span style = "color: rgb(0, 0, 47)">${req.body.date}</<span></h4>
          <h4 style = "color: blue">Country: <span style = "color: rgb(0, 0, 47)">${req.body.location.country}</span></h4> 
          <h4 style = "color: blue">State: <span style = "color: rgb(0, 0, 47)">${req.body.location.state}</span></h4>  
          ${req.body.location.county && `<h4 style = "color: blue">County: <span style = "color: rgb(0, 0, 47)">${req.body.location.county}</span></h4>`}  
          <h4 style = "color: blue">Postal code: <span style = "color: rgb(0, 0, 47)">${req.body.location.postcode}</span></h4>     
      `
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'valid8location@gmail.com', 
        pass: 'Panerai1'  
      }
    })
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'valid8location@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: "Validated", // Subject line
        html: output, // html body
        attachments: req.body.img.length && [{path: req.body.img}]
    }

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          res.status(201).send(error)
      } else {
          res.status(201).send('Email sent!');
      }
      })
    })


module.exports = mailRouter