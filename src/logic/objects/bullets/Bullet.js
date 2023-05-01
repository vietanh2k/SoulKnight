var Bullet = cc.Sprite.extend({
    _map: null,
    speed: 1200,


    ctor: function(posLogic, map, direction, dame, rang) {
        this._super(res.bullet);
        this.setScale(2)
        this.radius = this.width/2;
        this.isDestroy = false
        this.active = true;
        this.posLogic = posLogic;
        this._map = map;
        this.direction = direction;
        this.dame = dame;
        this.rang = rang;
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
        let gdBlock = BackgroundLayerInstance.objectView.getBlockColisionInMap(p1, p2);
        if(gdBlock != null) {
            cc.log("bbbbbbbbbb")
            // p2 = gdBlock;
            tmp = true;
        }

        //check colision voi enemy
        let enemy = BackgroundLayerInstance.objectView.getEnemyColisionInMap(p1, p2);
        if(enemy != null) {
            cc.log("aaaaaaa")
            this.posLogic = enemy[0];
            enemy[1].takeDame(this.dame)
            return true;
        }

        //neu colision voi block ma ko colision voi enemy
        if(tmp){
            this.posLogic = gdBlock;
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