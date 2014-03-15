// grab the room from the URL
var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

ws.onmessage = function (event) {
};

var sendping = function () {
};

function check_login() {
    console.log("Checking login from landing page.");

//    ws.send(JSON.stringify({key: "login",
//                            value: {email: $('#email').val(),
//                                    password: $('#password').val()}}));
}
