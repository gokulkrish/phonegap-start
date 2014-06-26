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
    alert('device ready');

    var suc = function (pos) {
      alert(pos.coords.latitude + ' ' + pos.coords.longitude);
    }
    var fail = function () {};

    navigator.geolocation.getCurrentPosition(suc, fail);
    navigator.geolocation.watchPosition(suc, fail);

    var client = new Messaging.Client("ws://iot.eclipse.org/ws", "clientId");
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    
    client.connect({
      onSuccess: onConnect
    });

    function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      alert('MQTT Connected');
      client.subscribe("/mqttrocks");
    };

    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0)
        //console.log("onConnectionLost:" + responseObject.errorMessage);
        alert("onConnectionLost:" + responseObject.errorMessage);
    };

    function onMessageArrived(message) {
      alert("onMessageArrived: " + message.destinationName + ": " + message.payloadString);
      var html = "onMessageArrived: " + message.destinationName + ": " + message.payloadString;
      
      document.getElementById('msg').innerHTML(html);
      // my stuff ...
    };

  }
};