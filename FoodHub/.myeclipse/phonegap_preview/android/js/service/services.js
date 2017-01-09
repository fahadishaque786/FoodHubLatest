(function () {
    'use strict';

    angular
        .module('foodHub')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};
        var userName = "";
        service.ResetPassword = ResetPassword;
        service.createUser = createUser;
        service.validateUser = validateUser;
        service.logoutUser = logoutUser;

        return service;
        
        function ResetPassword(pass, token, id) {
        	
            return $http.get('http://localhost:8080/RestWS/jaxrs/users/resetPassword?token='+token+'&pass='+pass+'id='+id).then(handleSuccess, handleError('Error resetting password service'));
        }
        
        function createUser(user) {
        
	        return $http({
				method : "POST",
				url : "http://localhost:8080/RestWS/jaxrs/users/register",
				data : angular.toJson(user),
				headers : {
					'Content-Type' : 'application/json'
				}
			})
			.then(handleSuccess, handleError('Error while creating user'));
					
        }
        
        function validateUser(user) 
        {
        	console.log(angular.toJson(user));
        	userName=user.userName;
        	console.log(userName);
        	return $http({
        		method : "POST",
        		url : "http://localhost:8080/RestWS/jaxrs/users/validate",
        		data : angular.toJson(user),
        		headers : {
        			'Content-Type' : 'application/json'
        		}
        	})
        	.then(handleSuccess, handleError('Error while creating user'));
        }
        
        function logoutUser(user) 
        {
        	
        	console.log(angular.toJson(user));
        	userName; 
        	console.log("user object username ");
        	console.log("service username "+userName);
        	return $http({
        		method : "POST",
        		url : "http://localhost:8080/RestWS/jaxrs/users/logout",
        		data : angular.toJson(user),
        		headers : {
        			'Content-Type' : 'application/json'
        		}
        	})
        	.then(handleSuccess, handleError('Error while creating user'));
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
