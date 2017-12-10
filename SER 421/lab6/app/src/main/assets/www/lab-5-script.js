"use strict";

const GET_METHOD = "GET";
var API_URL = "http://api.openweathermap.org/data/2.5/weather?appid=f8067effab2859a4ac1d4f5637dec42b&q=";
var MOCK_API_URL = "http://localhost:8081/?q=";

const TABLE_ID = "weatherTable";
const ERORR_DIV_ID = "errorMessage";

const FIRST_CITY_ID = "firstCity";
const FIRST_CITY_NEW_ROW_ID = "firstCityNewRow";
const SECOND_CITY_ID = "secondCity";
const SECOND_CITY_NEW_ROW_ID = "secondCityNewRow";
const THIRD_CITY_ID = "thirdCity";
const THIRD_CITY_NEW_ROW_ID = "thirdCityNewRow";
const THIRD_CITY_SELECT_ID = "thirdCitySelect";

const LONDON_CITY_CAPTION = "London";
const PHOENIX_CITY_CAPTION = "Phoenix";

function convertWindSpeed(windSpeed) {
    return Math.round(windSpeed * 3600 / 1610.3*1000)/1000;
}

function convertTemperature(temperature) {
    return (parseFloat(temperature) - 273.15).toFixed(2);
}

function convertTimeStamp(timestamp) {
    var date = new Date(timestamp * 1000);
    return date.getFullYear() + ":" + (date.getMonth()+1) + ":" + date.getDate() + ":" + date.getHours() + ":"
        + date.getMinutes() + ":" + date.getSeconds();
}

function getCityList(cityList){
	console.log("********************");
    var cities = cityList.split(":");
    console.log(cities);
    cities = cities.splice(0,cities.length-1);
    var citySelect = document.getElementById('thirdCitySelect');
    cities.forEach(function(item){
        citySelect.options[citySelect.options.length] = new Option(item,item);
    });
	console.log("********************");
}

function getConvertedValues(jsonResponse){

    return {
        cityName: jsonResponse.name + ", " + jsonResponse.sys.country,
        timeStamp: convertTimeStamp(jsonResponse.dt),
        temperature: convertTemperature(jsonResponse.main.temp),
        humidity: jsonResponse.main.humidity,
        windSpeed: convertWindSpeed(jsonResponse.wind.speed),
        cloudiness: jsonResponse.clouds.all
    };
}

function compareValuesWithLocalStorage(newValues, oldValues){
    var changeStatus = false;

    if (newValues.timeStamp !== oldValues.timeStamp || newValues.temperature !== oldValues.temperature
        || newValues.humidity !== oldValues.humidity || newValues.windSpeed !== oldValues.windSpeed
        || newValues.cloudiness !== oldValues.cloudiness) {

        changeStatus = true;
    }

    return changeStatus;
}

function calculateCityScore(t,h,w,c) {
    var score = 0;

    if(t < 30 && t > 15) {
        score++;
    }

    if(h < 50) {
        score++;
    }

    if(w < 15) {
        score++;
    }
    if(c < 60 && c > 30) {
        score++;
    }

    // console.log('-- cityScore: ', score);

    return score;
}

function getWeather(niceFlag){
    var finalScore = 0;

    var firstCityRow = document.getElementById(FIRST_CITY_ID);
    var firstCityScore = calculateCityScore(parseFloat(firstCityRow.cells[2].innerHTML),
        parseFloat(firstCityRow.cells[3].innerHTML), parseFloat(firstCityRow.cells[4].innerHTML),
        parseFloat(firstCityRow.cells[5].innerHTML));

    var secondCityRow = document.getElementById(SECOND_CITY_ID);
    var secondCityScore = calculateCityScore(parseFloat(secondCityRow.cells[2].innerHTML),
        parseFloat(secondCityRow.cells[3].innerHTML), parseFloat(secondCityRow.cells[4].innerHTML),
        parseFloat(secondCityRow.cells[5].innerHTML));

    if (document.getElementById(THIRD_CITY_ID) !== null) {
        var thirdCityRow = document.getElementById(THIRD_CITY_ID);
        var thirdCityScore = calculateCityScore(parseFloat(thirdCityRow.cells[2].innerHTML),
            parseFloat(thirdCityRow.cells[3].innerHTML), parseFloat(thirdCityRow.cells[4].innerHTML),
            parseFloat(thirdCityRow.cells[5].innerHTML));

        if (niceFlag) {
            finalScore = Math.max(firstCityScore, secondCityScore, thirdCityScore);
        } else {
            finalScore = Math.min(firstCityScore, secondCityScore, thirdCityScore);
        }

        if (finalScore === firstCityScore) {

            return firstCityRow.cells[0].innerHTML;
        } else if (finalScore === secondCityScore) {

            return secondCityRow.cells[0].innerHTML;
        }

        return thirdCityRow.cells[0].innerHTML;
    }


    if (niceFlag) {
        finalScore = Math.max(firstCityScore, secondCityScore);
    } else {
        finalScore = Math.min(firstCityScore, secondCityScore);
    }

    if (finalScore === firstCityScore) {
        return firstCityRow.cells[0].innerHTML;
    }

    return secondCityRow.cells[0].innerHTML;
}

