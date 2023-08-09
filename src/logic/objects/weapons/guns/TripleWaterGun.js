var TripleWaterGun = Weapon.extend({

    ctor: function(posLogic, map) {
        this._super(res.tripleWater, posLogic, map);
        this.rateSpeed = 5;
        this.rang = 800;    //range
        this.dame = 1;
        this.accuracy = 0.98;
        this.critRate = 0;
        this.critDame = 1.5;
        this.speed = 1000;
        this.energy = 1;
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
        var pos1 = cc.pAdd(posLogic, cc.pMult(dir2, 11));
        var pos2 = cc.pAdd(posLogic, cc.pMult(dir2, 0));
        var pos3 = cc.pAdd(posLogic, cc.pMult(dir2, -11));

        var bullet = new  WaterBullet(rule, pos1, this._map, dirBullet,dame, rang, this.speed)
        var bullet2 = new  WaterBullet(rule, pos2, this._map, dirBullet, dame, rang, this.speed)
        var bullet3 = new  WaterBullet(rule, pos3, this._map, dirBullet, dame, rang, this.speed)
        BackgroundLayerInstance.objectView.addBullet(bullet)
        BackgroundLayerInstance.objectView.addBullet(bullet2)
        BackgroundLayerInstance.objectView.addBullet(bullet3)
    },

    getClone: function (pos) {
        let wp = new TripleWaterGun(pos, this._map);
        return wp;
    },

    getId: function() {
        return cf.WP_TYPE.TRIPLE_WATER_GUN;
    }


});