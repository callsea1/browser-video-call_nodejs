
            // grab the room from the URL
            var room = location.search && location.search.split('?')[1];

            var host = location.origin.replace(/^http/, 'ws')
            var ws = new WebSocket(host);

            ws.onmessage = function (event) {
              var li = document.createElement('li');
              var m = JSON.parse(event.data);
              if (m.id)
                 li.innerHTML = m.name;
              else
                 li.innerHTML = JSON.parse(event.data);
              document.querySelector('#pings').appendChild(li);
            };

            var sendping = function () {
              var li = document.createElement('li');
              li.innerHTML = 'Ping Sent';
              document.querySelector('#pings').appendChild(li);
              ws.send(JSON.stringify({key: "login",
                                      value: {email: $('#email').val(),
                                              password: $('#password').val()}}));
            };

            // create our webrtc connection
            var webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                localVideoEl: 'localVideo',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: 'remotes',
                // immediately ask for camera access
                autoRequestMedia: true,
                debug: true,
                detectSpeakingEvents: true,
                autoAdjustMic: false
            });

            // when it's ready, join if we got a room from the URL
            webrtc.on('readyToCall', function () {
                // you can name it anything
                if (room) webrtc.joinRoom(room);
            });

            // Since we use this twice we put it here
            function setRoom(name) {
                $('form').remove();
                $('h1').text(name);
                $('#subTitle').text('Link to join: ' + location.href);
                $('body').addClass('active');
                ws.send(JSON.stringify({key: "room", value: name}));
            }

            function check_login() {
               return true;
            }

            if (room) {
                setRoom(room);
            } else {
                $('form').submit(function () {
                    if (check_login()) {
                      console.log("Login check succeeded.");
                      var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
                      webrtc.createRoom(val, function (err, name) {
                          console.log(' create room cb', arguments);

                          var newUrl = location.pathname + '?' + name;
                          if (!err) {
                              history.replaceState({foo: 'bar'}, null, newUrl);
                              setRoom(name);
                          } else {
                              console.log(err);
                          }
                      });
                      return false;
                    } else {
                      console.log("Bad password or username.");
                    }
                });
            }

            var button = $('#screenShareButton'),
                setButton = function (bool) {
                    button.text(bool ? 'share screen' : 'stop sharing');
                };
            webrtc.on('localScreenRemoved', function () {
                setButton(true);
            });

            setButton(true);

            button.click(function () {
                if (webrtc.getLocalScreen()) {
                    webrtc.stopScreenShare();
                    setButton(true);
                } else {
                    webrtc.shareScreen(function (err) {
                        if (err) {
                            setButton(true);
                        } else {
                            setButton(false);
                        }
                    });

                }
            });
