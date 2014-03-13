// silly chrome wants SSL to do screensharing
var fs = require('fs'),
    express = require('express'),
    https = require('https'),
    http = require('http');


var privateKey = fs.readFileSync('fakekeys/privatekey.pem').toString(),
    certificate = fs.readFileSync('fakekeys/certificate.pem').toString();


var app = express();

app.use(express.static(__dirname));

var open_port = Number(process.env.PORT || 5000);
var secure_port = Number(process.env.PORT || 5001);

https.createServer({key: privateKey, cert: certificate}, app).listen(secure_port);
http.createServer(app).listen(open_port);

console.log('running on https://localhost:5001 and http://localhost:5000');
