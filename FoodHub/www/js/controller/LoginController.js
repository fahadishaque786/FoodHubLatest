foodHub.controller('LoginCtrl',['UserService','toastr','$scope','$window','$location','$rootScope','$localStorage', function(UserService, toastr,$scope,$window,$location,$rootScope,$localStorage) 
{
	var self = this;
	$scope.user = {id: '', fullName: '', userName: '', email: '', password: '',authToken:''};
	$scope.userName='';
	$scope.db = window.openDatabase("foodhub", '1', 'foodhub db', 1024*1024*100); 

	UserService.db = $scope.db;
	$scope.flag; 
	$scope.validateUser = function(form)
	{

		toastr.clear();

		if(form.userName.$error.required)
		{
			toastr.info('user name is required');
		}
		else if(form.userName.$error.minlength)
		{
			toastr.info('Username minimum length required is 4');
		}
		else if(form.password.$error.required)
		{
			toastr.info('password is required');
		}
		else if(form.password.$error.minlength)
		{
			toastr.info('Password minimum length required is 4');
		}

		else if(form.$valid)
		{
			var len;
			var authTokenFound = false;

			$scope.db.transaction(function(transaction) 
			{
				console.log($scope.user.userName);
				transaction.executeSql("SELECT * FROM users ", [], 
						function(transaction,results)
						{
						if(results.rows.length>0)
						{
							for(var i=0;i<results.rows.length;i++)
							{
			                	 console.log("---> id: "+results.rows[i].id+" --> username: "+results.rows[i].username);
			                }
						}
				transaction.executeSql("SELECT auth_token FROM users where username=? and auth_token is not null ", [$scope.user.userName], 
					function(transaction,results)
					{
					if(results.rows.length>0)
					{
						console.log("authentication token found... login is successfull");
						$scope.userName = $scope.user.userName;
						UserService.userName = $scope.user.userName;
						console.log('UserService.userName'+UserService.userName);
						
						toastr.info('login successful');
						$localStorage.username=results.rows[0].username;
						$scope.flag = true;
						$location.path('/home');
						$scope.$digest();
					}
					else
					{
						console.log("authentication token not found... login is not successfull... now calling web service to validate the user");
						UserService.validateUser($scope.user).then(
								function(d) 
								{
									$scope.user.id =  d.id;
									console.log($scope.user.id);
									$scope.user.email =  d.email;
									console.log($scope.user.email);
									$scope.user.authToken =  d.authToken;
									console.log($scope.user.authToken);
									$scope.user.fullName =  d.fullName;
									console.log($scope.user.fullName);
									if(!($scope.user.authToken==null || $scope.user.authToken==undefined))
									{

										$scope.db.transaction(function(transaction) 
										{

											var executeQuery = "update users set auth_token = null";             
											transaction.executeSql(executeQuery, []
											, function(transaction, result) 
											{
												console.log('updatde users auth tokens null');
												
												executeQuery = "INSERT INTO users (id,fullname,username,email,auth_token) VALUES (?,?,?,?,?)";             
												transaction.executeSql(executeQuery, [$scope.user.id,$scope.user.fullName,$scope.user.userName,$scope.user.email,$scope.user.authToken]
												, function(transaction, result) 
												{
													console.log('record is inserted');
													UserService.userName = $scope.user.userName;
													console.log('UserService.userName'+UserService.userName);
													$localStorage.username=$scope.user.userName;
											//		$scope.$apply(function() {
														$scope.flag = true;
														
											//		});
													//	$rootScope.$digest();
													$location.path('/home');
													$scope.$digest();
												},
												function(error)
												{
													console.log('Error occurred in insertion'+error); 

													console.log('updating the user'); 

													executeQuery = "update users set auth_token=? where username=?";             
													transaction.executeSql(executeQuery, [$scope.user.authToken,$scope.user.userName]
													, function(transaction, result) 
													{
														console.log('record is updated');
														$scope.userName = $scope.user.userName;
														toastr.info('login successful');
														UserService.userName = $scope.user.userName;
														console.log('UserService.userName'+UserService.userName);
														$localStorage.username=$scope.user.userName;
										//				$scope.$apply(function() {
															$scope.flag = true;
															$scope.$digest();
										//				});
														//	$rootScope.$digest();
														$location.path('/home');
														$scope.$digest();
													},
													function(error)
													{
														console.log('Error occurred in updation'+error); 
													});
												});
											},
											function(error)
											{
												console.log('Error occurred in updatde users auth tokens null'+error); 
											});
											
										});
									}
									else
									{
										toastr.info('invalid credentials');
									}
								},
								function(errResponse)
								{
									console.error('Error while validating user');
								}
						);
					}
						},
						function(error)
						{
							console.log('Error occurred in selectio'+error); 
							/*$scope.flag = false;*/
						});
					});
				
					},
					function(error)
					{
						console.log("error in selection");
						/*$scope.flag = false;*/
					});
		}
	};

	$scope.logout = function()
	{
		console.log("in logout function");
		console.log("username"+UserService.userName);
		//alert("in logout function");
		$scope.db.transaction(function(transaction) 
		{
			transaction.executeSql("update users set auth_token=null where username=?", [UserService.userName], 
					function(transaction, result) 
					{
						console.log('record is update');
						$scope.user.userName = UserService.userName;
						UserService.logoutUser($scope.user).then(
								function(d) {
									console.log(d);
									toastr.info('logout successful');
									//$scope.$apply(function() {
										$scope.flag = false;
									//});
										//$rootScope.$digest();
									$location.path('/login');
									$scope.$digest();
								},
								function(errResponse){
									console.error('Error while validating user');
								}
						);
					},
					function(error)
					{
						console.log('Error occurred in update'+error); 
					});
			});
	};
	
	 
	$scope.isUserLogin = function()
	{
		//alert("checking login");
		$scope.db.transaction(function(transaction) 
		{
			transaction.executeSql("SELECT * FROM users where auth_token is not null ", [], 
					function(transaction,results)
					{
						if(results.rows.length>0)
						{
							
							//alert(" checking localstorage "+$localStorage.username);
							
							//alert(" userName " + results.rows[0].username);
							UserService.userName = results.rows[0].username;
							console.log("user is already login");
							$localStorage.username=results.rows[0].username;
							//$scope.$apply(function() {
							$scope.flag = true;
							$scope.$digest();
							//});
								//$rootScope.$digest();
							//alert(" record mill gaya hai"+$localStorage.username);
						}
						else
						{
							//alert("user is not login");
							$localStorage.username="";
							
						//	$scope.$apply(function() {
							$scope.flag = false;
							$scope.$digest();
						//	});
								//$rootScope.$digest();
							//alert(" record nai mila");
						}
					},
					function(error)
					{
						//alert("user is not login");
						//$scope.$apply(function() {
							/*$scope.flag = false;*/
						//});
						    //$scope.$digest();
							//alert(" error a gaya hai record fetch karnay main ");
					});
			});
	}
	
}]);