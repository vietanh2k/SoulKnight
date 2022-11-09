

var Monster = cc.Sprite.extend({
    _playerState: null,
    _type:null,
    _monsterType:null,
    _curNode:null,
    _nextNode:null,
    _preNode:null,
    des:null,
    _speedVec:null,
    rootSpeed: 30,
    atDes:null,
    _speed:null,
    readyRun:null,

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
        this._speedVec = new Vec2(0,0)
        // this.initAnimation()
        return true;
    },

    initAnimation:function (){
        var an1 = new AnimatedSprite(1)
            an1.load(res.darkgiant_plist, 1,0,7,1)
            an1.play(0)
    },
    update:function (dt){
        this.updateCurNode()
        if(this.active){
            this.updateSpeedVec()
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
    updateSpeedVec:function (){
        if(this._playerState._map._mapController.path[this._curNode] != undefined) {
            var curNodeStr = this._curNode.split('-');
            var curNode = new cc.p(parseInt(curNodeStr[0]), parseInt(curNodeStr[1]));
            var curPos = this._playerState.convertCordinateToPos(curNode.x, curNode.y)

            var nextNode = this._playerState._map._mapController.path[this._curNode].parent
            var nextLocStr = nextNode.split('-');
            var nextLoc = new cc.p(parseInt(nextLocStr[0]), parseInt(nextLocStr[1]));
            var nextPos = this._playerState.convertCordinateToPos(nextLoc.x, nextLoc.y)
            var dir = this._playerState._map._mapController.path[this._curNode].direc

            var nextPosVec = new Vec2(nextPos.x, nextPos.y)
            var curPosVec = new Vec2(curPos.x, curPos.y)
            var curVec = new Vec2(this.x, this.y)
            var desVec = (nextPosVec.add(curPosVec)).div(2)
            this._speedVec = ((desVec.sub(curVec)).normalize()).mul(this.rootSpeed)
        }
        // cc.log(desVec)
        // cc.log(this._speedVec)

    },



    updateMove:function (dt){

        // this.x += (this.des.x-this.x)*dt
        // this.y += (this.des.y-this.y)*dt
        this.x += this._speedVec.x*dt
        this.y += this._speedVec.y*dt
        // this.setPosition()
        // this.x += 50*dt

    },


    destroy:function () {
        this._playerState.updatehealth(-1)
        this.visible = false;
        this.active = false;
    },




});




