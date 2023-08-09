var BoomBox = Box.extend({
    ctor:function (dx, dy) {
        this._super(dx, dy);
        this.curHp = 1;
        this.radius = GAME_CONFIG.CELLSIZE*2;
        this.dame = 5;
    },

    init:function () {

    },

    takeDame:function (many) {
        this.destroy();


        let pos = convertIndexToPosLogic(this.dx, this.dy);
        var posUI = cc.pMult(pos, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        let a = new Explosion(posUI, this.radius);
        BackgroundLayerInstance.addChild(a);

        let obj = BackgroundLayerInstance.objectView.getAllObjectInCircle(pos,this.radius)
        for (let i = 0; i < obj.length; i++) {
            obj[i].takeDame(this.dame);
        }
    },



});
