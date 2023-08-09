var Rocket = Bullet.extend({
    _map: null,

    ctor: function(rule, posLogic, map, direction, dame, rang, speed) {
        this._super(res.rocket, rule, posLogic, map, direction, dame, rang, speed);
        var angle = cc.pToAngle(direction);
        this.setRotation(-angle/Math.PI*180+180);
        this.setScale(2)
        this.radius = GAME_CONFIG.CELLSIZE*1.5;
        this.maxSpeed = speed*1.5;

    },

    updateMore: function (dt) {
        this.speed *= 1.012;
        if(this.speed >= this.maxSpeed){
            this.speed = this.maxSpeed;
        }
    },

    checkColision: function (newPos) {
        let p1 = new cc.p(this.posLogic.x, this.posLogic.y)
        let p2 = new cc.p(newPos.x, newPos.y)

        let tmp = false;
        //check colision voi Block
        let blockTmp = BackgroundLayerInstance.objectView.getBlockColisionInMap(p1, p2);
        let gdBlock = blockTmp[0];
        if(gdBlock != null) {
            p2 = gdBlock;
            tmp = true;
        }

        //check colision voi enemy
        if(this.rule === 1) {
            let enemy = BackgroundLayerInstance.objectView.getEnemyColisionInMap(p1, p2);
            if (enemy != null) {
                this.posLogic = enemy[0];
                this.activeBullet(enemy[1]);
                return true;
            }
        }else if(this.rule === 2){
            let player = BackgroundLayerInstance.player;
            let isColChar = isPointInsideHCN(p2, player.posLogic, 50, 80);
            if(isColChar == null) {
                isColChar = getColisionDoanThangVaHCN(p1,p2, player.posLogic, 50, 80);
            }
            if(isColChar != null){
                this.posLogic = new cc.p(player.posLogic.x, player.posLogic.y);
                this.activeBullet(player);
                return true;
            }
        }

        //neu colision voi block ma ko colision voi enemy
        if(tmp){
            this.posLogic = gdBlock;
            this.activeBullet(null);
            return true;
        }

        if(newPos.x < GAME_CONFIG.CELLSIZE){
            this.activeBullet(null);
            return true;
        }

        if(newPos.x > GAME_CONFIG.CELLSIZE*MAP_WIDTH){
            this.activeBullet(null);
            return true;
        }

        if(newPos.y < GAME_CONFIG.CELLSIZE){
            this.activeBullet(null);
            return true;
        }

        if(newPos.y > GAME_CONFIG.CELLSIZE*MAP_HEIGHT){
            this.activeBullet(null);
            return true;
        }

        return false;
    },

    activeBullet: function (target) {
        var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        let a = new Explosion(posUI, this.radius);
        BackgroundLayerInstance.addChild(a);

        let obj = BackgroundLayerInstance.objectView.getAllBlockAndEnemyInCircle(this.posLogic,this.radius)
        for (let i = 0; i < obj.length; i++) {
            obj[i].takeDame(this.dame);
        }
    },



});