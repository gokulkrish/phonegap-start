"use strict";

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

        function onResume() {
            alert('in resume mode');
            window.plugin.backgroundMode.disable();
        }

        function onPause() {
            alert('in background mode');
            window.plugin.backgroundMode.enable();
            bgGeo.start();
        }


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

        var succ = function () {
            alert('getting...');
            socket.emit('geoData', {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                deviceId: device.uuid,
                ts: Date.now()
            });
        };

        navigator.geolocation.getCurrentPosition(suc, fail);
        navigator.geolocation.watchPosition(suc, fail);

        var bgGeo = window.plugins.backgroundGeoLocation;

        bgGeo.configure(succ, fail, {
            url: 'http://pulsenavapp.herokuapp.com/loc',
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            debug: true


        });

    }
};