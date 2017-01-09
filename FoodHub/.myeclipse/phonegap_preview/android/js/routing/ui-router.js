
foodHub.config([ '$routeProvider', function($routeProvider) {
	
	$routeProvider
		
		.when('/', {
	        templateUrl : 'view/welcome.html'
	    })
	    
	    .when('/profile', {
			templateUrl : 'view/editProfile.html',
			controller  : 'ProfileCtrl'
		})
	    
		.when('/resetPassword', {
			templateUrl : 'view/resetPassword.html',
			controller  : 'ResetPassCtrl'
		})
		
		.when('/login', {
			templateUrl : 'view/login.html',
			controller  : 'LoginCtrl'
			
		})
		
		.when('/seller', {
			templateUrl : 'view/seller.html',
			controller  : 'SellerCtrl'
			
		})
		
		.when('/home', {
			templateUrl : 'view/home.html'
			
		})
		
		.when('/register', {
			templateUrl : 'view/register.view.html',
			controller  : 'RegistrationCtrl'
			
		})
		

		.when('/search', {
			templateUrl : 'view/search.html'

		})

	}]);