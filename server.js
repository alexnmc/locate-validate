const express = require('express')
var forceSsl = require('force-ssl-heroku');
const app = express()
const morgan = require('morgan')
const path = require("path")
const PORT = process.env.PORT || 8000


app.use(forceSsl); // ssl certificate settings
app.use(express.json({limit: '50mb'})) // set larger data for the photo
app.use(morgan('dev'))  
app.use(express.static(path.join(__dirname, "client", "build")))


//routes
app.use("/mail", require('./routes/mail'))


app.use((err, req, res, next) => {
    return res.send({errMsg: err.message})
})


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT} sir!`)
})