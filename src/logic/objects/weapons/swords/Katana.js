var Katana = Spear.extend({

    ctor: function( posLogic, map) {
        this._super(res.katana, posLogic, map);
        this.rateSpeed = 1;
        this.rang = 180;    //range
        this.dame = 8;
        this.accuracy = 0.9;
        this.critRate = 0.75;
        this.critDame = 1.5;
        this.isTakeDame = false;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang);
        this.visible = false;
        this.resFakeWP = res.katana2;

    },

    initSwitch: function () {
        this.visible = false;
    },

    activateWeapon: function (rule) {

        //tinh goc lech accuracy
        let dirBullet = this.getDirBulletByAccu();

        //tinh dame crit
        let dame = this.getDameByCrit();
        this.animaTakeDame(dirBullet, this.rang)
        this.takeDame(dame, dirBullet, this.rang, 1);

    },

    animaTakeDame: function ( dirBullet, rang) {
        this.visible = true;
        this.isTakeDame = true;
        this.getParent().fakeWP.visible = false;
        //tinh pos dau sung
        rang = 25;
        let disMove2 = new cc.p(this.x, this.y);
        let disMove = cc.pMult(dirBullet, rang/CELL_SIZE_UI*GAME_CONFIG.CELLSIZE);

        // disMove = new cc.p(-disMove.x, disMove.y)

        if(this.getParent().dirMain.x < 0){
            disMove.x = -disMove.x;
            disMove.y = disMove.y;
        }
        this.getParent().isCanDo = false;
        let disMove3 =  cc.pAdd(disMove2, disMove);
        var seq = cc.sequence( cc.MoveTo(0.08, disMove3), cc.DelayTime(0.05), cc.MoveTo(0.07, disMove2), cc.callFunc(()=>{
            this.isTakeDame = false;
            this.visible = false;
            this.getParent().fakeWP.visible = true;
            this.getParent().isCanDo = true;
        }))
        this.runAction(seq)
    },

    updateDir: function (direction) {
        if(this.isTakeDame) return ;
        if(direction.x == 0 && direction.y == 0) return;

        var angle = cc.pToAngle(direction);
        this.curDir = direction;

        if(direction.x > 0) {
            this.setRotation(-angle/Math.PI*180);
        }else if(direction.x < 0) {
            this.setRotation(-180+angle/Math.PI*180);
        }else if(direction.x === 0 && direction.y > 0) {
            this.setRotation(-180+90);
        }else if(direction.x === 0 && direction.y < 0) {
            this.setRotation(-180-90);
        }

        return true;
    },

    getClone: function (pos) {
        let wp = new Katana(pos, this._map);
        return wp;
    },

    getId: function() {
        return cf.WP_TYPE.KATANA;
    }

});