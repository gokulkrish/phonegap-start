'use strict';

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'

    var onResume = function () {
            alert('in resume mode');
            window.plugin.backgroundMode.disable();
        },

        var onPause = function () {
                alert('in background mode');
                window.plugin.backgroundMode.enable();
                bgGeo.start();
            },


            onDeviceReady: function () {
                document.addEventListener('pause', onPause, false);
                document.addEventListener('resume', onResume, false);

                window.plugin.backgroundMode.disable();
                alert('device ready');

                var socket = io('http://pulsenavapp.herokuapp.com');

                var prev = {
                    lat: '',
                    lng: ''
                };




                var suc = function (pos) {
                    alert('watchPosition');
                    socket.emit('geoData', {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        deviceId: device.uuid,
                        ts: Date.now()
                    });

                    var msg = document.getElementById('msg');

                    if (pos.coords.latitude != prev.lat || pos.coords.longitude != prev.lng) {
                        navigator.notification.vibrate(1000);
                        msg.innerHTML += 'lat: ' + pos.coords.latitude + '<br/> lng: ' + pos.coords.longitude;
                        prev.lat = pos.coords.latitude;
                        prev.lng = pos.coords.longitude;
                    }
                };

                var fail = function () {};




                navigator.geolocation.getCurrentPosition(suc, fail);
                navigator.geolocation.watchPosition(suc, fail);

                //        var bgGeo = window.plugins.backgroundGeoLocation;
                var bgGeo = window.plugins.backgroundGeoLocation;

                /**
                 * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
                 */
                //                var yourAjaxCallback = function (response) {
                ////
                // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
                //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                //
                //
                //                    bgGeo.finish();
                //                };

                /**
                 * This callback will be executed every time a geolocation is recorded in the background.
                 */
                //                var callbackFn = function (pos) {
                //                    alert('[js] BackgroundGeoLocation callback:  ' + pos.coords.latitudue + ',' + pos.coords.longitude);
                //                    // Do your HTTP request here to POST location to your server.
                //                    //
                //                    //
                //                    socket.emit('geoData', {
                //                        lat: pos.coords.latitude,
                //                        lng: pos.coords.longitude,
                //                        deviceId: device.uuid,
                //                        ts: Date.now()
                //                    });
                //
                //
                //                    yourAjaxCallback.call(this);
                //                };

                var failureFn = function (error) {
                    console.log('BackgroundGeoLocation error');
                };

                // BackgroundGeoLocation is highly configurable.
                bgGeo.configure(suc, fail, {
                    url: 'http://pulsenavapp.herokuapp.com/loc',
                    desiredAccuracy: 10,
                    stationaryRadius: 20,
                    distanceFilter: 30,
                    debug: true // <-- enable this hear sounds for background-geolocation life-cycle.
                });

                // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.


                // If you wish to turn OFF background-tracking, call the #stop method.
                // bgGeo.stop()





            }


};