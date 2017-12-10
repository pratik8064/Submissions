var myApp = angular.module("myApp", ["ngRoute"]);

var mainController = myApp.controller("mainController", function ($scope,weatherService) {
    // controller logic goes here
    
    $scope.names = ["New York", "Berlin", "Sydney", "New Delhi", "Shanghai"];
    
    function deleteChildNodes(ele) {
        while (ele.hasChildNodes()) {
            ele.removeChild(ele.lastChild);
        }
    }
    
    $scope.refreshData = function () {
        weatherService.getWeather('London', 'row1New', false, false);

        if (localStorage.getItem('cityData') != null) {
            weatherService.getWeather('Phoenix', 'row2New', false, false);
            $scope.addCity(false);
        } else {
            weatherService.getWeather('Phoenix', 'row2New', false, true);
        }
    }

    $scope.addCity = function (isNewCity) {
        var cityElement = document.getElementsByName("city3")[0];
        //var city = cityElement.options[cityElement.selectedIndex].value;
        var city = $scope.selectedCity;
        if (isNewCity) {
            var ele = document.getElementById("row3New");
            if (ele != null) {
                deleteChildNodes(ele);
            }
            var eleOld = document.getElementById("row3Old");
            if (eleOld != null) {
                deleteChildNodes(eleOld);
            }
        }
        weatherService.getWeather(city, 'row3New', true, true);
    }

    function init() {
        weatherService.getWeather('London', 'row1New', false, false);
        weatherService.getWeather('Phoenix', 'row2New', false, true);
    }

    var londonData = {};
    var phoenixData = {};
    var cityData = {};

    if (localStorage) {
        if (localStorage.getItem("London,GB") !== null) {
            londonData = localStorage.getItem("London,GB");
            weatherService.fillData(JSON.parse(londonData), 'row1New');
        }
        weatherService.getWeather('London', 'row1New', false, false);
        if (localStorage.getItem("Phoenix,US") !== null) {
            phoenixData = localStorage.getItem("Phoenix,US");
            weatherService.fillData(JSON.parse(phoenixData), 'row2New');
        }
        weatherService.getWeather('Phoenix', 'row2New', false, true);

    } else {
        init();
    }
});

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: "./views/main.html",
        controller: "mainController"
    })/*.otherwise({
        templateUrl: "./views/main.html",
        controller: "mainController"
    })*/
}]);