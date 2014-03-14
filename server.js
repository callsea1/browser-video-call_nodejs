// silly chrome wants SSL to do screensharing
var fs = require('fs'),
    express = require('express'),
    https = require('https'),
    http = require('http'),
    pg = require('pg');

var privateKey = fs.readFileSync('fakekeys/privatekey.pem').toString(),
    certificate = fs.readFileSync('fakekeys/certificate.pem').toString();

var app = express();


app.use(express.static(__dirname));

// Connect to postgres
console.log("Postresql URL is " + process.env.DATABASE_URL);

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//  client.query('INSERT into users values (default,$1,$2)',['foo','foo@example.com']);
  client.query('SELECT * FROM users', function(err, result) {
    done();
    if(err) return console.error(err);
    console.log(result.rows);
  });
});

var check_login = function() {
   return false;
};

exports.check_login = check_login;

var open_port = Number(process.env.PORT || 5000);

// var secure_port = Number(process.env.PORT || 5001);


// https.createServer({key: privateKey, cert: certificate}, app).listen(secure_port);
var server = http.createServer(app).listen(open_port);

// Open web socket

var WebSocketServer = require('ws').Server;


var wss = new WebSocketServer({server: server});
console.log('websocket server created');
wss.on('connection', function(ws) {
  //var id = setInterval(function() {
//    ws.send(JSON.stringify(new Date()), function() {  });
//  }, 1000);

  console.log('websocket connection open');

  ws.on('message', function(data,flags) {
//      data = data + ' Pong';
//      ws.send(JSON.stringify(data), function () {});

      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//  client.query('INSERT into users values (default,$1,$2)',['foo','foo@example.com']);
          data = JSON.parse(data);
          client.query('SELECT * FROM users where email=$1 and password=$2', [data.email,data.password],
                       function(err, result) {
                           console.log("Data is " + data);
                           console.log("Email is " + data.email);
                           console.log("Result is " + JSON.stringify(result.rows));
                           done();
                           if(err) return console.error(err);
                           if (result.rows.length > 0)
                               ws.send(JSON.stringify(result.rows[0]), function () {});
                           else
                               ws.send(JSON.stringify("No such user."), function () {});

          });
      });
   });

  ws.on('close', function() {
    console.log('websocket connection close');
  });
});

var status = 'Not reset yet.';

console.log('running on https://localhost:5001 and http://localhost:5000');
