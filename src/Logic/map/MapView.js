
var MapView = cc.Class.extend({
    trees: null,
    monsters: null,
    spells: null,
    bullets:null,
    towers:null,
    _mapController:null,
    _playerState: null,
    rule:null,


    ctor:function (playerState, intArray, rule) {
        this._playerState = playerState
        this.rule = rule
        this._mapController = new MapController(intArray,this.rule)
        this.monsters = []
        this.init();

    },
    init:function () {

        winSize = cc.director.getWinSize();

        // var monster = new Monster(1, this._playerState)
        // this.monsters.push(monster)




        return true;
    },
    updateMonster:function (dt) {
        var leng = this.monsters.length
        for (i in this.monsters){
            this.monsters[i].update(dt,this._mapController.listPath)
            if(this.monsters[leng-i-1].isDestroy){
                this.monsters.splice(leng-i-1, 1)
            }
        }
    },
    update:function (dt){
        this.updateMonster(dt)
    },

    addMonster:function (){
        var monster = new Monster(1, this._playerState)
        this.monsters.push(monster)
        return monster
    }


});
