'use strict';

foodHub.controller('ProfileCtrl',['UserService','toastr','fileReader','$scope', function(UserService, toastr, fileReader, $scope) {

	var self = this;
	self.user = {id: '', fullName: '', contactNumberOne: '', contactNumberTwo: '', address: ''};
	
	self.ItemImage;
	
	self.editProfile = function(form){
		toastr.clear();
		if(form.fullName.$error.required){
			toastr.info('full name is required');
		}else if(form.fullName.$error.minlength){
			toastr.info('Minimum length required is 3');
		}else if(form.email.$invalid){
			toastr.info('email is invalid');
		}else if(form.email.$error.required){
			toastr.info('email is required');
		}


		if(form.$valid){
			
		}
	}
	
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
		
		fileReader.readAsDataUrl(imageData,$scope).then(function(result) {
			console.log('onPhotoDataSuccess --- '+result);
        });
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
		
		var blobData = new Blob([imageData], { type: "image/jpg" });
		
		fileReader.readAsDataUrl(blobData,$scope).then(function(result) {
			console.log('onPhotoFileSuccess --- '+result);
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

	self.capturePhotoWithData = function() {
		console.log('capture with photo data');
		// Take picture using device camera and retrieve image as
		// base64-encoded
		// string
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
			quality : 50
		});
	}

	self.capturePhotoWithFile = function() {
		console.log('capture with file');
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
}]);

foodHub.directive('camera', function() {
	console.log('camera directive...');
   return {
	  restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
         elm.on('click', function() {
        	 console.log('camera directive clicked');
            navigator.camera.getPicture(function (imageURI) {
               scope.$apply(function() {
                  ctrl.$setViewValue(imageURI);
               });
            }, function (err) {
               ctrl.$setValidity('error', false);
            }, { quality: 50, destinationType: Camera.DestinationType.FILE_URI })
         });
      }
   };
});