var Gun = Weapon.extend({

    ctor: function(posLogic, map) {
        this._super(res.gun, posLogic, map);
        this.rateSpeed = 10;
        this.rang = 500;    //range
        this.dame = 2;
        this.accuracy = 0.9;
        this.critRate = 0.5;
        this.critDame = 1.5;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang)

    },

    activateWeapon: function (rule) {

        //tinh goc lech accuracy
        let dirBullet = this.getDirBulletByAccu();

        //tinh dame crit
        let dame = this.getDameByCrit();

        this.createBullet(dame, dirBullet, this.rang);

    },

    createBullet: function (dame, dirBullet, rang) {
        //tinh pos dau sung
        var posLogic = new cc.p(this.posLogic.x,this.posLogic.y);
        posLogic = cc.pAdd(posLogic, cc.pMult(dir, this.width/2))
        var dir = new cc.p(this.curDir.x, this.curDir.y);
        dir = cc.pNormalize(dir)
        var dir2 = new cc.p(-dir.y, dir.x);     // vuong goc
        var pos1 = cc.pAdd(posLogic, cc.pMult(dir2, 10));
        var pos2 = cc.pAdd(posLogic, cc.pMult(dir2, -10));


        var bullet = new  NorBullet(pos1, this._map, dirBullet, dame, rang)
        var posLogic2 = new cc.p(this.posLogic.x,this.posLogic.y+5);
        var bullet2 = new  NorBullet(pos2, this._map, dirBullet,dame, rang)
        BackgroundLayerInstance.objectView.addBullet(bullet)
        BackgroundLayerInstance.objectView.addBullet(bullet2)
    },


});