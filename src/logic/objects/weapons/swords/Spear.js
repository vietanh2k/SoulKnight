var Spear = Sword.extend({

    ctor: function( posLogic, map) {
        this._super(res.spear, posLogic, map);
        this.rateSpeed = 1;
        this.rang = 100;    //range
        this.dame = 2;
        this.accuracy = 0.9;
        this.critRate = 0.5;
        this.critDame = 1.5;
        this.isTakeDame = false;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang)

    },


});