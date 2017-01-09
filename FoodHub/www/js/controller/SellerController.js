'use strict';

foodHub.controller('SellerCtrl', [ 'UserService', 'toastr','$scope',
		function(UserService, toastr,$scope) {

			var self = this;
			self.item = {
					id : '0',
					name : '',
					quantity : '',
					cost : '',
					deliveryType : '',
					deliveryTime : '',
					base64Image : '',
					latitude : '',
					longitude : '',
					userId : ''
			};
			
			$scope.stepsModel = [];


			self.saveItem = function(form) {
				toastr.clear();
				if (form.$valid) {
					var dd = angular.toJson(self.item);
					UserService.saveProduct(self.item).then(function (response) {
						toastr.warning(response);
					});
					

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
				
				//document.getElementById('ss').src=imageData;
				
				var blob = new Blob([imageData], {type: "image/jpg"});
				
				var reader = new FileReader();
				reader.onload = $scope.imageIsLoaded; 
				reader.readAsDataURL(blob);
				
				 
			}

			function onPhotoFileSuccess(imageData) {
				// Get image handle
				console.log(imageData);

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
				
				//document.getElementById('ss').src=imageData;
				
				var blob = new Blob([imageData], {type: "image/jpg"});
				
				var reader = new FileReader();
				reader.onload = $scope.imageIsLoaded; 
				reader.readAsDataURL(blob);
				 
				
			}
			
			 $scope.imageIsLoaded = function(e){
			        $scope.$apply(function() {
			            $scope.stepsModel.push(e.target.result);
			        });
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

			self.capturePhotoWithCamera = function() {
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