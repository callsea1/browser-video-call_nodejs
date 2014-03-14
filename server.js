// silly chrome wants SSL to do screensharing
var fs = require('fs'),
    express = require('express'),
    https = require('https'),
    http = require('http'),
    pg = require('pg');

var privateKey = fs.readFileSync('fakekeys/privatekey.pem').toString(),
    certificate = fs.readFileSync('fakekeys/certificate.pem').toString();

var app = express();


// app.use(express.static(__dirname));

// Set the view directory to /views
app.set("views", __dirname + "/views");

//assets
app.use(express.static(__dirname + '/public'));

// Let's get rid of defaut Jade and use HTML templating language
app.engine('html', require('ejs').renderFile);
app.set("view engine", "html");

app.get("/", function(request, response) {
  response.render('landing', { title: 'ejs' });
});
app.get("/room", function(request, response) {
  response.render('index', { title: 'ejs' });
});

// Connect to postgres
console.log("Postresql URL is " + process.env.DATABASE_URL);

// pg.connect(process.env.DATABASE_URL, function(err, client, done) {
// //  client.query('INSERT into users values (default,$1,$2)',['foo','foo@example.com']);
//   client.query('SELECT * FROM users', function(err, result) {
//     done();
//     if(err) return console.error(err);
//     console.log(result.rows);
//   });
// }
//          );

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
      data = data + ' Pong';
      ws.send(JSON.stringify(data), function () {});
  });


  ws.on('close', function() {
    console.log('websocket connection close');
  });
});

var status = 'Not reset yet.';

console.log('running on http://localhost:5000');
