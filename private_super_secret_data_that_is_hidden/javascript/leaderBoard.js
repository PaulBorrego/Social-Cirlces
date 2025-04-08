class Leaderboard {

    constructor(list) {
        list.sort((a, b) => b.score - a.score);
        this.list = list;
        this.leaderboard_change = [];
        for (let i = 0; i < list.length; i++) {
            this.leaderboard_change.push('-');
        }
    }

    getLeaderboard(n) {
        return [this.list.slice(0,n),this.leaderboard_change]
    }

    newList(newList, n) {
        newList.sort((a, b) => b.score - a.score);
        let vals = newList.slice(0,n);
        this.leaderboard_change = [];
        for (let i = 0; i < vals.length; i++) {
            let ind = this.list.findIndex(x => x.username === vals[i].username);
            if (ind == -1) {
                this.leaderboard_change.push('First Appearance!');
            } else {
                let diff = ind - i;
                if (diff > 0) {
                    this.leaderboard_change.push('+' + diff);
                } else if (diff < 0) {
                    this.leaderboard_change.push(diff);
                } else {
                    this.leaderboard_change.push('-');
                }
            }
        }
        this.list = newList;
    }
}

module.exports = { Leaderboard }; // Export the classes for testing purposes:w