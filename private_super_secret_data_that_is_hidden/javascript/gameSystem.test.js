const gameSystem = require('./gameSystem');

// Setup Area
createPieces = () => {
    const piece1 = new gameSystem.GamePiece('Sama',  [1,0,-2], 0);
    const piece2 = new gameSystem.GamePiece('Bob',   [0,1,2], 1);
    const piece3 = new gameSystem.GamePiece('Joe',   [2,1,0], 2);
    const piece4 = new gameSystem.GamePiece('Bill',  [1,2,3], 3);
    const piece5 = new gameSystem.GamePiece('Sally', [3,2,1], 4);
    const piece6 = new gameSystem.GamePiece('Mary',  [2,3,4], 5);
    const piece7 = new gameSystem.GamePiece('Sue',   [4,3,2], 6);
    const piece8 = new gameSystem.GamePiece('Tom',   [2,1,0], 7);
    const piece9 = new gameSystem.GamePiece ('Jim',  [0,1,2], 8);
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

    expect(game.getCircle(0).length).toBe(3);
    expect(game.getCircle(1).length).toBe(3);
    expect(game.getCircle(2).length).toBe(3);
    
    expect(game.getCircle(0)).toStrictEqual([pieces[0], pieces[1], pieces[2]]);
    expect(game.getCircle(1)).toStrictEqual([pieces[3], pieces[4], pieces[5]]);
    expect(game.getCircle(2)).toStrictEqual([pieces[6], pieces[7], pieces[8]]);


});

test('tests reorderPieces', () => {
    const pieces = createPieces();
    const game = new gameSystem.Game(pieces);
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

    console.log(game.reorderPieces());

    let secondOrder = game.gamePieces;
    let mixed = 0;
    for (let i = 0; i < firstOrder.length; i++) {
        expect(secondOrder[i].position).toBe(i);
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
    // I'd write out the math but I don't want to do that right now
    // Just trust me bro

    expect(game.doAction(0, 0)).toBe(3);
    expect(game.doAction(0, 1)).toBe(2);
    expect(game.doAction(0, 2)).toBe(0);
    expect(game.doAction(1, 0)).toBe(6);
    expect(game.doAction(1, 1)).toBe(7);
    expect(game.doAction(1, 2)).toBe(8);
    expect(game.doAction(2, 0)).toBe(6);
    expect(game.doAction(2, 1)).toBe(5);
    expect(game.doAction(2, 2)).toBe(4);
});

test('tests singleCircleToString', () => {
    const pieces = createPieces();
    const game = new gameSystem.Game(pieces);

    expect(game.singleCircleToString(0)).toBe('Sama: Compliment: 1, Help: 0, Invite: -2\nBob: Compliment: 0, Help: 1, Invite: 2\nJoe: Compliment: 2, Help: 1, Invite: 0');
    expect(game.singleCircleToString(1)).toBe('Bill: Compliment: 1, Help: 2, Invite: 3\nSally: Compliment: 3, Help: 2, Invite: 1\nMary: Compliment: 2, Help: 3, Invite: 4');
    expect(game.singleCircleToString(2)).toBe('Sue: Compliment: 4, Help: 3, Invite: 2\nTom: Compliment: 2, Help: 1, Invite: 0\nJim: Compliment: 0, Help: 1, Invite: 2');
});