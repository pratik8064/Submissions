myApp.service('weatherService', function () {

    var myservice = this;
    
    function getRequestObject() {
        if (window.XMLHttpRequest) {
            return (new XMLHttpRequest());
        } else {
            return (null);
        }
    }

    function showResponse(request, id, isThirdCity, showStatDataFlag) {
        var ele = document.getElementById('error');
        ele.innerHTML = "";
        if ((request.readyState == 4)) {
            if (request.status == 404) {
                ele.innerHTML = "received status 404. data now found. check if city name is proper";
            } else if (request.status == 401) {
                ele.innerHTML = "received status 401. check if api key is proper";
            } else if (request.status == 501) {
                ele.innerHTML = "received status 501. something went wrong. Please try again later";
            } else if (request.status == 200) {
                var res = {};
                var out = JSON.parse(request.responseText);
                var d = new Date(0);
                d.setUTCSeconds(out.dt);
                res.name = out.name + ',' + out.sys.country;
                res.time = getNormalDate(d);
                res.temperature = out.main.temp;
                res.humidity = out.main.humidity;
                res.wind = (out.wind.speed * 0.447).toFixed(2);
                res.cloud = out.clouds.all;
                myservice.fillData(res, id);
                localStorage.setItem(res.name, JSON.stringify(res));
                if (isThirdCity)
                    localStorage.setItem("cityData", JSON.stringify(res));
                if (showStatDataFlag) {
                    sendStatData();
                }
            }

        }
    }


    function deleteChildNodes(ele) {
        while (ele.hasChildNodes()) {
            ele.removeChild(ele.lastChild);
        }
    }

    function getNormalDate(d) {
        var str = "";
        str += d.getFullYear() + ":" + d.getMonth() + ":" + d.getDate() + ":" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        return str;
    }

    function checkIfUpdated(res) {
        var localVal = localStorage.getItem(res.name);
        if (JSON.stringify(res) === localVal)
            return false;
        else return true;
    }
    
    function sendStatData() {

        var londonData = JSON.parse(localStorage.getItem("London,GB"));
        var phoenixData = JSON.parse(localStorage.getItem("Phoenix,US"));
        var cityData;
        if (localStorage.getItem("cityData") !== null) {
            cityData = JSON.parse(localStorage.getItem("cityData"));
        }

        var tempArr = [];
        if (londonData !== null)
            tempArr.push(londonData);
        if (phoenixData !== null)
            tempArr.push(phoenixData);
        if (cityData != undefined)
            tempArr.push(cityData);

        var data = {};

        var tempData = 0;
        var humData = 0;
        var hottest = "";

        tempArr.forEach(function (item) {
            humData += item.humidity;
            tempData += item.temperature;

        });

        data.avgTemp = (tempData / tempArr.length).toFixed(2);
        data.avgHum = (humData / tempArr.length).toFixed(2);
        data.hottest = getHottestCity(tempArr);
        data.humid = getMostHumidCity(tempArr);
        var cities = getCities(tempArr);
        data.nicest = cities.nicest.name;
        data.worst = cities.worst.name;

        showStatistics(data);
    }

    function showStatistics(data) {
        var avgTempEle = document.getElementById('avgTemp');
        var avgHumEle = document.getElementById('avgHum');
        var nicestEle = document.getElementById('nicest');
        var worstEle = document.getElementById('worst');
        avgTempEle.innerHTML = "Average temperature is " + data.avgTemp + " and hottest city is " + data.hottest;
        avgHumEle.innerHTML = "Average humidity is " + data.avgHum + " and most humid city is " + data.humid;
        nicestEle.innerHTML = "The city with nicest weather is " + data.nicest;
        worstEle.innerHTML = "The city with worst weather is " + data.worst;

    }

    function getHottestCity(arr) {
        var city = arr[0];
        arr.forEach(function (item) {
            if (item.temperature > city.temperature) {
                city = item;
            }
        });
        return city.name;
    }

    function getMostHumidCity(arr) {
        var city = arr[0];
        arr.forEach(function (item) {
            if (item.humidity > city.humidity) {
                city = item;
            }
        });
        return city.name;
    }

    function compare(a, b) {
        if (a.score < b.score)
            return -1;
        if (a.score > b.score)
            return 1;
        return 0;
    }

    function getCities(arr) {

        var score, humid_score, temp_score, wind_score, cloud_score;
        arr.forEach(function (item) {
            score = 0;
            humid_score = item.humidity / 10;
            temp_score = item.temperature;
            wind_score = item.wind;
            cloud_score = item.cloud / 10;
            score = temp_score - humid_score - wind_score + cloud_score;
            item.score = score;
        });

        arr = arr.sort(compare);
        var cities = {
            nicest: arr[0],
            worst: arr[arr.length - 1]
        }
        return cities;
    }
    
    this.getWeather = function (city, id, isThirdCity, showStatDataFlag) {

        var address = "http://openweathermap.org/data/2.5/weather?q=" + city + "&appid=b1b15e88fa797225412429c1c50c122a1";
        
        var request = getRequestObject();
        request.onreadystatechange = function () {
            showResponse(request, id, isThirdCity, showStatDataFlag);
        }
        request.open("GET", address, true);
        request.send(null);
    }

    

    this.fillData = function (res, id) {

        var newRowElement = document.getElementById(id);

        if (newRowElement.children.length == 0) {
            for (var key in res) {
                if (!res.hasOwnProperty(key)) continue;
                var val = res[key];
                var temp = document.createElement("td");
                temp.innerHTML = val;
                newRowElement.appendChild(temp);
            }
        } else if (checkIfUpdated(res)) {
            var oldRowElement = newRowElement.nextElementSibling;
            deleteChildNodes(oldRowElement);
            while (newRowElement.childNodes.length > 0) {
                oldRowElement.appendChild(newRowElement.childNodes[0]);
            }
            deleteChildNodes(newRowElement);

            for (var key in res) {
                if (!res.hasOwnProperty(key)) continue;
                var val = res[key];
                var temp = document.createElement("td");
                temp.innerHTML = val;
                newRowElement.appendChild(temp);
            }
        }
        /*else {
               // delete old row if new value not updated ?
               var oldRowElement = newRowElement.nextElementSibling;
               deleteChildNodes(oldRowElement);
           }*/
    }

    


});
