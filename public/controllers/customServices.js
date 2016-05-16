var appServices = angular.module('appServices', []);

appServices.factory('apiService', ['$http', '$q', function($http, $q) {
    return {
        sendData: function(data){

            var deferred = $q.defer();

            $http({
                url: '/send',
                method: "POST",
                data: data
            }).then(function(response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }
    };

}]);