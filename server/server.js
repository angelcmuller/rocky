var express = require('express');
var config = require('./server/config/config');
var app = require('./server/server');

const DB = await mongoose.connect(‘mongodb://localhost:27017/databaseName’, {
useNewUrlParser: true,
useUnifiedTopology: true,
});

const https = require('https');
const fs = require('fs');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/projectrockyroad.com/privkey.pem', 'utf8'); // key
const certificate = fs.readFileSync('/etc/letsencrypt/live/projectrockyroad.com/cert.pem', 'utf8'); // certificate
const ca = fs.readFileSync('/etc/letsencrypt/live/projectrockyroad.com/chain.pem', 'utf8'); // chain
const credentials = {
   key: privateKey,
   cert: certificate,
   ca: ca
};
app.use(express.static('public'));
const httpsServer = https.createServer(credentials, app);
httpsServer.listen('8443', () => {
    console.log('listening on https://projectrockyroad.com:8443');
});
