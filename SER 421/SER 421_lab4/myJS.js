console.log("-----------start-------------");
// is len for all array same ?

var rooms = ["Kitchen", "Study", "Living Room", "Dining Room", "Library"];
var suspects = ["Mrs. Peacock", "Mrs. Green", "Miss Scarlet", "Colonel Mustard", "Professor Plum"];
var weapons = ["Pistol", "Knife", "Wrench", "Lead Pipe", "Candlestick"];

function getRandom() {
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
    console.log(computerGuessList);
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

function assignPlayerCards() {
    var playerRooms = [];
    var playerSuspects = [];
    var playerWeapons = [];

    var len = tempRooms.length;
    var i = 0;
    while (i < len / 2) {
        var temp = getRandom();
        removeTriplet(temp);
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
    assignPlayerCards();
    fillDropdowns();
    var pElement = document.getElementsByName("displayName");
    var formElement = document.getElementsByName("usernameForm");
    var nameElement = document.getElementsByName("userName");
    var playerName = nameElement[0].value;
    player.name = playerName;
    var element = document.getElementById("usernameForm");
    element.parentNode.removeChild(element);
    pElement[0].innerHTML = getPlayerMsg(player, playerName);

    var guessButtonElement = document.getElementById("guessButton");
    guessButtonElement.removeAttribute('disabled');
    console.log(player);
    console.log(secret);
    console.log(computer);
}

function showTopData() {
    //var pElement = document.getElementsByName("topData");
    var pElement = document.getElementById("topData");
    //console.log(pElement);
    //pElement[0].innerHTML = "we did it";
}

//showTopData();
function checkGuess(flag) {
    if (flag) {
        var compGuess = getRandomCompGuess();
        var selectedRoom = compGuess.room;
        var selectedSuspect = compGuess.suspect;
        var selectedWeapon = compGuess.weapon;
    } else {
        var roomGuessElement = document.getElementsByName("rooms")[0];
        var selectedRoom = roomGuessElement.options[roomGuessElement.selectedIndex].text;
        var suspectGuessElement = document.getElementsByName("suspects")[0];
        var selectedSuspect = suspectGuessElement.options[suspectGuessElement.selectedIndex].text;
        var weaponGuessElement = document.getElementsByName("weapons")[0];
        var selectedWeapon = weaponGuessElement.options[weaponGuessElement.selectedIndex].text;
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

    if (success && !flag) {
        responseMsg = "That was the correct guess! " + selectedSuspect + " did it with the " + selectedWeapon + " in the " + selectedRoom + "!<br>Click to start a new game:  <input type=\"button\" value=\"New Game\" onclick=\"restart()\" />";
    } else if (!success && !flag) {
        responseMsg = "Sorry that was an incorrect guess! The Computer holds the card for " + wrongGuess + "<br>" + "Click to continue:  <input type=\"button\" value=\"Continue\" onclick=\"nextTurn(true)\" />";
    } else if (success && flag) {
        responseMsg = "The Computer guessed " + selectedSuspect + " in the " + selectedRoom + " with " + selectedWeapon +
            "<br>That was correct guess. <br>Click to start a new game:  <input type=\"button\" value=\"New Game\" onclick=\"restart()\" />";
    } else {
        "Miss Scarlet in the Library with a Wrench"
        responseMsg = "The Computer guessed " + selectedSuspect + " in the " + selectedRoom + " with " + selectedWeapon + "<br>The Computer made an incorrect guess! You holds the card for " + wrongGuess + "<br>" + "Click to continue:  <input type=\"button\" value=\"Continue\" onclick=\"nextTurn(false)\" />";
    }
    
    var guessButtonElement = document.getElementById("guessButton");    
    if(flag){
        guessButtonElement.removeAttribute('disabled');
    }else{
        guessButtonElement.setAttribute("disabled","true");
                
    }
    p.innerHTML = responseMsg;
    p.setAttribute("id","lastPTag");
    var element = document.getElementById("lastPTag");
    if(element !== null)
        element.parentNode.removeChild(element);
    document.body.appendChild(p);
}

function nextTurn(flag) {
    if (flag) {
        //console.log("Its turn for computer");
        checkGuess(true);
    } else {
        //console.log("Its turn for player");
        checkGuess(false);
    }
}

function showHistory() {

}

function clearDropdown(name){
    var select = document.getElementsByName(name)[0];
    var length = select.options.length;
    for (i = 0; i < length; i++) {
        select.options[i] = null;
    }

}

function restart(){
    // add new name tag........
    var element = document.getElementById("lastPTag");
    if(element !== null)
        element.parentNode.removeChild(element);
    
    tempRooms = JSON.parse(JSON.stringify(rooms));
    tempSuspects = JSON.parse(JSON.stringify(suspects));
    tempWeapons = JSON.parse(JSON.stringify(weapons));
    var playerName = player.name;
    player = {};
    computer = {};
    secret = getRandom();
    removeTriplet(secret);
    playerGuessList = {};
    computerGuessList = {};
    assignPlayerCards();
    fillDropdowns();
    var pElement = document.getElementsByName("displayName");
    pElement[0].innerHTML = getPlayerMsg(player, playerName);
    
}

var tempRooms = JSON.parse(JSON.stringify(rooms));
var tempSuspects = JSON.parse(JSON.stringify(suspects));
var tempWeapons = JSON.parse(JSON.stringify(weapons));

var player = {};
var computer = {};

var secret = getRandom();
removeTriplet(secret);
var playerGuessList = {};
var computerGuessList = {};
