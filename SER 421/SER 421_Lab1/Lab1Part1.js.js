
var test1 = '{"tournament":{"name": "British Open","year": " ","award": 840000,"yardage": 6905,"par": 71,"round": 3,"players": [{"lastname": "Montgomerie", "firstinitial": "C", "score": -3, "hole": 17 },{"lastname": "Fulke", "firstinitial": "P", "score": -1, "hole": 17}, {"lastname": "Pratt", "firstinitial": "Q", "score": 0, "hole": 17 }]}}';

var test2 = '{"tournament":{"name": "British Open","year": " ","award": 840000,"yardage": 6905,"par": 71,"round": 1,"players": [{"lastname": "Montgomerie", "firstinitial": "C", "score": -5, "hole": 17 },{"lastname": "Fulke", "firstinitial": "P", "score": -5, "hole": "finished"}]}}';
    
var test4 = 
    '{"tournament":{"name":"British Open","year":2001,"award":840000,"yardage":6905,"par":71,"round":1,"players":[{"lastname":"Montgomerie","firstinitial":"C","score":1,"hole":17},{"lastname":"Fulke","firstinitial":"P","score":-2,"hole":"finished"},{"lastname":"Owen","firstinitial":"G","score":-1,"hole":"finished"},{"lastname":"Parnevik","firstinitial":"J","score":-3,"hole":"finished"},{"lastname":"Ogilvie","firstinitial":"J","score":1,"hole":"finished"},{"lastname":"Cejka","firstinitial":"A","score":-2,"hole":"finished"},{"lastname":"Romero","firstinitial":"E","score":0,"hole":"finished"},{"lastname":"Fasth","firstinitial":"N","score":-4,"hole":"finished"}]}}';
var test5 = 
    '{"tournament":{"name":"British Open","year":2001,"award":840000,"yardage":6905,"par":71,"round":3,"players":[{"lastname":"Montgomerie","firstinitial":"C","score":-2,"hole":14},{"lastname":"Fulke","firstinitial":"P","score":3,"hole":"finished"},{"lastname":"Owen","firstinitial":"G","score":0,"hole":0},{"lastname":"Parnevik","firstinitial":"J","score":1,"hole":9},{"lastname":"Ogilvie","firstinitial":"J","score":-1,"hole":3},{"lastname":"Cejka","firstinitial":"A","score":2,"hole":17},{"lastname":"Romero","firstinitial":"E","score":-1,"hole":"finished"},{"lastname":"Fasth","firstinitial":"N","score":1,"hole":11}]}}';

var test6 = 
    '{"tournament":{"name":"British Open","year":2001,"award":840000,"yardage":6905,"par":71,"round":3,"players":[{"lastname":"Montgomerie","firstinitial":"C","score":-2,"hole":14},{"lastname":"Fulke","firstinitial":"P","score":3,"hole":"finished"},{"lastname":"Owen","firstinitial":"G","score":0,"hole":0},{"lastname":"Parnevik","firstinitial":"J","score":1,"hole":9},{"lastname":"Ogilvie","firstinitial":"J","score":-1,"hole":3},{"lastname":"Cejka","firstinitial":"A","score":2,"hole":17},{"lastname":"Romero","firstinitial":"E","score":-1,"hole":"finished"},{"lastname":"Fasth","firstinitial":"N","score":1,"hole":11}]}}';

class Player {    
    constructor(playerString){
            var player = JSON.parse(playerString);
            this.lastname = player.lastname;
            this.firstinitial = player.firstinitial;
            this.score = player.score;
            this.hole = player.hole;    
    }    
}

function isTournamentCompleted(tournament){
    var roundFlag = false;
    tournament.players.forEach(function(player){
        if(player.hole == "finished")
            roundFlag = true;
        else
            roundFlag = false;
    });
    var finishTournament = false;
    if(roundFlag){
        tournament.round++;
        tournament.players.forEach(function(player){
            player.hole = 0;
        });
        if(tournament.round == 4){
            tournament.players = sortArray(T.players);
            var winnerPlayer = tournament.players[0];
            Tournament.prototype.winner = null;
            tournament.winner = winnerPlayer;
            Tournament.prototype.getWinner = function(){
                return this.winner.lastname;
            };
            Player.prototype.winnings = 0;
            assignWinnings(tournament);
            finishTournament = true;
        }
    }
    return finishTournament;
};

function assignWinnings(tournament){
    var award = tournament.award;
    tournament.players[0].winnings = award * 5/10;
    tournament.players[1].winnings = award * 3/10;
    tournament.players[2].winnings = award * 2/10;
}


class Tournament {
    constructor(tournamentString){
        var tournament = (JSON.parse(tournamentString)).tournament;
        this.name = tournament.name;
        this.year = tournament.year;
        this.award = tournament.award;
        this.yardage = tournament.yardage;
        this.par = tournament.par;
        this.round = tournament.round;
        var playerList = [];        
        tournament.players.forEach( function (player){
            var item = new Player(JSON.stringify(player));
            playerList.push(item);
        });    
        this.players = playerList;
    }
    
    leaderboard(func) {
        var arr = this;
        if(func != undefined){
            arr.players.forEach(function(player){
                player.score = func(player.lastname, player.firstinitial);
            });
        }
        arr.players = sortArray(arr.players);
        return JSON.stringify(arr);
    }
    
    projectScoreByIndividual(lastName, initial){
        var P;
        this.players.forEach(function(player){
           if(player.lastname == lastName && player.firstinitial == initial)
               P = player;
        });
        var hole = holeConversion(P.hole);
        var score = (P.score/hole) * (18 - hole) + P.score;
        return Math.round(score);
    }
    
    projectScoreByHole (lastName, initial){
        var P;
        this.players.forEach(function(player){
           if(player.lastname == lastName && player.firstinitial == initial)
               P = player;
        });
        var hole = holeConversion(P.hole);
        var pScore = this.projectScoreByIndividual(lastName, initial);
        var rHoles = 18 - hole;
        var avgSum = 0;
        var round = this.round;
        var totalHoles = 0; 
        this.players.forEach(function(player){
            totalHoles = holeConversion(player.hole) + (18 * round);
            avgSum += player.score / totalHoles;
        });
        var avgScore = Math.abs(avgSum) / this.players.length;
        var result = pScore + rHoles * avgScore;
        return Math.round(result);
    }
    
    projectedLeaderboard (func){
        if(func && typeof func == "function")
            return this.leaderboard(func);
        else
            return "function parameter is not a valid function";
    }
    
    postScore(lastName, initial, score){
        if(this.round < 4){
            var P = getPlayer(this,lastName, initial)
            if(P.hole != "finished"){
                P.score += score;
                if(P.hole != 17)
                    P.hole++;
                else{
                    P.hole = "finished";
                    isTournamentCompleted(this);
                }        
            }    
        }
        
    }
}

function holeConversion(hole){
    return hole=="finished" ? 18 : hole;
}

function sortArray(players){
    players.sort(function(player1,player2){
        if(player1.score != player2.score){
            if(player1.score > player2.score)
                return 1;
            else
                return -1;
        }else {
            return holeConversion(player2.hole) - holeConversion(player1.hole);
        }
    });
    return players;
}

function getPlayer(tm,lastName,initial){
    var P;
    tm.players.forEach(function(player){
           if(player.lastname == lastName && player.firstinitial == initial)
               P = player;
    });
    return P;
}

Tournament.prototype.printLeaderboard = function(){
    console.log(this.leaderboard());
};


var T = new Tournament(test1);





