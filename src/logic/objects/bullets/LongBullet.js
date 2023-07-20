var LongBullet = Bullet.extend({
    _map: null,

    ctor: function(rule, posLogic, map, direction, dame, rang, speed) {
        this._super(res.longBullet, rule, posLogic, map, direction, dame, rang, speed);
        this.scale = this.scale * 1.5;
        let back = new cc.Sprite(res.longBulletBack);
        back.setPosition(this.width/2, this.height/2);
        back.opacity = 60;
        this.addChild(back);
        var angle = cc.pToAngle(direction);
        this.setRotation(-angle/Math.PI*180);

        // this.setScale(1.5)

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
            let blockId = blockTmp[1];
            let listBox = BackgroundLayerInstance.mapView.listBox;
            let tag = blockId[0]+"-"+blockId[1];
            if(listBox.hasOwnProperty(tag)){
                listBox[tag].takeDame(this.dame);
            }
            return true;
        }

        if(newPos.x < GAME_CONFIG.CELLSIZE){
            return true;
        }

        if(newPos.x > GAME_CONFIG.CELLSIZE*MAP_WIDTH){
            return true;
        }

        if(newPos.y < GAME_CONFIG.CELLSIZE){
            return true;
        }

        if(newPos.y > GAME_CONFIG.CELLSIZE*MAP_HEIGHT){
            return true;
        }


        // var l = Math.floor((newPos.x - this.radius)/60);
        // var r = Math.floor((newPos.x + this.radius)/60);
        //
        // var u = Math.floor((newPos.y + this.radius)/60);
        // var d = Math.floor((newPos.y - this.radius)/60);
        //
        // for(var i =l; i<= r; i++){
        //     if(this._map.mapArray[i][u] === 1){
        //         return true;
        //     }
        //     if(this._map.mapArray[i][d] === 1){
        //         return true;
        //     }
        // }
        // for(var i =d; i<= u; i++){
        //     if(this._map.mapArray[l][i] === 1){
        //         return true;
        //     }
        //     if(this._map.mapArray[r][i] === 1){
        //         return true;
        //     }
        // }
        return false;
    },

    activeBullet: function (target) {
        target.takeDame(this.dame);
    },



});