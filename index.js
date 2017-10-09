angular.element(document).ready(function(){
	angular.bootstrap(document.getElementById("user-container"), ['userApp']);
});

// Start the module
var app = angular.module('userApp', []).config(function($interpolateProvider){
	$interpolateProvider.startSymbol('{$');
	$interpolateProvider.endSymbol('$}');
});

// for http request
app.config(['$httpProvider', function($httpProvider){
	$httpProvider.defaults.xsrfCookieName = 'csrftoken';
	$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

// controller for the left nav
app.controller('userController', function($scope, $rootScope, $http){
	// console.log("in the controller")
	$scope.followerPage = 1;
	$scope.followerArr = [];

	// Get all the followers data
	$scope.getFollowers = function()
	{
		// Check for the follower count
		if($scope.followerArr.length < $scope.userResult.followers ) {
			$http({
				method: 'GET',
				url: 'https://api.github.com/users/'+ $scope.searchUser +'/followers?page=' + $scope.followerPage
			}).then(function successCallback(response) {
				// console.log(response);
				newFollowers = response['data'];
				$scope.followerArr = $scope.followerArr.concat(newFollowers);

				// Increment the page
				$scope.followerPage++;

			}, function errorCallback(response) {

			});
		}

	}

	// Search for the user data from github api
	$scope.getUserData = function()
	{
		// check empty input
		if($scope.searchUser == '') return;

		// http response for data
		$http({
			method: 'GET',
			url: 'https://api.github.com/users/' + $scope.searchUser
		}).then(function successCallback(response) {

			// reset the data for new search
			$scope.followerPage = 1;
			$scope.followerArr = [];

			// reset the error
			$scope.userResultError = '';

			// set the data for the new users
			// console.log(response);
			$scope.userResult = response['data'];

			// get the followers
			$scope.getFollowers();


		}, function errorCallback(response) {
			// Something is wrong
			// console.log(response);
			// check for 404 error
			if(response['status'] == 404)
			{
				$scope.userResult = null;
				$scope.userResultError = "No results found for '" +  $scope.searchUser + "'.";				
			}

		});

	}


});
