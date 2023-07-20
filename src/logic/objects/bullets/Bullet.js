var Bullet = cc.Sprite.extend({
    _map: null,
    speed: 300,


    ctor: function(res, rule, posLogic, map, direction, dame, rang, speed) {
        this._super(res);
        this.radius = this.width/2;
        this.isDestroy = false
        this.active = true;
        this.rule = rule;
        this.posLogic = posLogic;
        this._map = map;
        this.direction = direction;
        this.dame = dame;
        this.rang = rang;
        this.speed = speed;
        this.disMove = 0; //quang duong di chuyen

    },

    updateMove: function ( dt) {
        var displacement = cc.pMult(this.direction, this.speed * dt);
        // var newPosX = cc.pAdd(this.posLogic, cc.p(displacement.x,0));
        // this.posLogic.x = newPosX.x;
        // var newPosY = cc.pAdd(this.posLogic, cc.p(0,displacement.y));
        // this.posLogic.y = newPosY.y
        var newPos = cc.pAdd(this.posLogic, cc.p(displacement.x,displacement.y));
        this.disMove += cc.pDistance(newPos, this.posLogic);
        if(this.checkColision(newPos) || this.disMove > this.rang){
            this.isDestroy = true;
            BackgroundLayerInstance.removeChild(this);
        }
        else {
            this.posLogic = newPos;
        }
        return true;
    },

    logicUpdate: function (dt) {
        if (this.active) {
            this.updateMove(dt)
        }
    },

    render: function () {
        var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        this.setPosition(posUI)
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
                enemy[1].takeDame(this.dame)
                return true;
            }
        }else {
            let player = BackgroundLayerInstance.player;
            let isColChar = isPointInsideHCN(p2, player.posLogic, 50, 80);
            if(isColChar == null) {
                isColChar = getColisionDoanThangVaHCN(p1,p2, player.posLogic, 50, 80);
            }
            if(isColChar != null){
                this.posLogic = new cc.p(player.posLogic.x, player.posLogic.y);
                player.takeDame(this.dame);
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

    // checkColision: function (newPos) {
    //     var l = Math.floor((newPos.x - this.radius)/60);
    //     var r = Math.floor((newPos.x + this.radius)/60);
    //
    //     var u = Math.floor((newPos.y + this.radius)/60);
    //     var d = Math.floor((newPos.y - this.radius)/60);
    //
    //     for(var i =l; i<= r; i++){
    //         if(this._map.mapArray[i][u] === 1){
    //             return true;
    //         }
    //         if(this._map.mapArray[i][d] === 1){
    //             return true;
    //         }
    //     }
    //     for(var i =d; i<= u; i++){
    //         if(this._map.mapArray[l][i] === 1){
    //             return true;
    //         }
    //         if(this._map.mapArray[r][i] === 1){
    //             return true;
    //         }
    //     }
    //     return false;
    // },



});