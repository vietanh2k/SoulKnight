
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


    update:function (dt){
        this._map.update(dt)
    },

    getMap: function () {
        return this._map
    }

});
