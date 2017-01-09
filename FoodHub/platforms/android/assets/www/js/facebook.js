// APP FACEBOOK ID
var appId = '1516434941703425';
//CONFIGURE URL IN FACEBOOK APP->Internet por celular->Mobile Site URL
//var redirectUrl = 'http://ntrenat.elnucleo.org/ok.html';
var redirectUrl = 'http://localhost:9090/get/3b7d1c01b28ae330651dada7b9c85be1/redirect.html';
// APP FACEBOOK PERMISSIONS
var permissions = 'email,publish_actions';

var facebook = {

	//Function facebook login
	onFacebookLogin: function(option) {

		var authorize_url  = "https://m.facebook.com/dialog/oauth?";
			authorize_url += "client_id=" + appId;
			authorize_url += "&redirect_uri=" + redirectUrl;
			authorize_url += "&display=touch";
			authorize_url += "&response_type=token";
			authorize_url += "&type=user_agent";
			
		if(permissions !== '') {
			authorize_url += "&scope=" + permissions;
		}

		option = (option)?option:'location=no';

		var appInBrowser = window.open(authorize_url, '_blank', option);

		appInBrowser.addEventListener('loadstop', function(location) {
			
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
                	 
    				 var db = window.openDatabase("foodhub", '1', 'foodhub db', 1024*1024*100);  

    			 db.transaction(function(transaction) 
    			{
    				var executeQuery = "INSERT INTO users (id,username,email,auth_token) VALUES (?,?,?,?)";             
    				transaction.executeSql(executeQuery, [fbDataArray['id'],fbDataArray['email'],fbDataArray['email'],fbDataArray['id']]
    				, function(transaction, result) 
    				{
//    					alert('record is inserted');
    					
						window.close();
						window.location = "home.html";
    				},
    				function(error)
    				{
    					console.log('Error occurred in insertion'+error); 


    					console.log('updating the user'); 

    					executeQuery = "update users set auth_token=? where username=?";             
    					transaction.executeSql(executeQuery, [fbDataArray['id'],fbDataArray['email']]
    					, function(transaction, result) 
    					{
    						//alert('record is updated');
    						console.log('login successful');
    						window.close();
    						window.location = "home.html";
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
  //              	 alert('Access Denied');
                	 $('#userData').html('<div style="color: red; text-align:center; height: 50px; width: 300px; margin: 0px auto; font-size: 25px; margin-top: 10px;">ACCESS DENIED!</div>');
                 }
             }
			
			if (location.url.indexOf("access_token") !== -1) 
			{
				
	//			alert('wtf');
				
				// Success
				var access_token = location.url.match(/access_token=(.*)$/)[1].split('&expires_in')[0];
	//			alert(access_token);
				window.localStorage.setItem('facebook_accessToken', access_token);
				
				//this.onFacebookGetInfo();
				
				appInBrowser.close();
			}

			if (location.url.indexOf("error_reason=user_denied") !== -1) 
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
	},

	//Function logout
	onFacebookLogout: function() {
		var logout_url = encodeURI("https://www.facebook.com/logout.php?next=" + redirectUrl + "&access_token=" + window.localStorage.getItem('facebook_accessToken'));
		var appInBrowser = window.open(logout_url, '_blank', 'hidden=yes,location=no');
		
		appInBrowser.addEventListener('loadstart', function(location) {
			if(location.url == logout_url) {
				// Do nothing
			}
			else if(location.url === redirectUrl + '#_=_' || location.url === redirectUrl) {
				window.localStorage.setItem('facebook_accessToken', null);
				appInBrowser.close();
			}
		});
	},

	//Function check With Login
	onFacebookCheckWithLogin: function() {
		var access_token = window.localStorage.getItem('facebook_accessToken');
		var url = "https://graph.facebook.com/me?access_token=" + access_token;
		$.getJSON(url, function() {
			facebook.onFacebookLogin('hidden=yes,location=no');
		})
		.error(function() {
			facebook.onFacebookLogin();
		});
	},

	//Function get info
	onFacebookGetInfo: function() {
		
		alert('get info');
		
		if(window.localStorage.getItem('facebook_accessToken') === null) {
			return false;
		}
		var url = "https://graph.facebook.com/me?access_token=" + window.localStorage.getItem('facebook_accessToken');
		$.getJSON(url, function(data) {
			window.localStorage.setItem('facebook_uid', data.id);
		})
		.error(function() {
			window.localStorage.setItem('facebook_accessToken', null);
			window.localStorage.setItem('facebook_uid', null);
		});
	},

	/*
	Function post feed
	Param post object:
	{message: 'Lorem lipsum',
	link: 'http://ntrenat.elnucleo.org',
	picture: 'http://ntrenat.elnucleo.org/logo.png',
	name: 'Esto es un nombre',
	caption: 'ntrenat.elnucleo.org',
	description: 'lorem lipsum'}
	*/
	onFacebookPostFeed: function(post) {
		if(window.localStorage.getItem('facebook_accessToken') === null) {
			return false;
		}
		var url = "https://graph.facebook.com/me/feed?access_token="+window.localStorage.getItem('facebook_accessToken');
		$.post(url, post)
		.error(function() {
			window.localStorage.setItem('facebook_accessToken', null);
			window.localStorage.setItem('facebook_uid', null);
		});
	}
	
	
	
};


