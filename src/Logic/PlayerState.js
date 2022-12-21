
var PlayerState = cc.Class.extend({
    rule: null,
    uid: null,
    energy: null,
    health: null,
    //_map:null,
    deck: null,
    intArray: null,

    ctor: function (rule, gameState) {
        this.rule = rule
        this.health = GAME_CONFIG.MAX_HP;
        this.energy = GAME_CONFIG.START_ENERGY;
        this.intArray =  Array.from(
            {length:MAP_CONFIG.MAP_WIDTH},
            ()=>Array.from(
                {length:MAP_CONFIG.MAP_HEIGHT}
            )
        );
        this.init();
        this._map = null

        this.timePerMonsterMax = GAME_CONFIG.TIME_PER_MONSTER_IN_WAVE;
        this.timePerMonster = GAME_CONFIG.TIME_PER_MONSTER_IN_WAVE;

        this.monstersToSpawn = []
        this.gameStateManager = gameState
        /*
        dem tong vi tri,hp, frame destroy cua monster moi 300 frame
         */
        this.countPos = new Vec2(0,0);
        this.countHP = 0;
        this.countDestroy = 0;

    },
    init: function () {

        winSize = cc.director.getWinSize();




        return true;
    },

    countAllMonster:function () {
        const monsters = this.getMap().getMonsters();
        monsters.forEach((monster, __, ___) => {
            const x = this.countPos.x + monster.position.x;
            const y = this.countPos.y + monster.position.y;
            this.countPos.set(x,y);
            this.countHP += monster.getHealth();
        });
    },

    addCountDestroyFrame:function (frame) {
        this.countDestroy += frame;
    },

    getCountPosition:function () {
        return this.countPos;
    },
    getCountHP:function () {
        return this.countHP;
    },

    getCountDestroyFrame:function () {
        return this.countDestroy;
    },

    updateHealth:function (amount) {
        this.health += amount
        if (this.health < 0) {
            this.health = 0
        }

    },
    updateEnergy: function (amount) {
        this.energy += amount
        if (this.energy < 0) {
            this.energy = 0
        }
        if(this.energy > GAME_CONFIG.MAX_ENERGY){
            this.energy = GAME_CONFIG.MAX_ENERGY
        }
    },
    readFrom: function (bf) {
        bf.getInt();
        bf.getInt();
        for (var y = 0; y < MAP_CONFIG.MAP_HEIGHT; y++) {
            for (var x = 0; x < MAP_CONFIG.MAP_WIDTH; x++) {
                var tmp =  bf.getInt();
                if(tmp == 0) this.intArray[x][y] = 0
                if(tmp == 1) this.intArray[x][y] = 0
                if(tmp == 2) this.intArray[x][y] = 0
                if(tmp == 3) this.intArray[x][y] = 1
                if(tmp == 4) this.intArray[x][y] = 0
                if(tmp == 5) this.intArray[x][y] = 2
                if(tmp == 6) this.intArray[x][y] = -1
                if(tmp == 7) this.intArray[x][y] = -2
                if(tmp == 8) this.intArray[x][y] = -3
            }
        }
        this._map = new MapView(this, this.intArray, this.rule)
    },


    update: function (dt) {
        if ((this.timePerMonster -= dt) <= 0) {
            if (this.monstersToSpawn.length !== 0) {
                //this._map.monsters.push(this.monstersToSpawn.shift())
                this._map.addMonster(this.monstersToSpawn.shift())
            }

            this.timePerMonster = this.timePerMonsterMax
        }

        this._map.update(dt)
    },

    getMap: function () {
        return this._map
    },

    addMonster: function (monster) {
        //this._map.monsters.push(monster)
        //return monster

        this.monstersToSpawn.push(monster)

    },

    isClearWave: function () {
        return this.monstersToSpawn.length === 0 && this._map.monsters.size() === 0 //.length === 0
    },

});
