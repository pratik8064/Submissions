console.log("-----------start-------------");


var rooms = ["Winterfell", "Kings Landing", "DragonStone", "Vale", "The Wall", "Storms End", "Dorn"];
var suspects = ["John Snow", "Ned Stark", "Daenerys", "Sam", "Arya", "NightKing", "Jaime Lanister"];
var weapons = ["Drogon", "Ice", "Oathkeeper", "Heartsbane", "Needle", "Dawn", "LongClow"];

//---------------------------------------------------------------------------------------------------------------------

function showData(){    
    var element = document.getElementById("inputData");
    var str = "rooms : ";
    rooms.forEach(function(item){
        str+= item + "  ";
    });
    str += "<br>suspects : ";
    suspects.forEach(function(item){
        str+= item + "  ";
    });
    str+= "<br>weapons : ";
    weapons.forEach(function(item){
        str+= item + "  ";
    });
    element.innerHTML = str;
}

showData();

function getRandomTriplet() {
    var randomRoom = tempRooms[Math.floor(Math.random() * tempRooms.length)];
    var randomSuspect = tempSuspects[Math.floor(Math.random() * tempSuspects.length)];
    var randomWeapon = tempWeapons[Math.floor(Math.random() * tempWeapons.length)];
    return {
        room: randomRoom,
        suspect: randomSuspect,
        weapon: randomWeapon
    }
}

function getRandomCompGuess() {
    var randomRoom = computerGuessList.rooms[Math.floor(Math.random() * computerGuessList.rooms.length)];
    var randomSuspect = computerGuessList.suspects[Math.floor(Math.random() * computerGuessList.suspects.length)];
    var randomWeapon = computerGuessList.weapons[Math.floor(Math.random() * computerGuessList.weapons.length)];
    return {
        room: randomRoom,
        suspect: randomSuspect,
        weapon: randomWeapon
    }
}

function removeTriplet(player) {
    var index = tempRooms.indexOf(player.room);
    tempRooms.splice(index, 1);
    index = tempSuspects.indexOf(player.suspect);
    tempSuspects.splice(index, 1);
    index = tempWeapons.indexOf(player.weapon);
    tempWeapons.splice(index, 1);
}

