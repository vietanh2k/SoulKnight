var Sword = Weapon.extend({

    ctor: function(_res, posLogic, map) {
        this._super(_res, posLogic, map);
        this.rateSpeed = 1;
        this.rang = 100;    //range
        this.dame = 2;
        this.accuracy = 0.9;
        this.critRate = 0.5;
        this.critDame = 1.5;
        this.isTakeDame = false;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang)

    },

    activateWeapon: function (rule) {

        //tinh goc lech accuracy
        let dirBullet = this.getDirBulletByAccu();

        //tinh dame crit
        let dame = this.getDameByCrit();
        this.animaTakeDame(dirBullet, this.rang)
        this.takeDame(dame, dirBullet, this.rang, 1);

    },

    takeDame: function (dame, dirBullet, rang, rule) {

        //tinh pos dau sung
        let player = BackgroundLayerInstance.player;
        let p2 = cc.pAdd(this.posLogic, cc.pMult(dirBullet, rang));
        let isColChar = isPointInsideHCN(p2, player.posLogic, 50, 80);
        if(isColChar == null) {
            isColChar = getColisionDoanThangVaHCN(this.posLogic, p2, player.posLogic, 50, 80);
        }
        if(isColChar != null){
            this.posLogic = new cc.p(player.posLogic.x, player.posLogic.y);
            player.takeDame(this.dame);
            return true;
        }

    },

    animaTakeDame: function ( dirBullet, rang) {
        //tinh pos dau sung
        rang = 25;
        let disMove2 = new cc.p(this.x, this.y);
        let disMove = cc.pMult(dirBullet, rang/CELL_SIZE_UI*GAME_CONFIG.CELLSIZE);

        // disMove = new cc.p(-disMove.x, disMove.y)

        if(this.getParent().dirMain.x < 0){
            disMove.x = -disMove.x;
            disMove.y = disMove.y;
        }
        let disMove3 =  cc.pAdd(disMove2, disMove);
        var seq = cc.sequence( cc.MoveTo(0.08, disMove3), cc.MoveTo(0.1, disMove2))
        this.runAction(seq)
    },

    updateDir: function (direction) {
        // if(this.isTakeDame) return ;
        if(direction.x == 0 && direction.y == 0) return;
        var angle = cc.pToAngle(direction);
        this.curDir = direction;

        if(direction.x > 0) {
            this.setRotation(-angle/Math.PI*180);
        }
        if(direction.x < 0) {
            this.setRotation(-180+angle/Math.PI*180);
        }

        return true;
    },


});