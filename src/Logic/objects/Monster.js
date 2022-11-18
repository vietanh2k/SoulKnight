

var Monster = AnimatedSprite.extend({
    _playerState: null,
    _type:null,
    _monsterType:null,
    _curNode:null,
    des:null,
    _speedVec:null,
    rootSpeed: 30,
    energyFromDestroy:null,
    _speed:null,
    animationIds:null,
    isDestroy:null,

    ctor:function (type, playerState) {
        this._playerState = playerState
        this.rule = this._playerState.rule
        this.rootSpeed = 80
        this.energyFromDestroy = 6
        this._super(res.m1);
        this.active = true;
        this.visible = true;
        this._speed = new cc.p(0,0)
        var pos = this._playerState.convertCordinateToPos2(0,0,this.rule)
        this.setPosition(pos)
        this.des = false
        this._speed = new cc.p(0,0)
        this._speedVec = new Vec2(0,0)
        this.isDestroy = false
        this.initAnimation()
        return true;
    },

    initAnimation:function (){
        const moveDownAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 0, 11, 1)
        const moveDownRightAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 12, 23, 1)
        const moveRightAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 24, 35, 1)
        const moveUpRightAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 36, 47, 1)
        const moveUpAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 48, 59, 1)
        const moveUpLeftAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_up_left (%d).png', 1, 12, 1)
        const moveLeftAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_left (%d).png', 1, 12, 1)
        const moveDownLeftAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_down_left (%d).png', 1, 12, 1)

        this.animationIds = [
            [moveDownLeftAnimId,           moveDownAnimId,        moveDownRightAnimId   ],
            [moveLeftAnimId,             moveUpAnimId,        moveRightAnimId          ],
            [moveUpLeftAnimId,         moveUpAnimId,         moveUpRightAnimId        ],
        ]
        this.play(0)

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
        var cor = this._playerState.convertPosToCor2(pos,this.rule)
        this._curNode = cor.x+'-' + cor.y
        if(cor.x == MAP_WIDTH && cor.y == MAP_HEIGHT && this.active) {
            this.des = true
            this.destroy()
        }

    },
    updateSpeedVec:function (){
        if(this._playerState._map._mapController.path[this._curNode] != undefined) {
            var curNodeStr = this._curNode.split('-');
            var curNode = new cc.p(parseInt(curNodeStr[0]), parseInt(curNodeStr[1]));
            var curPos = this._playerState.convertCordinateToPos2(curNode.x, curNode.y, this.rule)

            var nextNode = this._playerState._map._mapController.path[this._curNode].parent
            var nextLocStr = nextNode.split('-');
            var nextLoc = new cc.p(parseInt(nextLocStr[0]), parseInt(nextLocStr[1]));
            var nextPos = this._playerState.convertCordinateToPos2(nextLoc.x, nextLoc.y, this.rule)

            var nextPosVec = new Vec2(nextPos.x, nextPos.y)
            var curPosVec = new Vec2(curPos.x, curPos.y)
            var curVec = new Vec2(this.x, this.y)
            var desVec = (nextPosVec.add(curPosVec)).div(2)
            this._speedVec = ((desVec.sub(curVec)).normalize()).mul(this.rootSpeed)
            var dir = (desVec.sub(curVec)).normalize()
            dir.set(Math.round(dir.x), Math.round(dir.y))
            if (dir) {
                const v = this.animationIds[dir.y +1]
                if (v) this.play(v[dir.x +1])
            }
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
        this._playerState.updateHealth(-1)
        this._playerState.updateEnergy(this.energyFromDestroy)
        this.isDestroy = true
        if(this.getParent() != null){
            this.getParent().getEnergyUI(cc.p(this.x, this.y), this.energyFromDestroy)
        }
        this.visible = false;
        this.active = false;
    },




});




