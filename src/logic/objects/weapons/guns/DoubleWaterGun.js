var DoubleWaterGun = Weapon.extend({

    ctor: function(posLogic, map) {
        this._super(res.doubleWater, posLogic, map);
        this.rateSpeed = 5;
        this.rang = 800;    //range
        this.dame = 1;
        this.accuracy = 0.98;
        this.critRate = 0;
        this.critDame = 1.5;
        this.speed = 1000;
        this.energy = 0;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang, this.speed)

    },

    activateWeapon: function (rule) {

        //tinh goc lech accuracy
        let dirBullet = this.getDirBulletByAccu();

        //tinh dame crit
        let dame = this.getDameByCrit();

        this.createBullet(rule, dame, dirBullet, this.rang);

    },

    createBullet: function (rule, dame, dirBullet, rang) {
        //tinh pos dau sung
        var posLogic = new cc.p(this.posLogic.x,this.posLogic.y);
        var dir = new cc.p(this.curDir.x, this.curDir.y);
        dir = cc.pNormalize(dir)
        posLogic = cc.pAdd(posLogic, cc.pMult(dir, this.width/2))
        var dir2 = new cc.p(-dir.y, dir.x);     // vuong goc
        var pos1 = cc.pAdd(posLogic, cc.pMult(dir2, 10));
        var pos2 = cc.pAdd(posLogic, cc.pMult(dir2, -10));

        posLogic = cc.pAdd(posLogic, cc.pMult(dir, this.width/2))
        var bullet = new  WaterBullet(rule, pos1, this._map, dirBullet,dame, rang, this.speed)
        var posLogic2 = new cc.p(this.posLogic.x,this.posLogic.y+5);
        var bullet2 = new  WaterBullet(rule, pos2, this._map, dirBullet, dame, rang, this.speed)
        BackgroundLayerInstance.objectView.addBullet(bullet)
        BackgroundLayerInstance.objectView.addBullet(bullet2)
    },

    getClone: function (pos) {
        let wp = new DoubleWaterGun(pos, this._map);
        return wp;
    },

    getId: function() {
        return cf.WP_TYPE.DOUBLE_WATER_GUN;
    }


});