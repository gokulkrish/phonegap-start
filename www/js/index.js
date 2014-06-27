/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
                msg.innerHTML = msg.innerHTML.replace('lat: ' + pos.coords.latitude + '<br/> lng: ' + pos.coords.longitude);
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
        var yourAjaxCallback = function (response) {
            ////
            // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
            //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            //
            //
            bgGeo.finish();
        };

        /**
         * This callback will be executed every time a geolocation is recorded in the background.
         */
        var callbackFn = function (pos) {
            alert('[js] BackgroundGeoLocation callback:  ' + pos.coords.latitudue + ',' + pos.coords.longitude);
            // Do your HTTP request here to POST location to your server.
            //
            //
            suc();

            yourAjaxCallback.call(this);
        };

        var failureFn = function (error) {
            console.log('BackgroundGeoLocation error');
        };

        // BackgroundGeoLocation is highly configurable.
        bgGeo.configure(callbackFn, failureFn, {
            //            url: 'http://only.for.android.com/update_location.json', // <-- only required for Android; ios allows javascript callbacks for your http
            //            ,
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            debug: true // <-- enable this hear sounds for background-geolocation life-cycle.
        });

        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
        bgGeo.start();

        // If you wish to turn OFF background-tracking, call the #stop method.
        // bgGeo.stop()





    }


};