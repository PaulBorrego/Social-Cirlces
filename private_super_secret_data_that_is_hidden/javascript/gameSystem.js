//GamePiece Notes
// Values will be an array of ints 
// 0: Compliments
// 1: Offer Help
// 2: Invite to Event

class GamePiece {
    constructor (name, values) {
        this.name = name;
        this.values = values;
    }

    // Get result of action
    getActionResult(action) {
        return this.values[action];
    }

}

class Game {
    basic = [0,1,2,3,4,5,6,7,8];
    plays = 8;
    dailies = [];

    constructor (gamePieces) {
        this.gamePieces = gamePieces;
        for (let i = 0; i < this.plays; i++) {
            this.dailies[i] = null;
        }
        this.resetDailies();
    }

    resetDailies() {
        for (let i = 0; i < this.plays; i++) {
            this.dailies[i] = shuffle(this.gamePieces);
        }
    }

    getDailies(p) {
        return this.dailies[p];
    }

    // Get the circle from circle number
    getCircle(circleNumber,gameSet) {
        return gameSet.slice(circleNumber * 3, circleNumber * 3 + 3);
    }

    // Get the happiness as a result of the action
    doAction(circleNumber,action,p) {
        let gameSet = this.dailies[p - 1]; //who doesn't love off by one errors? AND EVEN WORSE THE COPILOT AUTOCOMPLETED THAT SENTANCE
        let circle = this.getCircle(circleNumber,gameSet);
        let happiness = 0;
        for (let i = 0; i < circle.length; i++) {
            happiness += circle[i].values[action];
        }
        return happiness;
    }

    // This method is used just for testing purposes
    setToBasic() {
        this.dailies[0] = this.gamePieces;
    }
    
    // mostly just for testing purposes
    singleCircleToString(circleNumber) {
        let circle = this.getCircle(circleNumber, this.dailies[0]);
        let str = '';
        for (let i = 0; i < circle.length; i++) {
            str += circle[i].name + ': Compliment: ' + circle[i].values[0] + ', Help: ' + circle[i].values[1] + ', Invite: ' + circle[i].values[2] + '\n';
        }
        return str.trim();
    }
    
}



//got this function from stack overflow, modified it a bit to return a new array instead of modifying the original array
function shuffle(array) {
    let currentIndex = array.length;
    let basic = [0,1,2,3,4,5,6,7,8];
    let ret = [];
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      ret.push(array[basic[randomIndex]]);
      basic[randomIndex] = basic[currentIndex];
    }

    return ret;
}

module.exports = { GamePiece, Game }; // Export the classes for testing purposes:w