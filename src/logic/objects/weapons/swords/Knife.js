var Knife = Spear.extend({

    ctor: function( posLogic, map) {
        this._super(res.knife, posLogic, map);
        this.rateSpeed = 1;
        this.rang = 60;    //range
        this.dame = 2;
        this.accuracy = 1;
        this.critRate = 0.5;
        this.critDame = 1.5;
        this.isTakeDame = false;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang)

    },

    animaTakeDame: function ( dirBullet, rang) {
        //tinh pos dau sung
        rang = 12;
        let disMove2 = new cc.p(this.x, this.y);
        let disMove = cc.pMult(dirBullet, rang/CELL_SIZE_UI*GAME_CONFIG.CELLSIZE);

        // disMove = new cc.p(-disMove.x, disMove.y)

        if(this.getParent().dirMain.x < 0){
            disMove.x = -disMove.x;
            disMove.y = disMove.y;
        }
        let disMove3 =  cc.pAdd(disMove2, disMove);
        var seq = cc.sequence( cc.MoveTo(0.12, disMove3), cc.MoveTo(0.07, disMove2))
        this.runAction(seq)
    },


});