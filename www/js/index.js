'use strict';

var app = {},
    bgGeo = window.plugins.backgroundGeoLocation,
    bgMode = window.plugin.backgroundMode,
    socket;

var onResume = function () {
    alert('in resume mode');
    bgMode.disable();
};

var onPause = function () {
    alert('in background mode');
    bgMode.enable();
};

var prevLoc = {
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

    if (pos.coords.latitude != prevLoc.lat || pos.coords.longitude != prevLoc.lng) {
        navigator.notification.vibrate(1000);
        msg.innerHTML = 'lat: ' + pos.coords.latitude + '<br/> lng: ' + pos.coords.longitude;
        prevLoc.lat = pos.coords.latitude;
        prevLoc.lng = pos.coords.longitude;
    }
};

var fail = function () {};

var onDeviceReady = function () {
    /**
     * This callback will be executed every time a geolocation is recorded in the background.
     */
    //    var callbackFn;

    bgMode.disable();
    alert('device ready');

    socket = io('http://pulsenavapp.herokuapp.com');

    navigator.geolocation.getCurrentPosition(suc, fail);
    navigator.geolocation.watchPosition(suc, fail);

    /**
     * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
     */
    var yourAjaxCallback = function (response) {
        ////
        // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
        //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        //
        //
        bgGeo.finish();
    };

    var callbackFn = function (pos) {
        alert('getting...');
        alert('[js] BackgroundGeoLocation callback:  ' + pos.coords.latitudue + ',' + pos.coords.longitude);
        // Do your HTTP request here to POST location to your server.
        //
        //


        socket.emit('geoData', {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            deviceId: device.uuid,
            ts: Date.now()
        });


        yourAjaxCallback.call(this);
    };

    var failureFn = function (error) {
        console.log('BackgroundGeoLocation error');
    };

    bgGeo.configure(callbackFn, failureFn, {
        //            url: 'http://only.for.android.com/update_location.json', // <-- only required for Android; ios allows javascript callbacks for your http
        //            ,
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        debug: true // <-- enable this hear sounds for background-geolocation life-cycle.
    });

    bgGeo.start();
};

app.initialize = function () {
    this.bindEvents();
};

app.bindEvents = function () {
    document.addEventListener('deviceready', onDeviceReady, false);
    document.addEventListener('pause', onPause, false);
    document.addEventListener('resume', onResume, false);
};