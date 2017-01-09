

foodHub.controller('ResetPassCtrl',['UserService','toastr', function(UserService,toastr) {

	var self = this;
	self.reset = {oldPass: '', newPass: '', confirmNewPass: ''};

	self.resetPassword = function(form){
		toastr.clear();
		if(form.$valid){
			if(self.reset.newPass==self.reset.confirmNewPass){
				try{
					var query = "select * fom user where authentication_token is not null";
					var token="";
					var userId="";

					UserService.ResetPassword(self.reset.newPass,token,userId).then(function (response) {
						alert(response);
					});

				}catch(e){
					console.log(e);
				}
			}else{
				toastr.error('passwords do not match');
			}
		}else{
			toastr.error('Please provide valid information.');
			console.log("form contains some errors...hahahha....");
		}
	};
}]);