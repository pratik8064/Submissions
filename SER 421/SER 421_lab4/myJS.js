console.log("-----------start-------------");
// is len for all array same ?

var rooms = ["Kitchen", "Study", "Living Room", "Dining Room", "Library"];
var suspects = ["Mrs. Peacock", "Mrs. Green", "Miss Scarlet", "Colonel Mustard", "Professor Plum"];
var weapons = ["Pistol", "Knife", "Wrench", "Lead Pipe", "Candlestick"];


var tempRooms = JSON.parse(JSON.stringify(rooms));
var tempSuspects = JSON.parse(JSON.stringify(suspects));
var tempWeapons = JSON.parse(JSON.stringify(weapons));

var player = {};
var computer = {};

function getRandom() {
    var randomRoom = tempRooms[Math.floor(Math.random() * tempRooms.length)];
    var randomSuspect = tempSuspects[Math.floor(Math.random() * tempSuspects.length)];
    var randomWeapon = tempWeapons[Math.floor(Math.random() * tempWeapons.length)];
    var index = tempRooms.indexOf(randomRoom);
    tempRooms.splice(index, 1);
    index = tempSuspects.indexOf(randomSuspect);
    tempSuspects.splice(index, 1);
    index = tempWeapons.indexOf(randomWeapon);
    tempWeapons.splice(index, 1);
    return {
        room: randomRoom,
        suspect: randomSuspect,
        weapon: randomWeapon
    }
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

function assignPlayerCards() {
    var playerRooms = [];
    var playerSuspects = [];
    var playerWeapons = [];

    var len = tempRooms.length;
    var i = 0;
    while (i < len / 2) {
        var temp = getRandom();
        playerRooms.push(temp.room);
        playerSuspects.push(temp.suspect);
        playerWeapons.push(temp.weapon);
        i++;
    }
    player = {
        rooms: playerRooms,
        suspects: playerSuspects,
        weapons: playerWeapons
    };
    computer = {
        rooms: tempRooms,
        weapons: tempWeapons,
        suspects: tempSuspects
    };
}

function getDropdownList(pList, cList){
    var res = [];
    pList.forEach(function(pItem){
        if(cList.includes(pItem) === false){
            res.push(pItem);
        }
    });
    return res;
}

function fillDropdowns(){
    var playerGuessList = {};
    playerGuessList.rooms = getDropdownList(rooms, player.rooms);
    playerGuessList.suspects = getDropdownList(suspects, player.suspects);
    playerGuessList.weapons = getDropdownList(weapons, player.weapons);
    
    var roomGuesslement = document.getElementsByName("rooms")[0];
    for(index in playerGuessList.rooms) {
        roomGuesslement.options[roomGuesslement.options.length] = new Option(playerGuessList.rooms[index], index);
    }
    
    var suspectGuessElement = document.getElementsByName("suspects")[0];
    for(index in playerGuessList.suspects) {
        suspectGuessElement.options[suspectGuessElement.options.length] = new Option(playerGuessList.suspects[index], index);
    }
    var weaponGuessElement = document.getElementsByName("weapons")[0];
    
    for(index in playerGuessList.weapons) {
        weaponGuessElement.options[weaponGuessElement.options.length] = new Option(playerGuessList.weapons[index], index);
    }
    
    
    var computerGuessList = {};
    computerGuessList.rooms = getDropdownList(rooms, computer.rooms);
    computerGuessList.suspects = getDropdownList(suspects, computer.suspects);
    computerGuessList.weapons = getDropdownList(weapons, computer.weapons);
    
}

function displayPlayer() {
    assignPlayerCards();
    fillDropdowns();
    var pElement = document.getElementsByName("displayName");
    var formElement = document.getElementsByName("usernameForm");
    var nameElement = document.getElementsByName("userName");
    var playerName = nameElement[0].value;
    var element = document.getElementById("usernameForm");
    element.parentNode.removeChild(element);
    pElement[0].innerHTML = getPlayerMsg(player, playerName);
    
    var guessButtonElement = document.getElementById("guessButton");
    guessButtonElement.removeAttribute('disabled');    
    //console.log(player);
    //console.log(secret);
    //console.log(computer);
    //console.log(rooms);
    //console.log(weapons);
    //console.log(suspects);    
}

function showTopData() {
    //var pElement = document.getElementsByName("topData");
    var pElement = document.getElementById("topData");
    //console.log(pElement);
    //pElement[0].innerHTML = "we did it";
}

//showTopData();
function checkGuess(){
    var roomGuessElement = document.getElementsByName("rooms")[0];
    var selectedRoom = roomGuessElement.options[roomGuessElement.selectedIndex].text;
    var suspectGuessElement = document.getElementsByName("suspects")[0];
    var selectedSuspect = suspectGuessElement.options[suspectGuessElement.selectedIndex].text;
    var weaponGuessElement = document.getElementsByName("weapons")[0];
    var selectedWeapon = weaponGuessElement.options[weaponGuessElement.selectedIndex].text;
    
    var success = false;
    if(selectedRoom === secret.room){
        if(selectedSuspect === secret.suspect){
            if(selectedWeapon === secret.weapon){
                success = true;
            }else{
                wrongGuess = selectedWeapon;
            }
        }else{
            wrongGuess = selectedSuspect;
        }
    }else {
        wrongGuess = selectedRoom;
    }
    
    var p = document.createElement("p");
    var input = document.createElement("INPUT");
    input.type = "button";
    
    if(success){
        var responseMsg = "That was the correct guess! " + selectedSuspect + " did it with the " + selectedWeapon + " in the " + selectedRoom + "!<br>Click to start a new game:  ";
        input.value = "New Game";
        input.onClick=function(){
            restart();   
        };
        //input.attachEvent('onclick', restart);

        
    }else {
        var responseMsg = "Sorry that was an incorrect guess! The Computer holds the card for " +  wrongGuess + "<br>" + "Click to continue: ";
        input.value = "Continue";
        input.onClick = function(){
            alert('HI');
            //nextTurn();   
        };
        //input.attachEvent('onclick', nextTurn);
    }
    p.innerHTML = responseMsg;
    document.body.appendChild(p);
    p.appendChild(input);
}

function nextTurn(){
    console.log("Its turn for computer");
}

function restart(){
    console.log("lets start new game");
}

/*
Sorry that was an incorrect guess! The Computer holds the card for Mrs. Peacock.
Click to continue:  [Continue]


The Computer guessed "Miss Scarlet in the Library with a Wrench"
The Computer made an incorrect guess! You holds the card for Library.
Click to continue:  [Continue]

That was the correct guess! Mrs. Green did it with the Candlestick in the Dining Room!
Click to start a new game:  [New Game]
*/


var secret = getRandom();
console.log("secret : ");
console.log(secret);
/*var secret = {
    room : "Living Room",
    suspect : "Professor Plum",
    weapon : "Pistol"
}*/
