var Sword = Weapon.extend({

    ctor: function(_res, posLogic, map) {
        this._super(_res, posLogic, map);
        this.res = _res;
        this.rateSpeed = 1;
        this.rang = 100;    //range
        this.dame = 2;
        this.accuracy = 0.9;
        this.critRate = 0.5;
        this.critDame = 1.5;
        this.isTakeDame = false;
        this.updateStat(this.dame, this.rateSpeed, this.accuracy, this.critRate, this.critDame, this.rang)
        this.canRotate = true;

    },

    activateWeapon: function (rule) {

        //tinh goc lech accuracy
        let dirBullet = this.getDirBulletByAccu();

        //tinh dame crit
        let dame = this.getDameByCrit();
        this.animaTakeDame(dirBullet, this.rang)
        this.takeDame(dame, dirBullet, this.rang, rule);

    },

    takeDame: function (dame, dirBullet, rang, rule) {
        let p2 = cc.pAdd(this.posLogic, cc.pMult(dirBullet, rang));
        let listBlockId = BackgroundLayerInstance.objectView.getAllBlockColisionInMap(this.posLogic, p2);
        let listBox = BackgroundLayerInstance.mapView.listBox;
        for(var i=0; i<listBlockId.length; i++){
            let tag = listBlockId[i][0]+"-"+listBlockId[i][1];
            if(listBox.hasOwnProperty(tag)){
                listBox[tag].takeDame(this.dame);
            }
        }

        //tinh pos dau sung
        if(rule === 1){

        }else if(rule === 2) {
            let player = BackgroundLayerInstance.player;
            let isColChar = isPointInsideHCN(p2, player.posLogic, 50, 80);
            if (isColChar == null) {
                isColChar = getColisionDoanThangVaHCN(this.posLogic, p2, player.posLogic, 50, 80);
            }
            if (isColChar != null) {
                this.posLogic = new cc.p(player.posLogic.x, player.posLogic.y);
                player.takeDame(this.dame);
                return true;
            }
        }

    },

    animaTakeDame: function ( dirBullet, rang) {
        this.canRotate = false;
        var num = 5
        var seq = cc.sequence( cc.RotateBy(0.5, 90))
        this.runAction(seq)
        this.interval =setInterval(()=>{
            // if(this.isDestroy) {
            //     clearInterval(this.interval);
            //     return;
            // }
            // var posLogic = new cc.p(this.posLogic.x,this.posLogic.y);
            // let ran = Math.random()* 0.4;
            // for(var i= -1+ran; i<= 1; i += 0.53){
            //     for(var j=-1+ ran*0.5; j<=1 ; j+= 0.46){
            //         if(i === 0 || j === 0) continue;
            //         var dir = new cc.p(i, j);
            //
            //         dir = cc.pNormalize(dir)
            //         let posLogic2 = cc.pAdd(posLogic, cc.pMult(dir, this.width/2))
            //
            //         var bullet = new  LongBullet(2, posLogic2, this._map, dir,2, 1500, 200)
            //         BackgroundLayerInstance.objectView.addBullet(bullet)
            //     }
            // }
            if(num-- <=0) {
                clearInterval(this.interval);
                this.interval = null;
                this.canRotate = true;
            }
        }, 1000)
        //tinh pos dau sung
        // rang = 25;
        // let disMove2 = new cc.p(this.x, this.y);
        // let disMove = cc.pMult(dirBullet, rang/CELL_SIZE_UI*GAME_CONFIG.CELLSIZE);
        //
        // // disMove = new cc.p(-disMove.x, disMove.y)
        //
        // if(this.getParent().dirMain.x < 0){
        //     disMove.x = -disMove.x;
        //     disMove.y = disMove.y;
        // }
        // let disMove3 =  cc.pAdd(disMove2, disMove);
        // var seq = cc.sequence( cc.MoveTo(0.08, disMove3), cc.MoveTo(0.1, disMove2))
        // this.runAction(seq)
    },

    updateDir: function (direction2) {
        if(!this.canRotate) return ;

        let angle2 = 40;
        if(direction2.x < 0){
            angle2 = -40;
        }
        let radians = angle2 * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let newX = direction2.x * cos - direction2.y * sin;
        let newY = direction2.x * sin + direction2.y * cos;
        let direction = new cc.p(newX, newY);

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
    //
    // updateDir: function (direction) {
    //     if(!this.canRotate) return ;
    //
    //     try{
    //         if(isNaN(direction.x) || isNaN(direction.y)) return;
    //         if(direction == null || direction == undefined) return ;
    //         if(direction.x == 0 && direction.y == 0) return;
    //         var angle = cc.pToAngle(direction);
    //         this.curDir = direction;
    //
    //         if(direction.x > 0) {
    //             this.setRotation(-angle/Math.PI*180);
    //         }
    //         if(direction.x < 0) {
    //             this.setRotation(-180+angle/Math.PI*180);
    //         }
    //
    //         return true;
    //     } catch (e) {
    //     }
    //
    // },


});