function getDataCity(dataCellIndex){
    var firstCityRow = document.getElementById(FIRST_CITY_ID);
    var firstCityData = parseFloat(firstCityRow.cells[dataCellIndex].innerHTML);

    var secondCityRow = document.getElementById(SECOND_CITY_ID);
    var secondCityData = parseFloat(secondCityRow.cells[dataCellIndex].innerHTML);

    var thirdCityRow = document.getElementById(THIRD_CITY_ID);
    if (thirdCityRow !== null) {
        var thirdCityData = parseFloat(thirdCityRow.cells[dataCellIndex].innerHTML);
        var max = Math.max(firstCityData, secondCityData, thirdCityData);

        if (max === firstCityData) {
            return firstCityRow.cells[0].innerHTML;
        } else if (max === secondCityData) {
            return secondCityRow.cells[0].innerHTML;
        } else {
            return thirdCityRow.cells[0].innerHTML;
        }
    }

    if (firstCityData > secondCityData) {
        return firstCityRow.cells[0].innerHTML;
    }

    return secondCityRow.cells[0].innerHTML;
}

function getAverageData(dataCellIndex){
    var totalCities = 2;
    var totalSum = 0;

    totalSum += parseFloat(document.getElementById(FIRST_CITY_ID).cells[dataCellIndex].innerHTML);
    totalSum += parseFloat(document.getElementById(SECOND_CITY_ID).cells[dataCellIndex].innerHTML);

    if (document.getElementById(THIRD_CITY_ID) !== null) {
        totalSum += parseFloat(document.getElementById(THIRD_CITY_ID).cells[dataCellIndex].innerHTML);
        totalCities++;
    }

    return (totalSum / totalCities).toFixed(2);
}

function displayStats(){
    document.getElementById("lineOne").innerHTML = "The average temperature is " + getAverageData(2) +
        " and the hottest city is " + getDataCity(2);

    document.getElementById("lineTwo").innerHTML = "The average humidity is " + getAverageData(3) +
        " and the most humid city is " + getDataCity(3);

    document.getElementById("lineThree").innerHTML = "The city with nicest weather is " + getWeather(true);

    document.getElementById("lineFour").innerHTML = "The city with the worst weather is " + getWeather(false);

}

function insertTableRow(values, rowId, rowIndex){
    var table = document.getElementById(TABLE_ID);

    var currentRow = table.insertRow(rowIndex);
    currentRow.id = rowId;
    currentRow.insertCell(0).innerHTML = values.cityName;
    currentRow.insertCell(1).innerHTML = values.timeStamp;
    currentRow.insertCell(2).innerHTML = values.temperature;
    currentRow.insertCell(3).innerHTML = values.humidity;
    currentRow.insertCell(4).innerHTML = values.windSpeed;
    currentRow.insertCell(5).innerHTML = values.cloudiness;

    // set into localStorage
    localStorage.setItem(rowId, JSON.stringify(values));
}

function updateTableRow(values, rowId){
    var tableRow = document.getElementById(rowId);
    tableRow.cells[0].innerHTML = values.cityName;
    tableRow.cells[1].innerHTML = values.timeStamp;
    tableRow.cells[2].innerHTML = values.temperature;
    tableRow.cells[3].innerHTML = values.humidity;
    tableRow.cells[4].innerHTML = values.windSpeed;
    tableRow.cells[5].innerHTML = values.cloudiness;

    // update into localStorage
    localStorage.setItem(rowId, JSON.stringify(values));
}

