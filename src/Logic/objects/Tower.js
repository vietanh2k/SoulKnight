var _TOWER_CONFIG;
var RES_SOURCE_PATH = 'asset/tower/frame/'

var EachLevelAnimateTower = AnimatedSprite.extend({
    ctor: function (plist_file,
                    level='0',
                    name='wizard',
                    statuses= [['attack', 9, 1], ['idle', 15, 1]], n_direction=9){
        this._super('asset/tower/frame/wizard/tower_wizard_attack_0_0075.png');
        this.plist_file = plist_file;
        this.statuses = statuses;
        this.level = level;
        this.n_direction = n_direction;
        this.name=name
        this.initAnimation()
    },
    initAnimation:function (){

        this.possibleDirections = []
        let aHalfCircle = Math.PI, delta_radian = aHalfCircle/this.n_direction, init_radian = -Math.PI/2;
        for(var i=0;i<this.n_direction;i++){
            var cos = Math.cos(init_radian + delta_radian), sin = Math.sin(init_radian  + delta_radian);
            this.possibleDirections.push(new Vec2(cos, sin));
            init_radian += delta_radian;
        }
        cc.log("TowerLevel init with directions "+ JSON.stringify(this.possibleDirections))
        var level, status, direction, n_frame;
        this.animation = []
        // const moveDownAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 0, 11, 1)
        // this.possibleDirections = []
        // const init_animation = this.load(res.TWizard_plit, 'wizard/tower_wizard_attack_0_%04d.png', 0, 9, 1)
        this._animations = {}



        // this.play(0)
        for (let x of this.statuses) {
            status = x[0];
            n_frame= x[1];
            this._animations[status] = {}
                for (direction = 0; direction < this.n_direction; direction++) {
                    this._animations[status][direction]  = this.load(this.plist_file,
                        this.name + "/tower_"+this.name+"_"+status+"_"+this.level+"_%04d.png",
                        n_frame * direction, n_frame * (direction + 1)-1,
                        x[2]
                    )
            }

        }
        cc.log("Tower init with animation "+ JSON.stringify(this._animations))
        // this.runAction(this.animateActions[status][level][direction])
    },
    playAni:function (status, directionId){
        this.play(this._animations['attack'])
    }
})
var Tower = AnimatedSprite.extend({
        /**
         * Khởi tạo
         * @param {String} type: loại tháp
         * @param {PlayerState} playerState: trạng thái người chơi
         * @param {Vec2} position: vị trí deploy
         * @param {MapView} map: map add */
        ctor: function (type, playerState, position, map) {
            this._super('asset/tower/frame/wizard/tower_wizard_attack_0_0075.png');
            cc.log("Create new Tower: Type=" + type + "player state" + playerState + "position" + position)

            this._playerState = playerState
            this.active = true
            this.visible = false

            this.attackCoolDown = 0;
            this.type = "1";
            this.instance = type;
            this.target = [];
            this.position = position;
            this.health = 100
            this.physicbox = null;
            this.isDestroy = false
            this.renderRule = this._playerState.rule
            this._playerState = playerState
            this.new_direction = null
            this.direction = 0;
            this.resetPending();
            this.status = 'idle'
            this.level = 1
            this.map = map


            this.initAnimation()
            return true;
        },

        initAnimation: function () {
            cc.log("initAnimation ")
            var config = this.getConfig()
            let name = config["name"].split(' - ')[0]
            // this.levels_animation = []
            // var self  = this;
            // [0,1,2,3].forEach(lv=>{
            //     var sp = new AnimatedSprite(res.tree0)
            //     self.levels_animation.push(sp);
            //     self.addChild(sp);
            // })


            let statuses = [['attack', 9], ['idle', 15]],
                n_level = 3, n_direction=9;
            this.possibleDirections = []
            let aHalfCircle = Math.PI, delta_radian = aHalfCircle/n_direction, init_radian = -Math.PI/2;
            for(var i=0;i<n_direction;i++){
                var cos = Math.cos(init_radian + delta_radian), sin = Math.sin(init_radian  + delta_radian);
                this.possibleDirections.push(new Vec2(cos, sin));
                init_radian += delta_radian;
            }
            cc.log("Tower init with directions "+ JSON.stringify(this.possibleDirections))
            var level, status, direction, n_frame;
            this.animation = []
            // const moveDownAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 0, 11, 1)
            // this.possibleDirections = []
            this.currentAction = []
            // const init_animation = this.load(res.TWizard_plit, 'wizard/tower_wizard_attack_0_%04d.png', 0, 9, 1)
            this._animations = {}



            // this.play(0)
            for (let x of statuses) {
                cc.log("XXX"+ x)
                status = x[0];
                n_frame=x[1];
                this._animations[status] = {}
                for (level = 0; level <= n_level; level++) {
                    this._animations[status][level] = {}
                    for (direction = 0; direction < n_direction; direction++) {

                        this._animations[status][level][direction]  = this.load(res.TWizard_plit,
                            name + "/tower_"+name+"_"+status+"_"+level+"_%04d.png",
                            n_frame * direction, n_frame * (direction + 1)-1
                            )
                    }

                }

            }
            cc.log("Tower init with animation "+ JSON.stringify(this._animations))
            this.changDirectionHandle(null);
            // this.runAction(this.animateActions[status][level][direction])
            this.play(0)
        },
        render: function (playerState) {
            this.renderRule = playerState.rule

            if (this.renderRule === 1) {
                // dir.set(dir.x, -dir.y)
                let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
                let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
                let height = dy + CELLWIDTH * 5
                let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
                let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH

                this.x = dx + x
                this.y = height - y
            } else {
                // dir.set(-dir.x, dir.y)
                let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
                let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
                let height = dy + CELLWIDTH * 6
                let width = dx + CELLWIDTH * 7

                let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
                let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH

                this.setPosition(width - x, height + y)
            }

            // if (dir) {
            //     const v = this.animationIds[dir.y + 1]
            //     if (v) this.play(v[dir.x + 1])
            // }
        },
        getAttackSpeed: function () {
            return  this.getConfig()["stat"][this.getLevel()]['attackSpeed']/1000 ;
        },
        getPending: function () {
            return this.pendingSecond;
        },
        resetPending: function () {
            // cc.log("CONFIG " + JSON.stringify(this.getConfig()))
            this.pendingSecond = this.getConfig()["buildingTime"] / 1000;
        },
        updatePending: function (dt) {
            if (this.pendingSecond > 0) {
                this.pendingSecond -= dt;
            }
        },
        prioritize: function (map, object) {
            if (map.getDistanceBetween(object.position, this.position) <= this.getRange()) {
                this.target.unshift(object);
            }
        },
        fire: function () {
            if (this.target.length > 0) {
                let bullet = this.getNewBullet(this.target[0]);
                this.map.addNewBullet(bullet);
                var direction = this.target[0].position.sub(this.position)
                this.changDirectionHandle(direction);
                // this.new_direction =
            }

        },
        getAnimationsByDirectionId: function (moveId) {
            return this._animations[this.status][this.getLevel()][moveId];
        },
    /**
     * Chuyển hướng của tháp
     * @param {Vec2} direction: vector hướng đến mục tiêu
     * */
        changDirectionHandle: function (direction) {
            return;
        var self = this;
            if(direction==null){
                this.currentAction = []
                for(var level=0; level<=this.getLevel();level++){
                    cc.log()
                    this.currentAction.push(this._animations[this.status][level]["0"])
                }
                this.currentAction.map(action=>{
                    self.runAction(action)
                })
                return;

            }
            // if (!(this.animation_smooth <= 0)) return;

            var moveId = -1;
            var EuclidLength = function (vec) {
                return Math.sqrt(vec.x * vec.x + vec.y * vec.y)
            }
            var cosinesim = function (A, B) {
                var dotproduct = 0;
                var mA = 0;
                var mB = 0;
                for (i = 0; i < A.length; i++) {
                    dotproduct += (A[i] * B[i]);
                    mA += (A[i] * A[i]);
                    mB += (B[i] * B[i]);
                }
                mA = Math.sqrt(mA);
                mB = Math.sqrt(mB);
                var similarity = (dotproduct) / (mA) * (mB)
                // cc.log("cosine " +JSON.stringify(A) + " B: "+JSON.stringify(B) +"sim "+similarity)
                return similarity;
            }
            if (EuclidLength(direction) > 0) {
                var weight = [];
                this.possibleDirections.map(function (dir, idx) {

                    weight.push({weight: cosinesim([direction.x, direction.y], [dir.x, dir.y]), idx: idx});
                })
                weight.sort((a, b) => a.weight - b.weight);
                if (weight[weight.length - 1].weight == weight[weight.length - 2].weight && weight[weight.length - 2].index == this._lastDir) {
                    return;
                }

                moveId = weight[weight.length - 1].idx;
                cc.log("MoveID "+ moveId)
            }

            if (moveId !== this._lastDir && moveId !== -1) {
                if (moveId === 5 || moveId === 6 || moveId === 7) {
                    this.setFlippedX(true)
                } else {
                    this.setFlippedX(false)
                }
                // stop all current actions
                if (this.currentAction != null && this.currentAction.length > 0) {
                    this.currentAction.map(action => {
                        this.stopAction(action)
                    })
                }

                this.getAnimationsByDirectionId(moveId).map(action => {
                    self.runAction(action)
                    self.currentAction.push(action)
                })
                this._lastDir = moveId

            }
        },
        getNewBullet: function (object) {
            var speed = this.getConfig()['stat'][this.getLevel()]['bulletSpeed'],
                damage = this.getConfig()['stat'][this.getLevel()]['damage'],
                radius = this.getConfig()['stat'][this.getLevel()]['bulletRadius'],
                position = new Vec2(this.position.x, this.position.y);
            return new Bullet(object, speed, damage, radius, position);
        },
        upgrade: function (card) {
            return false;
        },
        /**
         * Update logic (tướng ứng với update trong thiết kế)
         * @param {PlayerState} playerState
         * @param {Number} dt
         * */
        logicUpdate: function (playerState, dt) {
            if (this.health <= 0) {
                this.active = false;
            }
            this.status = 'idle'
            if (this.active) {

                // cc.log('updating Tower')
                if (this.getPending() > 0) {
                    this.updatePending(dt);
                    this.visible = false;

                } else {
                    this.visible = true;
                    this.target = [];
                    var self = this;
                    const map = playerState.getMap()
                    map.getObjectInRange(this.position, self.getRange()).map(function (obj) {
                        // cc.log("found target" + this.position + "range" + self.getRange() + "B: "+obj.position)
                        if (self.checkIsTarget(obj)) {
                            self.target.push(obj);
                            // cc.log('found target')
                            // cc.log(obj)
                        }
                    })
                    if (this.attackCoolDown <= 0) {
                        if(this.target.length>0){
                            this.status = 'attack'
                            this.fire();
                            this.attackCoolDown = self.getAttackSpeed();
                        }

                    } else {
                        this.attackCoolDown -= dt;
                    }
                }

            }

        },
        checkIsTarget: function (another) {
            return (another.concept=="monster" || another.concept=="tree");
        },
        getLevel: function () {
            return this.level;
        },
        getRange: function () {
            return this.getConfig()['stat'][this.getLevel()]['range']
        },
        getConfig: function () {
            // cc.log("load config: type= " + this.type + " instance " + this.instance)
            if (_TOWER_CONFIG == undefined || _TOWER_CONFIG == null) {
                _TOWER_CONFIG = cc.loader.getRes("config/Tower.json");
            }
            _TOWER_CONFIG["tower"][this.type]["buildingTime"] = _TOWER_CONFIG.buildingTime
            // cc.log('config: '+ JSON.stringify(_TOWER_CONFIG))
            return _TOWER_CONFIG["tower"][this.type]
        },
        destroy: function () {
            // this._playerState.updateHealth(-1)
            // this._playerState.updateEnergy(this.energyFromDestroy)
            this.isDestroy = true
            if (this.getParent() != null) {
                this.getParent().getEnergyUI(cc.p(this.x, this.y), 5)
            }
            this.visible = false;
            this.active = false;
        },

    }
)

Tower.TOWER_FACTORY = {}

Tower.prototype.readConfig = function () {
    if (_TOWER_CONFIG == undefined) {

        _TOWER_CONFIG = cc.loader.getRes("config/Tower.json");
    }
    return _TOWER_CONFIG;
}

/**
 * @param {Card} card
 * @return {Tower} tower
 * */
Tower.getOrCreate = function (card) {
    if (Tower.TOWER_FACTORY == undefined) {
        Tower.TOWER_FACTORY = {}
    }
    return Tower.TOWER_FACTORY[card.id]();
}

