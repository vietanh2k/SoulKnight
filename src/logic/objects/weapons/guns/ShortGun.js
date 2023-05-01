var ShortGun = Weapon.extend({

    ctor: function(posLogic, map) {
        this._super(res.gun, posLogic, map);
        this.rateSpeed = 2;
        this.rang = 500;    //range
        this.dame = 2;
        this.accuracy = 1;
        this.critRate = 0.5;
        this.critDame = 1.5;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang)

    },

    activateWeapon: function () {

        //tinh goc lech accuracy
        let dirBullet = this.getDirBulletByAccu();

        //tinh dame crit
        let dame = this.getDameByCrit();

        this.createBullet(dame, dirBullet, this.rang);

    },

    createBullet: function (dame, dirBullet, rang) {
        //tinh pos dau sung
        var posLogic = new cc.p(this.posLogic.x,this.posLogic.y);
        var dir = new cc.p(this.curDir.x, this.curDir.y);
        dir = cc.pNormalize(dir)
        posLogic = cc.pAdd(posLogic, cc.pMult(dir, this.width/2))

        var bullet = new  Bullet(posLogic, this._map, dirBullet,dame, rang)
        BackgroundLayerInstance.objectView.addBullet(bullet)
    },


});