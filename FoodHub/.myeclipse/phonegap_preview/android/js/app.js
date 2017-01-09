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

var db = null;

var foodHub = angular.module('foodHub', ['ngRoute','toastr','ngStorage']);

foodHub.run(function() {
    console.log("creating db");
    db = window.openDatabase("foodhub", '1', 'foodhub db', 1024*1024*100); // //Accessing with HTML5 local database
    console.log(db);
    
    db.transaction(function(transaction) 
    {
    transaction.executeSql('CREATE TABLE IF NOT EXISTS users (id integer primary key, fullname text, username text, email text, password text,auth_token text)', [],
        function(transaction, result) 
        {
            console.log("user table successfully created.");
            //alert("user table successfully created.");
        }, 
        function(error) 
        {
        	console.log("Error occurred while creating the table.");
        });
    
    });
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};
