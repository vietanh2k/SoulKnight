var DoubleGun = Weapon.extend({

    ctor: function(posLogic, map) {
        this._super(res.gun2, posLogic, map);
        this.rateSpeed = 30;
        this.rang = 800;    //range
        this.dame = 2;
        this.accuracy = 0.95;
        this.critRate = 0.5;
        this.critDame = 1.5;
        this.speed = 800;
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
        var pos1 = cc.pAdd(posLogic, cc.pMult(dir2, 10));
        var pos2 = cc.pAdd(posLogic, cc.pMult(dir2, -10));

        posLogic = cc.pAdd(posLogic, cc.pMult(dir, this.width/2))
        var bullet = new  NorBullet(rule, pos1, this._map, dirBullet,dame, rang, this.speed)
        var posLogic2 = new cc.p(this.posLogic.x,this.posLogic.y+5);
        var bullet2 = new  NorBullet(rule, pos2, this._map, dirBullet, dame, rang, this.speed)
        BackgroundLayerInstance.objectView.addBullet(bullet)
        BackgroundLayerInstance.objectView.addBullet(bullet2)
    },

    getClone: function (pos) {
        let wp = new DoubleGun(pos, this._map);
        return wp;
    },

    getId: function() {
        return cf.WP_TYPE.DOUBLE_GUN;
    }


});