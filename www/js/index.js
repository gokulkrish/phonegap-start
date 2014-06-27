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
    window.plugin.backgroundMode.enable();
    alert('device ready');

    var socket = io('http://pulsenavapp.herokuapp.com');

    var suc = function (pos) {
      alert('geo');
      socket.emit('geoData', {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        deviceId: device.uuid,
        ts: Date.now()
      });
    };
    var fail = function () {};

    navigator.geolocation.getCurrentPosition(suc, fail);
    navigator.geolocation.watchPosition(suc, fail);

    //    var client = new Paho.MQTT.Client("ws://iot.eclipse.org", 1883, "clientIddssddsds");
    //    client.onConnectionLost = onConnectionLost;
    //    client.onMessageArrived = onMessageArrived;
    //    client.connect({onSuccess:onConnect});
    //
    //    function onConnect() {
    //    // Once a connection has been made, make a subscription and send a message.
    //      //console.log("onConnect");
    //      alert("onConnect");
    //      client.subscribe("/pulse");
    //      var message = new Paho.MQTT.Message("Hello");
    //      message.destinationName = "/world";
    //      client.send(message); 
    //    }
    //    function onConnectionLost(responseObject) {
    //      if (responseObject.errorCode !== 0)
    //      //console.log("onConnectionLost:"+responseObject.errorMessage);
    //      alert("onConnectionLost:"+responseObject.errorMessage);
    //    }
    //    function onMessageArrived(message) {
    //      //console.log("onMessageArrived:"+message.payloadString);
    //      alert("onMessageArrived:"+message.payloadString);
    //      client.disconnect(); 
    //    }
  }
};
