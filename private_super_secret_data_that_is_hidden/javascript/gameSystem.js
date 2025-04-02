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
    constructor (gamePieces) {
        this.gamePieces = [];
        gamePieces.forEach(piece => {
            this.gamePieces.push(piece);   
        });
    }
    
    // Input: array of ints which will move the game pieces to new positions
    reorderPieces(newOrder) {
        let newGamePieces = [];
        for (let i = 0; i < this.gamePieces.length; i++) {
            newGamePieces[i] = this.gamePieces[newOrder[i]];
        }
        this.gamePieces = newGamePieces;        
    }

    // Get the circle from circle number
    getCircle(circleNumber) {
        return this.gamePieces.slice(circleNumber * 3, circleNumber * 3 + 3);
    }

    // Get the happiness as a result of the action
    doAction(circleNumber,action) {
        let circle = this.getCircle(circleNumber);
        console.log(circle);
        let happiness = 0;
        for (let i = 0; i < circle.length; i++) {
            happiness += circle[i].getActionResult(action);
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

}

module.exports = { GamePiece, Game }; // Export the classes for testing purposes:w