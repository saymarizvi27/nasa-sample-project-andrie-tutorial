const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
var rfs = require('rotating-file-stream') 
const api = require('./routes/api.js');
const app = express();
const path = require('path');

app.use(cors({
    origin: 'http://localhost:3000'
}));

var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname,'..', 'log')
});

app.use(morgan('combined', { stream: accessLogStream }))

app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));
app.use('/v1', api);

//it matches anything using * 
app.get('/*',(req,res) =>{
    res.sendFile(path.join(__dirname,'..','public','index.html'));
});

module.exports = app;