
var PlayerState = cc.Class.extend({
    rule:null,
    uid: null,
    energy: null,
    health: null,
    //_map:null,
    deck:null,
    intArray:null,

    ctor:function (rule) {
        this.rule = rule
        this.health = 5
        this.energy = 20
        this.intArray =  Array.from(
            {length:MAP_WIDTH},
            ()=>Array.from(
                {length:MAP_HEIGHT}
            )
        );
        this.init();
        this._map = null

        this.timePerMonsterMax = GAME_CONFIG.TIME_PER_MONSTER_IN_WAVE;
        this.timePerMonster = GAME_CONFIG.TIME_PER_MONSTER_IN_WAVE;

        this.monstersToSpawn = []

    },
    init:function () {

        winSize = cc.director.getWinSize();







        return true;
    },
    updateHealth:function (amount) {
        this.health += amount

    },
    updateEnergy:function (amount) {
        this.energy += amount
        if(this.energy <0){
            this.energy = 0
        }
        if(this.energy > MAX_ENERGY){
            this.energy = MAX_ENERGY
        }
    },
    readFrom:function (bf) {
        bf.getInt();
        bf.getInt();
        for (var y = 0; y < MAP_HEIGHT; y++) {
            for (var x = 0; x < MAP_WIDTH; x++) {
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

                cc.log(y+'-'+x+'====='+tmp)
            }
        }
        this._map = new MapView(this, this.intArray, this.rule)
    },


    update: function (dt){
        if ((this.timePerMonster -= dt) <= 0) {
            if (this.monstersToSpawn.length !== 0) {
                this._map.monsters.push(this.monstersToSpawn.shift())
            }

            this.timePerMonster = this.timePerMonsterMax
        }

        this._map.update(dt)
    },

    getMap: function () {
        return this._map
    },

    addMonster: function (monster){
        //this._map.monsters.push(monster)
        //return monster

        this.monstersToSpawn.push(monster)

    },

    isClearWave: function () {
        return this.monstersToSpawn.length === 0 && this._map.monsters.length === 0
    },

});
