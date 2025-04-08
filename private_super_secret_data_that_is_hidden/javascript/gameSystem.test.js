const gameSystem = require('./gameSystem');

// Setup Area
createPieces = () => {
    const piece1 = new gameSystem.GamePiece('Sam',  [1,0,-2]);
    const piece2 = new gameSystem.GamePiece('Bob',   [0,1,2]);
    const piece3 = new gameSystem.GamePiece('Joe',   [2,1,0]);
    const piece4 = new gameSystem.GamePiece('Bill',  [1,2,3]);
    const piece5 = new gameSystem.GamePiece('Sally', [3,2,1]);
    const piece6 = new gameSystem.GamePiece('Mary',  [2,3,4]);
    const piece7 = new gameSystem.GamePiece('Sue',   [4,3,2]);
    const piece8 = new gameSystem.GamePiece('Tom',   [2,1,0]);
    const piece9 = new gameSystem.GamePiece ('Jim',  [0,1,2]);
    return [piece1, piece2, piece3, piece4, piece5, piece6, piece7, piece8, piece9];
}

//Test Area
test('creates a game piece and tests functions', () => {
    //covers all functions for GamePiece
    const gamePiece = new gameSystem.GamePiece('Sam', [1,0,-2]);

    expect(gamePiece.getActionResult(0)).toBe(1);
    expect(gamePiece.getActionResult(1)).toBe(0);
    expect(gamePiece.getActionResult(2)).toBe(-2);

});

test('tests create game', () => {
    //covers all functions for Game
    const pieces = createPieces();
    const game = new gameSystem.Game(pieces);
    expect(game.gamePieces.length).toBe(9);
});

test('tests getCircle', () => {
    const pieces = createPieces();
    const game = new gameSystem.Game(pieces);
    let gameSet = game.getDailies(0);

    expect(game.getCircle(0,gameSet).length).toBe(3);
    expect(game.getCircle(1,gameSet).length).toBe(3);
    expect(game.getCircle(2,gameSet).length).toBe(3);

    expect(game.getCircle(0,gameSet)).toStrictEqual([gameSet[0], gameSet[1], gameSet[2]]);
    expect(game.getCircle(1,gameSet)).toStrictEqual([gameSet[3], gameSet[4], gameSet[5]]);
    expect(game.getCircle(2,gameSet)).toStrictEqual([gameSet[6], gameSet[7], gameSet[8]]);
});

test('tests reshuffle', () => {
    const pieces = createPieces();
    const game = new gameSystem.Game(pieces);

    let firstOrder = game.getDailies(0);
    game.resetDailies();
    let secondOrder = game.getDailies(0);

    let mixed = 0;
    for (let i = 0; i < firstOrder.length; i++) {
        if (!(firstOrder[i] === secondOrder[i])) {
            // If the pieces are different then add one to the mixed count
            mixed++;
        }
    }
    // This isn't perfect cause its checking randomness but it should be good enough
    // as long as 5 pieces aren't the same its probably suffled
    expect(mixed).toBeGreaterThan(5);
});

test('tests doAction', () => {
    const pieces = createPieces();
    const game = new gameSystem.Game(pieces);

    game.setToBasic(); // Set the game to the basic order for testing

    expect(game.doAction(0, 0, 0)).toBe(3); 
    expect(game.doAction(0, 1, 0)).toBe(2);
    expect(game.doAction(0, 2, 0)).toBe(0);
    expect(game.doAction(1, 0, 0)).toBe(6);
    expect(game.doAction(1, 1, 0)).toBe(7);
    expect(game.doAction(1, 2, 0)).toBe(8);
    expect(game.doAction(2, 0, 0)).toBe(6);
    expect(game.doAction(2, 1, 0)).toBe(5);
    expect(game.doAction(2, 2, 0)).toBe(4);
});

test('tests singleCircleToString', () => {
    const pieces = createPieces();
    const game = new gameSystem.Game(pieces);

    game.setToBasic(); // Set the game to the basic order for testing
    
    expect(game.singleCircleToString(0)).toBe('Sam: Compliment: 1, Help: 0, Invite: -2\nBob: Compliment: 0, Help: 1, Invite: 2\nJoe: Compliment: 2, Help: 1, Invite: 0');
    expect(game.singleCircleToString(1)).toBe('Bill: Compliment: 1, Help: 2, Invite: 3\nSally: Compliment: 3, Help: 2, Invite: 1\nMary: Compliment: 2, Help: 3, Invite: 4');
    expect(game.singleCircleToString(2)).toBe('Sue: Compliment: 4, Help: 3, Invite: 2\nTom: Compliment: 2, Help: 1, Invite: 0\nJim: Compliment: 0, Help: 1, Invite: 2');
});
