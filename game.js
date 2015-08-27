exports = typeof window !== "undefined" && window !== null ? window : global;
var rand = require('random-seed').create('lqjkdpsjfslfjmlqsjdsk');
var Player = function(name, place, purse, inPenaltyBox){
  this.name = name;
  this.place = place;
  this.purse = purse;
  this.inPenaltyBox = inPenaltyBox;
}
var Question = function(popQuestion,scienceQuestion,sportsQuestion,rockQuestion){
  this.popQuestion = popQuestion;


}

// import ='node_modules/random-seed/lib/random-seed.js'
exports.Game = function() {

  var players          = new Array();
  
  var popQuestions     = new Array();
  var scienceQuestions = new Array();
  var sportsQuestions  = new Array();
  var rockQuestions    = new Array();

  var currentPlayer    = 0;
  var isGettingOutOfPenaltyBox = false;

  var didPlayerWin = function(){
    return !(players[currentPlayer].purse == 6)
  };

  var currentCategory = function(){
    if(players[currentPlayer].place%4 == 0)
      return 'Pop';
    if(players[currentPlayer].place%4 == 1)
      return 'Science';
    if(players[currentPlayer].place %4== 2)
      return 'Sports';
    return 'Rock';
  };

  this.createRockQuestion = function(index){
    return "Rock Question "+index;
  };

  for(var i = 0; i < 50; i++){
    popQuestions.push("Pop Question "+i);
    scienceQuestions.push("Science Question "+i);
    sportsQuestions.push("Sports Question "+i);
    rockQuestions.push(this.createRockQuestion(i));
  };

  this.isPlayable = function(howManyPlayers){
    return howManyPlayers >= 2;
  };

  this.add = function(playerName){
    players.push(new Player(playerName, 0, 0, false))
    console.log(playerName + " was added");
    console.log("They are player number " + players.length);

    return true;
  };

  this.howManyPlayers = function(){
    return players.length;  
  };


  var askQuestion = function(){
    if(currentCategory() == 'Pop')
      console.log(popQuestions.shift());
    if(currentCategory() == 'Science')
      console.log(scienceQuestions.shift());
    if(currentCategory() == 'Sports')
      console.log(sportsQuestions.shift());
    if(currentCategory() == 'Rock')
      console.log(rockQuestions.shift());
  };

  this.roll = function(roll){
    console.log(players[currentPlayer].name + " is the current player");
    console.log("They have rolled a " + roll);

    if(players[currentPlayer].inPenaltyBox){
      if(roll % 2 != 0){
        isGettingOutOfPenaltyBox = true;

        console.log(players[currentPlayer].name + " is getting out of the penalty box");
        players[currentPlayer].place = players[currentPlayer].place + roll;
        if(players[currentPlayer].place > 11){
          players[currentPlayer].place = players[currentPlayer].place - 12;
        }

        console.log(players[currentPlayer].name + "'s new location is " + players[currentPlayer].place);
        console.log("The category is " + currentCategory());
        askQuestion();
      }else{
        console.log(players[currentPlayer].name + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    }else{

      players[currentPlayer].place = players[currentPlayer].place + roll;
      if(players[currentPlayer].place > 11){
        players[currentPlayer].place = players[currentPlayer].place - 12;
      }

      console.log(players[currentPlayer].name + "'s new location is " + players[currentPlayer].place);
      console.log("The category is " + currentCategory());
      askQuestion();
    }
  };
  var isGettingOutOfPenaltyBox1 = function(){
       if(isGettingOutOfPenaltyBox){
        return correctanswer();
      }else{
        currentPlayer += 1;
        if(currentPlayer == players.length)
          currentPlayer = 0;
        return true;
      }
    }

    var correctanswer = function(){
      console.log("Answer was correct!!!!");

      players[currentPlayer].purse += 1;
      console.log(players[currentPlayer].name + " now has " +
                  players[currentPlayer].purse  + " Gold Coins.");

      var winner = didPlayerWin();

      currentPlayer += 1;
      if(currentPlayer == players.length)
        currentPlayer = 0;
      return winner;
    }
    
  this.wasCorrectlyAnswered = function(){
    if(players[currentPlayer].inPenaltyBox){
      return isGettingOutOfPenaltyBox1();
    }else{
      return correctanswer();

    }
  };

  this.wrongAnswer = function(){
		console.log('Question was incorrectly answered');
		console.log(players[currentPlayer].name + " was sent to the penalty box");
		players[currentPlayer].inPenaltyBox = true;

    currentPlayer += 1;
    if(currentPlayer == players.length)
      currentPlayer = 0;
		return true;
  };
};

var notAWinner = false;

var game = new Game();

game.add('Chet');
game.add('Pat');
game.add('Sue');

do{

  game.roll(rand.intBetween(1,6));

  if(rand.intBetween(1,10)== 7){
    notAWinner = game.wrongAnswer();
  }else{
    notAWinner = game.wasCorrectlyAnswered();
  }

}while(notAWinner);
