

foodHub.controller('RegistrationCtrl',['UserService','toastr', function(UserService,toastr) {
	
	var self = this;
	self.user = {id: '', fullName: '', userName: '', email: '', password: ''};
	
	self.registerNewUser = function(form){
		toastr.clear();
		if(form.fullName.$error.required){
			toastr.info('full name is required');
		}else if(form.fullName.$error.minlength){
			toastr.info('Minimum length required is 3');
		}else if(form.userName.$error.required){
			toastr.info('user name is required');
		}else if(form.userName.$error.minlength){
			toastr.info('Minimum length required is 5');
		}else if(form.email.$invalid){
			toastr.info('email is invalid');
		}else if(form.userName.$error.required){
			toastr.info('email is required');
		}else if(form.password.$error.required){
			toastr.info('password is required');
		}else if(form.password.$error.minlength){
			toastr.info('Minimum length required is 5');
		}


		if(form.$valid){
			UserService.createUser(self.user).then(
					function(d) {
						console.log(d);
						if(d == "added"){
							toastr.success('You have don...');
						}else if(d == "unExist"){
							toastr.info('Provided user name already exist.');
						}else if(d == "emailExist"){
							toastr.info('Provided email already exist.');  
						}
					},
					function(errResponse){
						console.error('Error while creating user');
						toastr.error('Failed to create, try again');
					}
			);
		}else{
			console.log("form contains some errors...hahahha....");
		}
	};
}]);