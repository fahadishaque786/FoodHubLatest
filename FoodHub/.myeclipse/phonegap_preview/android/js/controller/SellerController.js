'use strict';

foodHub.controller('SellerCtrl', [ 'UserService', 'toastr',
		function(UserService, toastr) {

			var self = this;
			self.item = {
				itemName : '',
				quantity : '',
				deliveryTime : '',
				cost : '',
				deliveryType : ''
			};

			self.ItemImage;

			self.saveItem = function(form) {
				toastr.clear();
				if (form.$valid) {
					
					//var file = new File([self.ItemImage], "name");
					//var byt = file.getAsBinary();
					//alert(file);
					
					alert(self.ItemImage);

				} else {
					toastr.error('Please provide valid information.');
					console.log("form contains some errors...hahahha....");
				}
			};

			/**
			 * **************************** photo capturing of item:
			 * ****************************
			 */
			function onPhotoDataSuccess(imageData) {
				// Get image handle
				//
				var smallImage = document.getElementById('smallImage');
				// Unhide image elements
				//
				smallImage.style.display = 'block';
				// Show the captured photo
				// The inline CSS rules are used to resize the image
				//
				smallImage.src = imageData;

				self.ItemImage = imageData;
			}

			function onPhotoFileSuccess(imageData) {
				// Get image handle
				console.log(JSON.stringify(imageData));

				// Get image handle
				//
				var smallImage = document.getElementById('smallImage');
				// Unhide image elements
				//
				smallImage.style.display = 'block';
				// Show the captured photo
				// The inline CSS rules are used to resize the image
				//
				smallImage.src = imageData;

				self.ItemImage = imageData;
				
			}

			self.onPhotoURISuccess = function(imageURI) {
				// Uncomment to view the image file URI
				// console.log(imageURI);
				// Get image handle
				//
				var largeImage = document.getElementById('largeImage');
				// Unhide image elements
				//
				largeImage.style.display = 'block';
				// Show the captured photo
				// The inline CSS rules are used to resize the image
				//
				largeImage.src = imageURI;
			}

			self.capturePhotoWithData = function() {
				// Take picture using device camera and retrieve image as
				// base64-encoded
				// string
				navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
					quality : 50
				});
			}

			self.capturePhotoWithFile = function() {
				navigator.camera.getPicture(onPhotoFileSuccess, onFail, {
					quality : 50,
					destinationType : Camera.DestinationType.DATA_URL,
					sourceType : Camera.PictureSourceType.PHOTOLIBRARY
				});
			}

			self.apturePhotoWithFile = function() {
				navigator.camera.getPicture(onPhotoFileSuccess, onFail, {
					quality : 50,
					destinationType : Camera.DestinationType.DATA_URL,
					sourceType : Camera.PictureSourceType.PHOTOLIBRARY
				});
			}

			// A button will call this function
			//
			self.getPhoto = function(source) {
				// Retrieve image file location from specified source
				navigator.camera.getPicture(onPhotoURISuccess, onFail, {
					quality : 50,
					destinationType : destinationType.DATA_URL,
					sourceType : source
				});
			}
			// Called if something bad happens.
			// 
			function onFail(message) {
				alert('Failed because: ' + message);
			}

		} ]);