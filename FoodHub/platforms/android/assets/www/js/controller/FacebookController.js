foodHub.controller('FacebookCtrl',['UserService','$scope','$window','$location', function(UserService,$scope,$window,$location) 
{

	var self = this;

	// APP FACEBOOK ID
	$scope.appId = '1516434941703425';
	//CONFIGURE URL IN FACEBOOK APP->Internet por celular->Mobile Site URL
	//var redirectUrl = 'http://ntrenat.elnucleo.org/ok.html';
	$scope.redirectUrl = 'http://localhost:9090/get/3b7d1c01b28ae330651dada7b9c85be1/redirect.html';
	// APP FACEBOOK PERMISSIONS
	$scope.permissions = 'email,publish_actions';
	
	//Function facebook login
	self.onFacebookLogin= function(option) 
	{

		$scope.authorize_url  = "https://m.facebook.com/dialog/oauth?";
		$scope.authorize_url += "client_id=" + $scope.appId;
		$scope.authorize_url += "&redirect_uri=" + $scope.redirectUrl;
		$scope.authorize_url += "&display=touch";
		$scope.authorize_url += "&response_type=token";
		$scope.authorize_url += "&type=user_agent";
			
		if($scope.permissions !== '') 
		{
			$scope.authorize_url += "&scope=" + $scope.permissions;
		}

		option = (option)?option:'location=no';

		var appInBrowser = window.open($scope.authorize_url, '_blank', option);

		appInBrowser.addEventListener('loadstop', function(location) 
		{
			//alert('yeh kia');
			//alert(location.url);
			//alert(location.url.indexOf("access_token"));
			 if(location.url.indexOf("http://localhost:9090/setVars.html") != -1) 
			 {
				// alert('setVars sy values nkalo');
                 var fbDataArray = getJsonFromUrl(location.url);

                 if (fbDataArray['email'].indexOf('@') != -1) 
                 {
                	// alert(" email " + fbDataArray['email'] +" id "+fbDataArray['id']);
                	 $scope.db = window.openDatabase("foodhub", '1', 'foodhub db', 1024*1024*100); 
                	 
                	 $scope.db.transaction(function(transaction) 
                	 {
                		 var executeQuery = "INSERT INTO users (id,username,email,auth_token) VALUES (?,?,?,?)";             
                		 transaction.executeSql(executeQuery, [fbDataArray['id'],fbDataArray['email'],fbDataArray['email'],fbDataArray['id']], 
                		 function(transaction, result) 
                		 {
                			 //alert('record is inserted');
                			 /*appInBrowser.close();*/
                			 //$location.path("/home");
                			 $location.path('/home').replace();
                			 $scope.$apply();
                		 },
                		 function(error)
                		 {
                			 console.log('Error occurred in insertion'+error); 
                			 //alert(" uodating the user");
                			 console.log('updating the user'); 
                			 executeQuery = "update users set auth_token=? where username=?";
                			 transaction.executeSql(executeQuery, [fbDataArray['id'],fbDataArray['email']], 
                			 function(transaction, result) 
                			 {
                				 //alert('record is updated');
                				 console.log('login successful');
                				 /*appInBrowser.close();*/
                				 /*$location.path("/home");*/
                				 $location.path('/home').replace();
                				 $scope.$apply();
                			 },
                			 function(error)
                			 {
                				 console.log('Error occurred in updation'+error); 
                			 });
                		 });
                	   });
                 }
                 else 
                 {
                	 alert('Access Denied');
                	 $('#userData').html('<div style="color: red; text-align:center; height: 50px; width: 300px; margin: 0px auto; font-size: 25px; margin-top: 10px;">ACCESS DENIED!</div>');
                 }
             }
     		 else if (location.url.indexOf("access_token") !== -1) 
			 {
				//alert('wtf');
				// Success
				var access_token = location.url.match(/access_token=(.*)$/)[1].split('&expires_in')[0];
				//alert(access_token);
				window.localStorage.setItem('facebook_accessToken', access_token);
				//this.onFacebookGetInfo();
				appInBrowser.close();
			 }
			 else if (location.url.indexOf("error_reason=user_denied") !== -1) 
   			 {
				// User denied
				window.localStorage.setItem('facebook_accessToken', null);
				appInBrowser.close();
			 }
			 
			 function getJsonFromUrl(urlString) 
			 {
	              var parameterQuery = urlString.split("?");
	              var data = parameterQuery[1].split("&");
	              var result = {};
	              for(var i=0; i<data.length; i++) 
	              {
	                var item = data[i].split("=");
	                result[item[0]] = decodeURIComponent(item[1]);
	              }
	              return result;
	          }
		});
	}
}]);