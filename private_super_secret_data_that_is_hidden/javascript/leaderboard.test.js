const e = require('express');
const leaderboard = require('./leaderBoard');

createUsers = () => {
    const user1 = {username: 'Sam', score: 1};
    const user2 = {username: 'Bob', score: 2};
    const user3 = {username: 'Joe', score: 3};
    const user4 = {username: 'Bill', score: 4};
    const user5 = {username: 'Sally', score: 5};
    const user6 = {username: 'Mary', score: 6};

    return [user1, user2, user3, user4, user5, user6];
}

//Test Area
test('creates users and tests functions', () => {
    const lb = new leaderboard.Leaderboard(createUsers());

    expect(lb.list.length).toBe(6);
    expect(lb.list[0].username).toBe('Sam');
});