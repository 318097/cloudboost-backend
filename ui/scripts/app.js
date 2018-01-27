var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){

	$routeProvider
		.when('/login', {
			templateUrl : 'views/login.html',
			controller : 'MainController'
		})
		.when('/home', {
			templateUrl : 'views/home.html',
			controller : 'MainController'
		})
		.when('/thumbnail', {
			templateUrl: 'views/thumbnail.html',
			controller: 'MainController'
		})
		.otherwise({
			redirectTo : '/login'
		});

}]);

app.controller('MainController', ['$scope', '$location', '$http', function($scope, $location, $http){
	$scope.redirectTo = function(redirect){
		$location.path('/' + redirect);
	}
	$scope.displayErrorAndMessages = function (message) {
		let dom = document.getElementById('messageBox');
		dom.style.display = "block";
		dom.innerHTML = message;
		setTimeout(() => {
			dom.innerHTML = "";
			dom.style.display = "none";
		}, 3000);
	};

	$scope.url = "http://localhost:8000";
	$scope.token = localStorage.token || 0;

	$scope.login = function(){
		$http.post(
			$scope.url + '/login',
			{
				username: $scope.username,
				password: $scope.password
			}
		).then(function (response) {
			console.log(response.data);
			if(response.data.status == 200){
				localStorage.token = response.data.token;
				$scope.redirectTo('home');
			}else{
				// error
			}
			
		});
	};

	// post the json object & json patch object to server
	$scope.applyJsonPatch = function(){
		console.log('clicked');
		$http.post(
			$scope.url + '/json-patch',
			{
				'jsonObject' : JSON.stringify($scope.jsonObject),
				'jsonPatchObject' : JSON.stringify($scope.jsonPatchObject)
			},
			{
				headers: {
					token : $scope.token
				}
			}
		).then(function (response) {
			console.log(response.data);
			if (response.data.status == 200) {
				$scope.patch = response.data.patch;
			} else {
				// error
				$scope.displayErrorAndMessages(response.data.msg);
			}

		});
	};

	$scope.submitImage = function(){
		$http.post(
			$scope.url + '/create-thumbnail',
			{
				'link' : $scope.link,
			},
			{
				headers: {
					token: $scope.token
				}
			}
		).then(function (response) {
			console.log(response.data);
			if (response.data.status == 200) {
				$scope.patch = response.data.patch;
				// console.log(typeof response.data.patch);
			} else {
				// error
				$scope.displayErrorAndMessages(response.data.msg);
			}

		});
	};

	$scope.logout = function(){
		localStorage.clear();
		redirectTo('login');
		$scope.displayErrorAndMessages('Logged out succesfully');
	};

}]);