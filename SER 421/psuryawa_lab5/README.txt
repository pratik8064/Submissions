----------------------------------------------------------------------------------------------------------

name : Pratik Suryawanshi
asurite : psuryawa
ID : 1213231238

----------------------------------------------------------------------------------------------------------

localstorage contains latest data to show on UI.
so if browser is closed and reloaded data is fetched from localstorage and compared with latest data.
if data is updated then both values will be shown.

At onload only phoenix and london data is shown. 

API used is :
http://openweathermap.org/data/2.5/weather?q=" + city + "&appid=b1b15e88fa797225412429c1c50c122a1"

getting temperature in degree celcius . hence conversion from kelvin to degree celcius is not done.
(else would have substracted 273 form kelvin value) wind conversion is done. 
----------------------------------------------------------------------------------------------------------

EC1 is attempted 

In this web app, MVC framework AngularJS is used

Service weatherService is implemented to make ajax call and other data manipulation

myApp.js contains main controller. (which calls weatherService service function to get data)

main.html template is loaded into index.html using ng-view. (thus seperating view)

ng-route directive is used to maintain proper MVC structure which loads main template using proper routing.

directives like ng-options, ng-change, ng-click are used for respective purpose.

I have tested my Extra credit submission using brackets preview ( to avoid CORs issue)
--------------------------------------------------------------------------------------------------------------