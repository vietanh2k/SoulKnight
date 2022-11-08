

var Monster = cc.Sprite.extend({
    _playerState: null,
    _type:null,
    _battle:null,
    _monsterType:null,
    listWay: null,
    _actionList:null,
    _animList:null,
    _curAction:null,
    _curNode:null,
    _nextNode:null,
    _preNode:null,
    des:null,
    _curDir:null,
    rootSpeed: 30,
    _preActionMove:null,
    atDes:null,
    _speed:null,
    timeMove:null,
    readyRun:null,
    ind:0,
    xm:10,
    ctor:function (type, playerState) {
        this._playerState = playerState
        this.rootSpeed = 30
        this._super(res.m1);
        this.active = true;
        this.visible = true;
        this.setScale(0.2);
        this._speed = new cc.p(0,0)
        var pos = this._playerState.convertCordinateToPos(0,0)
        this.setPosition(pos)
        this.des = false
        this._speed = new cc.p(0,0)



        // this._curAction = this.getActionMove(this._curDir);
        // this.runAction(this._curAction)



        return true;
    },


    update:function (dt){
        this.updateCurNode()
        if(this.active){
            this.updateDes()
            this.updateMove(dt)
        }

    },

    updateCurNode:function (){
        // this.updatePath()
        var pos = new cc.p(this.x, this.y)
        var loc = this._playerState.convertPosToCor(pos)
        this._curNode = loc.x+'-' + loc.y
        if(loc.x == MAP_WIDTH && loc.y == MAP_HEIGHT && this.active) {
            this.des = true
            this.destroy()
        }

    },
    updateDes:function (){
        var nextNode =  this._playerState._map._mapController.path[this._curNode].parent
        var nextLocStr = nextNode.split('-');
        var nextLoc = new cc.p(parseInt(nextLocStr[0]), parseInt(nextLocStr[1]));
        var nextPos = this._playerState.convertCordinateToPos(nextLoc.x, nextLoc.y)
        var dir = this._playerState._map._mapController.path[this._curNode].direc
        if(dir == 2){
            var posX = nextPos.x - this.x
            var posY = nextPos.y-1.05*CELLWIDTH/2 - this.y
            if(posX == 0) {
                this._speed.y = this.rootSpeed
                this._speed.x = 0
            }
            else if(posY ==0) {
                this._speed.x = this.rootSpeed
                this._speed.y = 0
            }else {
                var rad = posX / posY
                this._speed.y = +Math.sqrt(Math.pow(this.rootSpeed, 2) / (1 + rad * rad))
                this._speed.x = this._speed.y * rad
            }

        }
        if(dir == 8){
            var posX = nextPos.x - this.x
            var posY = nextPos.y+1.05*CELLWIDTH/2 - this.y
            if(posX == 0) {
                this._speed.y = -this.rootSpeed
                this._speed.x = 0
            }
            else if(posY ==0) {
                this._speed.x = this.rootSpeed
                this._speed.y = 0
            }else {
                var rad = posX / posY
                this._speed.y = -Math.sqrt(Math.pow(this.rootSpeed, 2) / (1 + rad * rad))
                this._speed.x = this._speed.y * rad
            }
        }
        if(dir == 6){
            var posX = nextPos.x-1.05*CELLWIDTH/2 - this.x
            var posY = nextPos.y - this.y
            if(posX == 0) {
                this._speed.y = this.rootSpeed
                this._speed.x = 0
            }
            else if(posY ==0) {
                this._speed.x = this.rootSpeed
                this._speed.y = 0
            }else {
                var rad =posY / posX
                this._speed.x = Math.sqrt(Math.pow(this.rootSpeed, 2) / (1 + rad * rad))
                this._speed.y = this._speed.x * rad
            }
        }
        if(dir == 4){
            var posX = nextPos.x+1.05*CELLWIDTH/2 - this.x
            var posY = nextPos.y - this.y
            if(posX == 0) {
                this._speed.y = this.rootSpeed
                this._speed.x = 0
            }
            else if(posY ==0) {
                this._speed.x =- this.rootSpeed
                this._speed.y = 0
            }else {
                var rad = posY / posX
                this._speed.x = -Math.sqrt(Math.pow(this.rootSpeed, 2) / (1 + rad * rad))
                this._speed.y = this._speed.x * rad
            }
        }
        // cc.log(nextLoc.x)
        // cc.log(nextLoc.y)
        // cc.log(nextPos.x)

    },

    updateMove:function (dt){

        // this.x += (this.des.x-this.x)*dt
        // this.y += (this.des.y-this.y)*dt
        this.x += this._speed.x*dt
        this.y += this._speed.y*dt
        // this.x += 50*dt

    },


    destroy:function () {
        this._playerState.updatehealth(-1)
        this.visible = false;
        this.active = false;
    },




});




