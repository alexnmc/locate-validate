const express = require('express')
const mailRouter = express.Router()
const nodemailer = require('nodemailer');


mailRouter.post('/', (req, res) => {
    
  const output = `
          <h4>Date: ${req.body.date}</h4>
          <h4>Located at: ${req.body.location}</h4>  
      `
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nemechekalexander', 
        pass: 'Panerai1'  
      }
    })
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'nemechekalexander@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: "Validated", // Subject line
        html: output, // html body
        attachments: req.body.img.length && [{path: req.body.img}]
    }

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          res.status(201).send(error)
      } else {
          res.status(201).send('Email sent: ' + info.response);
      }
      })
    })


module.exports = mailRouter