const MonsterWaveHandler = {
    numMonstersMultiplier: new Array(1024),
    numMonsterHpMultiplier: new Array(1024),

    initialize: function () {
        let i = 0;
        for (; i < 5; i++) {
            this.numMonstersMultiplier[i]    = 1;
            this.numMonsterHpMultiplier[i]   = 1;
        }

        for (; i < 10; i++) {
            this.numMonstersMultiplier[i]    = 2;
            this.numMonsterHpMultiplier[i]   = 5;
        }

        for (; i < 15; i++) {
            this.numMonstersMultiplier[i]    = 3;
            this.numMonsterHpMultiplier[i]   = 10;
        }

        for (; i < 20; i++) {
            this.numMonstersMultiplier[i]    = 4;
        }

        for (; i < 25; i++) {
            this.numMonstersMultiplier[i]    = 5;
            this.numMonsterHpMultiplier[i]   = 20;
        }

        for (; i < 30; i++) {
            this.numMonstersMultiplier[i]    = 6;
        }

        for (; i < this.numMonstersMultiplier.length; i++) {
            this.numMonstersMultiplier[i]    = 7;
            this.numMonsterHpMultiplier[i]   = 30;
        }
    },

    getTotalTowersLv: function (map) {
        let sum = 0
        const towers = map.towers;
        towers.forEach((v, i, list) => {
            sum += v.level;
        });
        return sum
    },

    getOppositePlayerOf: function (playerState) {
        const gsm = playerState.gameStateManager;
        return gsm.playerA === playerState ? gsm.playerB : gsm.playerA;
    },

    getNumMonstersMultiplier: function (totalTowersLv) {
        return this.numMonstersMultiplier[totalTowersLv];
    },

    getMonsterHpMultiplier: function (totalTowersLv) {
        return this.numMonsterHpMultiplier[totalTowersLv];
    },
}

MonsterWaveHandler.initialize()