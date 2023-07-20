var IceBox = Box.extend({
    ctor:function (dx, dy) {
        this._super(dx, dy);
        this.curHp = 1;
        this.radius = GAME_CONFIG.CELLSIZE*1;
    },

    init:function () {

    },

    takeDame:function (many) {
        this.destroy();


        let pos = convertIndexToPosLogic(this.dx, this.dy);
        var posUI = cc.pMult(pos, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        let explo = new Explosion(posUI, this.radius);
        explo.setColor(cc.color(128, 128, 255))
        BackgroundLayerInstance.addChild(explo);
        // let enemys = BackgroundLayerInstance.objectView.queryEnemiesCircle(pos,this.radius)
        // for (let i = 0; i < enemys.length; i++) {
        //     enemys[i].takeDame(this.dame);
        // }
        let people = BackgroundLayerInstance.objectView.getAllPeopleInCircle(pos,this.radius)
        for (let i = 0; i < people.length; i++) {
            people[i].___freezeEffect = new FreezeEffect(2, people[i]);
            BackgroundLayerInstance.objectView.addEffect(people[i].___freezeEffect)
        }

        for(var i=0; i<DX.length; i++){
            let tmp = new cc.p(pos.x+DX[i]*GAME_CONFIG.CELLSIZE/3, pos.y+DY[i]*GAME_CONFIG.CELLSIZE/3);
            let dirBullet = new cc.p(DX[i], DY[i]);
            var bullet = new  IceBullet(2, tmp, BackgroundLayerInstance.mapView, dirBullet,1, 900, 400, 2);
            BackgroundLayerInstance.objectView.addBullet(bullet)
        }

    },



});
