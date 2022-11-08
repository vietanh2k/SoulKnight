
var PlayerState = cc.Class.extend({
    uid: null,
    energy: null,
    health: null,
    _map:null,
    deck:null,


    ctor:function () {
        this.health = 10
        this.energy = 20

        this._map = new MapView(this)
        this.init();


    },
    init:function () {

        winSize = cc.director.getWinSize();







        return true;
    },
    updatehealth:function (amount) {
        this.health += amount

    },
    convertCordinateToPos:function (corX, corY) {
        var x = winSize.width/2 - WIDTHSIZE/2 + (corX+1)*CELLWIDTH
        var y = winSize.height/2 - HEIGHTSIZE/2 + (MAP_HEIGHT- corY+3.5)*CELLWIDTH
        var p = new cc.p(x,y)
        return p

    },
    convertPosToCor:function (pos) {
        var x = Math.floor((pos.x-winSize.width/2+WIDTHSIZE/2)/CELLWIDTH-0.5)
        var y = Math.floor(MAP_HEIGHT+3.5 - (pos.y - winSize.height/2 + HEIGHTSIZE/2 )/CELLWIDTH+0.5)
        var p = new cc.p(x,y)
        return p

    },

});