function getPlayerMsg(player, playerName) {
    var msg = "Hello " + playerName + ", you hold the cards for "
    player.rooms.forEach(function (item) {
        msg = msg + item + ", ";
    });
    player.suspects.forEach(function (item) {
        msg = msg + item + ", ";
    });
    player.weapons.forEach(function (item) {
        msg = msg + item + ", ";
    });

    msg = msg.substring(0, msg.length - 2);
    return msg;
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


function shuffleDataList() {
    randomArray = []
    tempRooms.forEach(function (item) {
        randomArray.push(item);
    });
    tempWeapons.forEach(function (item) {
        randomArray.push(item);
    });
    tempSuspects.forEach(function (item) {
        randomArray.push(item);
    });
    randomArray = shuffle(randomArray);
}

function assignPlayerCards() {

    var playerRooms = [];
    var playerSuspects = [];
    var playerWeapons = [];
    var compRooms = [];
    var compSuspects = [];
    var compWeapons = [];

    shuffleDataList();
    
    var len = parseInt(randomArray.length/2);
    var playerList = randomArray.splice(0,len);
    var compList = randomArray;    
    
    playerList.forEach(function(item){
        if(tempRooms.includes(item)){
            playerRooms.push(item);
        }else if(tempSuspects.includes(item)){
            playerSuspects.push(item);
        }else if(tempWeapons.includes(item)){
            playerWeapons.push(item);     
        }
    });
    compList.forEach(function(item){
        if(tempRooms.includes(item)){
            compRooms.push(item);
        }else if(tempSuspects.includes(item)){
            compSuspects.push(item);
        }else if(tempWeapons.includes(item)){
            compWeapons.push(item);     
        }
    });
    player = {
        rooms: playerRooms,
        suspects: playerSuspects,
        weapons: playerWeapons
    };
    computer = {
        rooms: compRooms,
        suspects: compSuspects,
        weapons: compWeapons
    };
}

function getDropdownList(pList, cList) {
    var res = [];
    pList.forEach(function (pItem) {
        if (cList.includes(pItem) === false) {
            res.push(pItem);
        }
    });
    return res;
}

function fillDropdowns() {

    playerGuessList.rooms = getDropdownList(rooms, player.rooms);
    playerGuessList.suspects = getDropdownList(suspects, player.suspects);
    playerGuessList.weapons = getDropdownList(weapons, player.weapons);

    clearDropdown("rooms");
    var roomGuesslement = document.getElementsByName("rooms")[0];
    for (index in playerGuessList.rooms) {
        roomGuesslement.options[roomGuesslement.options.length] = new Option(playerGuessList.rooms[index], index);
    }

    clearDropdown("suspects");
    var suspectGuessElement = document.getElementsByName("suspects")[0];
    for (index in playerGuessList.suspects) {
        suspectGuessElement.options[suspectGuessElement.options.length] = new Option(playerGuessList.suspects[index], index);
    }
    clearDropdown("weapons");
    var weaponGuessElement = document.getElementsByName("weapons")[0];
    for (index in playerGuessList.weapons) {
        weaponGuessElement.options[weaponGuessElement.options.length] = new Option(playerGuessList.weapons[index], index);
    }

    computerGuessList.rooms = getDropdownList(rooms, computer.rooms);
    computerGuessList.suspects = getDropdownList(suspects, computer.suspects);
    computerGuessList.weapons = getDropdownList(weapons, computer.weapons);

}

function displayPlayer() {
    //addForm();
    assignPlayerCards();
    fillDropdowns();
    var pElement = document.getElementsByName("displayName");
    var formElement = document.getElementsByName("usernameForm");
    var nameElement = document.getElementsByName("userName");
    var playerName = nameElement[0].value;
    player.playerName = playerName;
    var element = document.getElementById("usernameForm");
    element.parentNode.removeChild(element);
    pElement[0].innerHTML = getPlayerMsg(player, playerName);
    enableGuess();
    console.log(secret);
}

function getWinningTime(){
    var str = "";
    var d = new Date();
    str += d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear() + " at " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    return str;
}

function removeForm(){
    var form = document.getElementById("guessForm");
    form.parentNode.removeChild(form);
}

function addForm(){
    var formParent = document.getElementById("formParent");
    var form = document.createElement("form");
    form.id = "guessForm";
    var label1 = document.createElement("label");
    label1.innerHTML = "Guess Room:";
    form.appendChild(label1);
    var select1 = document.createElement("select");
    select1.name="rooms";
    form.appendChild(select1);
    var br1 = document.createElement("br");
    form.appendChild(br1);
    
    var label2 = document.createElement("label");
    label2.innerHTML = "Guess Suspect:";
    form.appendChild(label2);
    var select2 = document.createElement("select");
    select2.name="suspects";
    form.appendChild(select2);
    var br2 = document.createElement("br");
    form.appendChild(br2);
    
    var label3 = document.createElement("label");
    label3.innerHTML = "Guess Weapon:";
    form.appendChild(label3);
    var select3 = document.createElement("select");
    select3.name="weapons";
    form.appendChild(select3);
    var br3 = document.createElement("br");
    form.appendChild(br3);
    /*
    <input id="guessButton" type="button" disabled="true" value="Guess" onclick="checkGuess()" />
            <input id="historyButton" type="button" value="Show History" />
            <input id="recordButton" type="button" value="Show Record" onclick="showRecord()" />
    */
    var ip1 = document.createElement("input");
    ip1.id = "guessButton";
    ip1.type="button";
    ip1.disabled = "true";
    ip1.value = "Guess";
    ip1.addEventListener('click', checkGuess);
    form.appendChild(ip1);
    
    var ip2 = document.createElement("input");
    ip2.id = "historyButton";
    ip2.type="button";
    ip2.value = "Show History";
    ip1.addEventListener('click', showHistory);
    form.appendChild(ip2);
    
    var ip3 = document.createElement("input");
    ip3.id = "recordButton";
    ip3.type="button";
    ip3.value = "Show Record";
    ip3.addEventListener('click', showRecord);
    form.appendChild(ip3);
    formParent.appendChild(form);
}

function checkGuess(flag) {
    if (flag) {
        var compGuess = getRandomCompGuess();
        var selectedRoom = compGuess.room;
        var selectedSuspect = compGuess.suspect;
        var selectedWeapon = compGuess.weapon;
        var entry = "Computer guess : [Room - " + selectedRoom + "] [suspect - " + selectedSuspect + "] [weapon - " + selectedWeapon + "] <br>";
        historyStr += entry;
        sessionStorage.setItem("historyStr", historyStr);
    } else {
        var roomGuessElement = document.getElementsByName("rooms")[0];
        var selectedRoom = roomGuessElement.options[roomGuessElement.selectedIndex].text;
        var suspectGuessElement = document.getElementsByName("suspects")[0];
        var selectedSuspect = suspectGuessElement.options[suspectGuessElement.selectedIndex].text;
        var weaponGuessElement = document.getElementsByName("weapons")[0];
        var selectedWeapon = weaponGuessElement.options[weaponGuessElement.selectedIndex].text;
        var entry = "Player guess : [Room - " + selectedRoom + "] [suspect - " + selectedSuspect + "] [weapon - " + selectedWeapon + "] <br>";
        historyStr += entry;
        sessionStorage.setItem("historyStr", historyStr);
    }

    var success = false;
    if (selectedRoom === secret.room) {
        if (selectedSuspect === secret.suspect) {
            if (selectedWeapon === secret.weapon) {
                success = true;
            } else {
                wrongGuess = selectedWeapon;
            }
        } else {
            wrongGuess = selectedSuspect;
        }
    } else {
        wrongGuess = selectedRoom;
    }

    var p = document.createElement("p");
    var responseMsg = "";
    var continueButton = document.createElement("input");
    continueButton.type="button";
    if (success && !flag) {
        responseMsg = "That was the correct guess! " + selectedSuspect + " did it with the " + selectedWeapon + " in the " + selectedRoom + "!<br>Click to start a new game:  "; 
        continueButton.value="New Game";
        continueButton.addEventListener("click", restart);
        
        var recordStr = player.playerName +" vs Computer, "+player.playerName+" won on " + getWinningTime() + " <br>";
        record += recordStr;
        localStorage.setItem("record", record);
        
    } else if (!success && !flag) {
        responseMsg = "Sorry that was an incorrect guess! The Computer holds the card for " + wrongGuess + "<br>" + "Click to continue:  ";
        //<input type=\"button\" value=\"Continue\" onclick=\"checkGuess(true)\" />";
        disableGuess();
        continueButton.value="Continue";
        continueButton.addEventListener("click", function(){
            checkGuess(true);
        });
    } else if (success && flag) {
        responseMsg = "The Computer guessed " + selectedSuspect + " in the " + selectedRoom + " with " + selectedWeapon +
            "<br>That was correct guess. <br>Click to start a new game:  ";
        continueButton.value="New Game";
        continueButton.addEventListener("click", restart);
        var recordStr = player.playerName +" vs Computer, Computer won on " + getWinningTime() + " <br>";
        record += recordStr;
        localStorage.setItem("record", record);
    } else {
        responseMsg = "The Computer guessed " + selectedSuspect + " in the " + selectedRoom + " with " + selectedWeapon + "<br>The Computer made an incorrect guess! You holds the card for " + wrongGuess + "<br>" + "Click to continue: " 
        disableGuess();
        continueButton.value="Continue";
        continueButton.addEventListener("click", enableGuess);
    }

    p.innerHTML = responseMsg;
    p.setAttribute("id", "lastPTag");
    var element = document.getElementById("lastPTag");
    if (element !== null){
        element.parentNode.removeChild(element);
    }
    p.appendChild(continueButton);    
    document.body.appendChild(p);
}

function hideHistory(){
    console.log("hide history");
    var element = document.getElementById("historyList");
    if (element !== null)
        element.parentNode.removeChild(element);
    var historyButton = document.getElementById("historyButton");
    historyButton.value = "Show History";
    historyButton.removeEventListener('click',hideHistory);
    historyButton.addEventListener('click', showHistory);
}

function showHistory() {
    console.log("show history");
    var historyButton = document.getElementById("historyButton");
    historyButton.value = "Hide History";
    historyButton.removeEventListener('click',showHistory);
    historyButton.addEventListener('click', hideHistory);
    var historyList = document.createElement("p");
    historyList.id = "historyList";
    //var list = "this is new <br> how bou that? <br>";
    console.log(historyStr);
    historyList.innerHTML = historyStr;
    document.getElementById("historyP").appendChild(historyList);
    
}

function hideRecord(){
    console.log("hideRecord");
    var recordButton = document.getElementById("recordButton");
    recordButton.value = "Show Record";
    recordButton.removeEventListener('click',hideRecord);
    recordButton.addEventListener('click', showRecord);
    var recordList = document.getElementById("record");
    recordList.innerHTML = "";
}
function showRecord(){
    console.log("show record");
    var recordButton = document.getElementById("recordButton");
    recordButton.value = "Hide Record";
    recordButton.removeEventListener('click',showRecord);
    recordButton.addEventListener('click', hideRecord);
    var recordList = document.getElementById("record");
    //recordList.id = "historyList";
    //var list = "this is new <br> how bou that? <br>";
    recordList.innerHTML = record;
    //document.getElementById("historyP").appendChild(historyList);
}

function clearDropdown(name) {
    var select = document.getElementsByName(name)[0];
    select.options.length = 0;
}

function restart() {
    //removeForm();
    var element = document.getElementById("lastPTag");
    if (element !== null)
        element.parentNode.removeChild(element);
    var pElement = document.getElementsByName("displayName")[0];
    pElement.innerHTML = "";
    var formElement = document.createElement("form");
    formElement.id = "usernameForm";
    formElement.innerHTML = "Name:";
    var ip1 = document.createElement("input");
    ip1.name = "userName";
    ip1.type = "text";
    ip1.autofocus = true;
    var ip2 = document.createElement("input");
    ip2.type = "button";
    ip2.value = "Enter";
    ip2.addEventListener("click", displayPlayer);
    formElement.appendChild(ip1);
    formElement.appendChild(ip2);
    pElement.appendChild(formElement);
    disableGuess();
    clearDropdown("rooms");
    clearDropdown("suspects");
    clearDropdown("weapons");
    tempRooms = JSON.parse(JSON.stringify(rooms));
    tempSuspects = JSON.parse(JSON.stringify(suspects));
    tempWeapons = JSON.parse(JSON.stringify(weapons));
    player = {};
    computer = {};
    secret = getRandomTriplet();
    removeTriplet(secret);
    playerGuessList = {};
    computerGuessList = {};
    console.log(secret);
}

function enableGuess(){    
    var guessButtonElement = document.getElementById("guessButton");
    guessButtonElement.removeAttribute('disabled');
    var element = document.getElementById("lastPTag");
    if (element !== null)
        element.parentNode.removeChild(element);    
}
function disableGuess(){
    var guessButtonElement = document.getElementById("guessButton");
    guessButtonElement.setAttribute("disabled", "true");
}


var tempRooms = JSON.parse(JSON.stringify(rooms));
var tempSuspects = JSON.parse(JSON.stringify(suspects));
var tempWeapons = JSON.parse(JSON.stringify(weapons));

var player = {};
var computer = {};

var secret = getRandomTriplet();
removeTriplet(secret);
var playerGuessList = {};
var computerGuessList = {};
var randomArray = [];
var historyStr = "";
var record = " ";
if (sessionStorage){
    if(sessionStorage.getItem("historyStr") !== null){
        historyStr += sessionStorage.getItem("historyStr");
    }   
}
if (localStorage){
    if(localStorage.getItem("record") !== null){
        record += sessionStorage.getItem("record");
    }   
}

var historyButton = document.getElementById("historyButton");
historyButton.addEventListener('click', showHistory);
var recordButton = document.getElementById("recordButton");
recordButton.addEventListener('click', showRecord);
