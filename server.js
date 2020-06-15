const express = require('express')
var forceSsl = require('force-ssl-heroku');
const app = express()
const morgan = require('morgan')
const path = require("path")


app.use(forceSsl); // ssl certificate settings
app.use(express.json({limit: '50mb'})) // set larger data for the photo
app.use(morgan('dev'))  
app.use(express.static(path.join(__dirname, "client", "build")))


//routes
app.use("/mail", require('./routes/mail'))


app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(err.status); //secret error 
    }
    return res.send({errMsg: err.message})
})


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


app.listen(8000, () => {
    console.log(`Server is running on Port 8000 sir!`)
})