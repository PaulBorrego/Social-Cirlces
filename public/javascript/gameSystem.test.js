const gameSystem = require('./gameSystem');

// Setup Area
createPieces = () => {
    const piece1 = new gameSystem.GamePiece('Sama',  [1,0,-2]);
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

// Setup Game
createGame = () => {
    const game = new gameSystem.Game();
    const pieces = createPieces();
    for (let i = 0; i < pieces.length; i++) {
        game.addGamePiece(pieces[i]);
    }
    return game;
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
    const game = new gameSystem.Game();
    const pieces = createPieces();
    for (let i = 0; i < pieces.length; i++) {
        game.addGamePiece(pieces[i]);
    }
});

test('tests getCircle', () => {

    const game = createGame();
    const pieces = createPieces();

    expect(game.getCircle(0).length).toBe(3);
    expect(game.getCircle(1).length).toBe(3);
    expect(game.getCircle(2).length).toBe(3);
    
    expect(game.getCircle(0)).toStrictEqual([pieces[0], pieces[1], pieces[2]]);
    expect(game.getCircle(1)).toStrictEqual([pieces[3], pieces[4], pieces[5]]);
    expect(game.getCircle(2)).toStrictEqual([pieces[6], pieces[7], pieces[8]]);


});

test('tests reorderPieces', () => {
    const game = createGame();
    const pieces = createPieces();
    let firstOrder = game.gamePieces;

    expect(firstOrder[0]).toStrictEqual(pieces[0]);
    expect(firstOrder[1]).toStrictEqual(pieces[1]);
    expect(firstOrder[2]).toStrictEqual(pieces[2]);
    expect(firstOrder[3]).toStrictEqual(pieces[3]);
    expect(firstOrder[4]).toStrictEqual(pieces[4]);
    expect(firstOrder[5]).toStrictEqual(pieces[5]);
    expect(firstOrder[6]).toStrictEqual(pieces[6]);
    expect(firstOrder[7]).toStrictEqual(pieces[7]);
    expect(firstOrder[8]).toStrictEqual(pieces[8]);

    const newOrder = [2,1,0,5,4,3,8,7,6];
    game.reorderPieces(newOrder);

    let secondOrder = game.gamePieces;
    
    expect(secondOrder[0]).toStrictEqual(pieces[2]);
    expect(secondOrder[1]).toStrictEqual(pieces[1]);
    expect(secondOrder[2]).toStrictEqual(pieces[0]);
    expect(secondOrder[3]).toStrictEqual(pieces[5]);
    expect(secondOrder[4]).toStrictEqual(pieces[4]);
    expect(secondOrder[5]).toStrictEqual(pieces[3]);
    expect(secondOrder[6]).toStrictEqual(pieces[8]);
    expect(secondOrder[7]).toStrictEqual(pieces[7]);
    expect(secondOrder[8]).toStrictEqual(pieces[6]);
});

test('tests doAction', () => {
    const game = createGame();
    // I'd write out the math but I don't want to do that right now
    // Just trust me bro

    game.doAction(0, 0);
    expect(game.happiness).toBe(3);

    game.doAction(0, 1);
    expect(game.happiness).toBe(5);

    game.doAction(0, 2);
    expect(game.happiness).toBe(5);

    game.doAction(1, 0);
    expect(game.happiness).toBe(11);

    game.doAction(1, 1);
    expect(game.happiness).toBe(18);

    game.doAction(1, 2);
    expect(game.happiness).toBe(26);

    game.doAction(2, 0);
    expect(game.happiness).toBe(32);

    game.doAction(2, 1);
    expect(game.happiness).toBe(37);

    game.doAction(2, 2);
    expect(game.happiness).toBe(41);
});

test('tests singleCircleToString', () => {
    const game = createGame();

    expect(game.singleCircleToString(0)).toBe('Sama Bob Joe');
    expect(game.singleCircleToString(1)).toBe('Bill Sally Mary');
    expect(game.singleCircleToString(2)).toBe('Sue Tom Jim');
});