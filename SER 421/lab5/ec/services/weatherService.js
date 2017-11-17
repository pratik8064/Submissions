myApp.service('weatherService', function () {    

    /*this.getConversionData = function (requestData, callback) {
        var url = urls.conversionsData;
        DataService.fetchData({
            method: 'POST',
            url: url,
            data: requestData
        }, function (response, errorCode, errorResponse) {
            if (response != null) {
                response = response.data;
                if (callback && typeof callback === "function") {
                    callback(response, true);
                }
            } else {
                if (callback && typeof callback === "function") {
                    callback(null, false);
                }
            }
        });
    };
    */
    
    this.getWeather = function(city, id, isThirdCity, showStatDataFlag) {

        var address = "http://openweathermap.org/data/2.5/weather?q=" + city + "&appid=b1b15e88fa797225412429c1c50c122a1";

        var request = getRequestObject();
        request.onreadystatechange = function () {
            showResponse(request, id, isThirdCity, showStatDataFlag);
        }
        request.open("GET", address, true);
        request.send(null);
    }

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
                ele.innerHTML = "received status 404. data now found. check if city name is proper : " + ;
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
                res.wind = ((out.wind.speed * 25) / 11).toFixed(2);
                res.cloud = out.clouds.all;
                fillData(res, id);
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
        // check from timestamp if data is updated and return boolean;
        var localVal = localStorage.getItem(res.name);
        if (JSON.stringify(res) === localVal)
            return false;
        else return true;
    }

    function fillData(res, id) {

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
    }

});
