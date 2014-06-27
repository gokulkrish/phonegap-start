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


    }

    function onResume() {
        alert('in resume mode');
        window.plugin.backgroundMode.disable();
    }

    function onPause() {
        alert('in background mode');
        window.plugin.backgroundMode.enable();
    }
};