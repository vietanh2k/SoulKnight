var PosionBox = Box.extend({
    ctor:function (dx, dy) {
        this._super(dx, dy);
        this.curHp = 1;
        this.radius = GAME_CONFIG.CELLSIZE*2;
    },

    init:function () {

    },

    takeDame:function () {
        this.destroy();


        let pos = convertIndexToPosLogic(this.dx, this.dy);
        var posUI = cc.pMult(pos, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        let exp = new Explosion(posUI, this.radius);
        exp.setColor(cc.color(29, 145, 72));
        BackgroundLayerInstance.addChild(exp);

        let obj = BackgroundLayerInstance.objectView.getAllPeopleInCircle(pos,this.radius)
        for (let i = 0; i < obj.length; i++) {
            obj[i].___posionEffect = new PosionEffect(2.5, obj[i]);
            BackgroundLayerInstance.objectView.addEffect(obj[i].___posionEffect)
        }
    },



});
