//GamePiece Notes
// Values will be an array of ints 
// 0: Compliments
// 1: Offer Help
// 2: Invite to Event

class GamePiece {
    constructor (name, values, position) {
        this.name = name;
        this.values = values;
        this.position = position
    }

    // Get result of action
    getActionResult(action) {
        return this.values[action];
    }

}

class Game {
    constructor (gamePieces) {
        this.basic = [0,1,2,3,4,5,6,7,8];

        this.gamePieces = [null, null, null, null, null, null, null, null, null];
        gamePieces.forEach(g => {
            this.gamePieces[g.position] = g;
        });
    }
    
    // Input: array of ints which will move the game pieces to new positions
    reorderPieces() {
        let newGamePieces = [];
        shuffle(this.basic);

        for (let i = 0; i < this.gamePieces.length; i++) {
            newGamePieces[i] = this.gamePieces[this.basic[i]];
        }
        this.gamePieces = newGamePieces;
        
        return this.updateSQL();
    }

    // Get the circle from circle number
    getCircle(circleNumber) {
        return this.gamePieces.slice(circleNumber * 3, circleNumber * 3 + 3);
    }

    // Get the happiness as a result of the action
    doAction(circleNumber,action) {
        let circle = this.getCircle(circleNumber);
        console.log('circle 0: ' + circle[0]);
        let happiness = 0;
        for (let i = 0; i < circle.length; i++) {
            happiness += circle[i].values[action];
        }
        return happiness;
    }

    //mostly just for testing purposes
    singleCircleToString(circleNumber) {
        let circle = this.getCircle(circleNumber);
        let str = '';
        for (let i = 0; i < circle.length; i++) {
            str += circle[i].name + ': Compliment: ' + circle[i].values[0] + ', Help: ' + circle[i].values[1] + ', Invite: ' + circle[i].values[2] + '\n';
        }
        return str.trim();
    }

    //this command will change the
    updateSQL() {
        const pre = 'UPDATE characters SET position = '; 
        const post = ' WHERE name = \"';  //dont forget semicolon
        const semicolon = '\";';
        let ret = '';
        for (let i = 0; i < this.gamePieces.length; i++) {
            ret = ret + pre + i + post + this.gamePieces[i].name + semicolon;
            this.gamePieces[i].position = i;
        }
        return ret;
    }
}

//got this function from stack overflow
function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

module.exports = { GamePiece, Game }; // Export the classes for testing purposes:w