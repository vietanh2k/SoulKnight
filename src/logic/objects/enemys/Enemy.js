var Enemy = AnimatedSprite.extend({
    _map: null,
    direction: null,
    radius: 0,
    speed: 200,
    posLogic: null,

    ctor: function(posLogic, map) {
        this._super(res.celll);
        this.isDestroy = false
        this.setScale(0.9 * CELL_SIZE_UI / this.getContentSize().width)
        this.posLogic = posLogic;
        this.radius = this.width/3 *(GAME_CONFIG.CELLSIZE/ CELL_SIZE_UI*this.scale)
        this.hp = 50;
        this.dirMove = new cc.p(0,1);
        this.isChangeDir = true;
        this.isChangeDirByBlock = false;
        this.disMove = GAME_CONFIG.CELLSIZE;
        // p.scale = 1.2 * CELL_SIZE_UI / p.getContentSize().width
        this.setAnchorPoint(0.5, 0.28)
        this.initAnimation()
        this.setCascadeOpacityEnabled(false)
        // this.opacity = 0
        this._map = map;

    },

    initAnimation: function () {
        const duration = 0.6
        const moveDownAnimId = this.load(res.assassin_plist, 'idle_%01d.png', 0, 3, duration)
        const moveDownAnimId2 = this.load(res.assassin_plist, 'run_%01d.png', 0, 3, duration)

        this.play(0)
    },

    takeDame: function (dame) {
        if(this.isDestroy) return ;
        this.hp = Math.max(this.hp - Math.floor(dame), 0);
        getNumDameUI(dame, cc.p(this.x, this.y))
        cc.log(this.hp)
        cc.log(dame)
        if(this.hp <= 0) {
            this.isDestroy = true;
            this.destroy();
        }
    },

    destroy: function () {
        this.removeFromParent(true);
    },

    logicUpdate: function (dt) {
        if(this.isChangeDir) {
            this.isChangeDir = false;
            var dir = cc.pSub(BackgroundLayerInstance.player.posLogic, this.posLogic);
            let disRan = Math.floor(Math.random() * GAME_CONFIG.CELLSIZE*2) + GAME_CONFIG.CELLSIZE*2;
            this.disMove = disRan;
            let angleTotal = 145;
            if(this.isChangeDirByBlock){
                this.isChangeDirByBlock = false;
                let temp = new cc.p(-this.dirMove.x, -this.dirMove.y);
                this.disMove = GAME_CONFIG.CELLSIZE*3;

                var diff = cc.pSub(dir,temp)         // Tính vector chênh lệch giữa hai vector
                var diffNormalized = cc.pNormalize(diff) // Lấy vector đơn vị của vector chênh lệch
                var projectionLength = cc.pDot(temp, diffNormalized) // Tính độ dài vector phân giác
                var projection = cc.pMult(diffNormalized, projectionLength) // Tính vector phân giác và lưu kết quả vào biến projection
                dir = cc.pAdd(temp, projection);
                angleTotal=90
                cc.log(dir.x+" "+dir.y)
            }


            let angle = Math.floor(Math.random() * angleTotal) - angleTotal / 2;
            let radians = angle * Math.PI / 180;
            let cos = Math.cos(radians);
            let sin = Math.sin(radians);
            let newX = dir.x * cos - dir.y * sin;
            let newY = dir.x * sin + dir.y * cos;
            let dirBullet = new cc.p(newX, newY);

            this.dirMove = cc.pNormalize(dirBullet);


        }
        this.updateMove(this.dirMove, dt)

    },

    updateMove: function (direction, dt) {
        if(this.isDestroy) return ;
        if(direction.x === 0) this.play(0)
        if(direction.x > 0) {
            this.play(1)
            this.setRotationY(0)
        }
        if(direction.x < 0) {
            this.play(1)
            this.setRotationY(180)
        }

        var displacement = cc.pMult(direction, this.speed * dt);
        let distan =Math.sqrt(Math.pow(displacement.x, 2) + Math.pow(displacement.y, 2));
        var newPosX = cc.pAdd(this.posLogic, cc.p(displacement.x,0));
        this.updateMoveX(newPosX);

        var newPosY = cc.pAdd(this.posLogic, cc.p(0,displacement.y));
        this.updateMoveY(newPosY);

        this.disMove -= distan;
        if(this.disMove <= 0) this.isChangeDir = true;

        return true;
    },

    updateMoveX: function (newPosX) {
        this.posLogic.x = this.checkColisionX(newPosX);
    },

    updateMoveY: function (newPosY) {
        this.posLogic.y = this.checkColisionY(newPosY);
    },

    checkColisionX: function (newPos) {
        var l = Math.floor((newPos.x - this.radius)/60);
        var r = Math.floor((newPos.x + this.radius)/60);

        var u = Math.floor((newPos.y + this.radius)/60);
        var d = Math.floor((newPos.y - this.radius)/60);

        for(var i =l; i<= r; i++){
            if(this._map.mapArray[i][u] === 1){
                var tmp = convertIndexToPosLogic(i,u).x;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
            if(this._map.mapArray[i][d] === 1){
                var tmp = convertIndexToPosLogic(i,d).x;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
        }
        for(var i =d; i<= u; i++){
            if(this._map.mapArray[l][i] === 1){
                var tmp = convertIndexToPosLogic(l,i).x;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
            if(this._map.mapArray[r][i] === 1){
                var tmp = convertIndexToPosLogic(r,i).x;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.x);
            }
        }
        return newPos.x;
    },

    checkColisionY: function (newPos) {
        var l = Math.floor((newPos.x - this.radius)/60);
        var r = Math.floor((newPos.x + this.radius)/60);

        var u = Math.floor((newPos.y + this.radius)/60);
        var d = Math.floor((newPos.y - this.radius)/60);

        for(var i =l; i<= r; i++){
            if(this._map.mapArray[i][u] === 1){
                var tmp = convertIndexToPosLogic(i,u).y;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
            if(this._map.mapArray[i][d] === 1){
                var tmp = convertIndexToPosLogic(i,d).y;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
        }
        for(var i =d; i<= u; i++){
            if(this._map.mapArray[l][i] === 1){
                var tmp = convertIndexToPosLogic(l,i).y;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
            if(this._map.mapArray[r][i] === 1){
                var tmp = convertIndexToPosLogic(r,i).y;
                this.isChangeDir = true;
                this.isChangeDirByBlock = true;
                return this.getCorrectPos(tmp, this.posLogic.y);
            }
        }
        return newPos.y;
    },

    getCorrectPos: function (posVC, posPlayer) {
        if(posVC > posPlayer) {
            return posVC - 30 - this.radius-2;
        }else{
            return posVC + 30 + this.radius+2;
        }
    },

    createBullet: function () {
        return this.we.createBullet()
    },


    render: function () {
        if(this.isDestroy) return ;
        var posUI = cc.pMult(this.posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));
        this.setPosition(posUI)
    },


});