function handleResponse(ajaxRequest, rowId, cityName){
    if (ajaxRequest.readyState === 4) {

        if (ajaxRequest.status === 200) {
            console.log('-- cityName: ', cityName);
            var tableCurrentRows = document.getElementById("weatherTable").rows.length;

            var jsonResponse = JSON.parse(ajaxRequest.responseText);
            var convertedValues = getConvertedValues(jsonResponse);

            // check for whether to insert new row or secondary-row for the city
            if (rowId.indexOf("New") > -1) {

                // insert the sub-row for each city
                var parentRowId = rowId.substring(0,rowId.indexOf("New"));
                var parentRowIndex = document.getElementById(parentRowId).rowIndex;

                // use parentRowId to get previous values (with either 1st Row of city or from localStorage)
                var previousValues = JSON.parse(localStorage.getItem(parentRowId));

                // check for change in the value
                if (compareValuesWithLocalStorage(convertedValues, previousValues)) {
                    if (document.getElementById(rowId) === null) {
                        insertTableRow(previousValues, rowId, parentRowIndex + 1);
                        updateTableRow(convertedValues, parentRowId);
                    } else {
                        updateTableRow(convertedValues, parentRowId);
                        updateTableRow(previousValues, rowId);
                    }
                } else {
                    if (document.getElementById(rowId) === null) {
                        insertTableRow({
                            cityName: jsonResponse.name + ", " + jsonResponse.sys.country,
                            timeStamp: '-',
                            temperature: '-',
                            humidity: '-',
                            windSpeed: '-',
                            cloudiness: '-'
                        }, rowId, parentRowIndex+1);
                    }
                }
            } else if (rowId === THIRD_CITY_ID){
                if (document.getElementById(THIRD_CITY_ID) !== null) {

                    document.getElementById(THIRD_CITY_ID).parentNode.removeChild(document.getElementById(THIRD_CITY_ID));
                    insertTableRow(convertedValues, rowId, tableCurrentRows - 1);

                    if (document.getElementById(THIRD_CITY_NEW_ROW_ID) !== null) {
                        // remove the existing new row Id
                        document.getElementById(THIRD_CITY_NEW_ROW_ID).parentNode.removeChild(document.getElementById(THIRD_CITY_NEW_ROW_ID));
                    }
                } else {
                    insertTableRow(convertedValues, rowId, tableCurrentRows);
                }
            } else {
                insertTableRow(convertedValues, rowId, tableCurrentRows);
            }

            if (document.getElementById(TABLE_ID).rows.length >= 3) {
                displayStats();
            }

        } else {
            var errorMessage = "";

            switch (ajaxRequest.status){

                case 401:
                    errorMessage = cityName + ", Error: 401, UnAuthorized Access";
                    break;

                case 403:
                    errorMessage = cityName + ", Error: 403, Forbidden Access";
                    break;

                case 404:
                    errorMessage = cityName + ", Error: 404, Not Found";
                    break;

                case 405:
                    errorMessage = cityName + ", Error: 405, Method Not Allowed";
                    break;

                case 500:
                    errorMessage = cityName + ", Error: 500, Internal Server Error";
                    break;

                case 502:
                    errorMessage = cityName + ", Error: 502, Bad Gateway";
                    break;

                default:
                    errorMessage = cityName + ", Error: " + ajaxRequest.status + ", " + ajaxRequest.statusText
            }

            document.getElementById(ERORR_DIV_ID).innerHTML += errorMessage;
        }

    }

}

function sendRequest(cityName, rowId){
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function(){
        handleResponse(xHttp, rowId, cityName);
    };

    xHttp.open(GET_METHOD, API_URL + cityName, true);
    // xHttp.open(GET_METHOD, MOCK_API_URL + cityName, true);
    xHttp.send();
}

function loadThirdCity(){
    var selectedCity = document.getElementById(THIRD_CITY_SELECT_ID).value;
    sendRequest(selectedCity, THIRD_CITY_ID);

    // reset the errorMessage div
    document.getElementById(ERORR_DIV_ID).innerHTML = "";
    Android.sendThirdCity(selectedCity);
}

function refreshData(){
    sendRequest(LONDON_CITY_CAPTION, FIRST_CITY_NEW_ROW_ID);
    sendRequest(PHOENIX_CITY_CAPTION, SECOND_CITY_NEW_ROW_ID);

    if (document.getElementById(THIRD_CITY_ID) !== null) {
        sendRequest(document.getElementById(THIRD_CITY_SELECT_ID).value, THIRD_CITY_NEW_ROW_ID);
    }

    // reset the errorMessage div
    document.getElementById(ERORR_DIV_ID).innerHTML = "";
}

function initApp(){
    sendRequest(LONDON_CITY_CAPTION, FIRST_CITY_ID);
    sendRequest(PHOENIX_CITY_CAPTION, SECOND_CITY_ID);
}