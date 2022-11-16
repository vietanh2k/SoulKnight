var _TOWER_CONFIG;
var Tower = AnimatedSprite.extend({
        /**
         * Khởi tạo
         * @param {String} type: loại tháp
         * @param {PlayerState} playerState: trạng thái người chơi
         * @param {Vec2} position: vị trí deploy*/
        ctor: function (type, playerState, position) {
            cc.log("Create new Tower: Type="+type+ "player state"+ playerState+ "position" + position )
            this._super(res.m1);
            this._playerState = playerState
            this.active = true
            this.visible = true

            this.attackCoolDown = 0;
            this.type = "1";
            this.instance = type;
            this.target = [];
            this.position = position;
            this.physicbox = null;
            this.isDestroy = false
            this.renderRule = this._playerState.rule
            this._playerState = playerState
            this.resetPending();
            this.initAnimation()
            return true;
        },

        initAnimation: function () {
            var config = this.getConfig()
            let name = config["name"].split(' - ')[0]
            const num_direction = 18;
            let statuses = [['attack',9], ['idle',15]],
                n_level = 3;

            this.animation = {}
            for (let [status, n_frame] of statuses) {
                this.animation[status] = {}
                for (let level = 0; level < n_level; level++) {
                    this.animation[status][level] = {}
                    for (let direction = 0; direction < Math.floor(num_direction / 2); direction++) {
                        var filepaths = []
                        for (let a_i = n_frame * i; a_i < n_frame * (i + 1); a_i++) {
                            filepaths.push(Tower.RES_SOURCE_PATH + name + "/tower_%s_%s_%d_%04d.png".format(name, status, level, a_i))
                        }
                        this.animation[status][level][direction] =
                            this.loadFromMultiFile(filepaths, "tower_%s_%s_%d_%d".format(name, status, level, direction), config["attackAnimationTime"])
                    }

                }

            }

            this.play(0)
        },
    render: function (playerState) {
            if (this.position.isApprox(this.prevPosition)) return;

            const dir = (this.position.sub(this.prevPosition)).normalize()

            dir.set(Math.round(dir.x), Math.round(dir.y))

            if (this.renderRule === 1) {
                dir.set(dir.x, -dir.y)
                let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
                let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
                let height = dy + CELLWIDTH * 5
                let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
                let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH

                this.x = dx + x
                this.y = height - y
            } else {
                dir.set(-dir.x, dir.y)
                let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
                let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
                let height = dy + CELLWIDTH * 6
                let width = dx + CELLWIDTH * 7

                let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
                let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH

                this.setPosition(width - x, height + y)
            }

            if (dir) {
                const v = this.animationIds[dir.y + 1]
                if (v) this.play(v[dir.x + 1])
            }
        },
        getAttackSpeed: function () {
            return 0;
        },
        getPending: function () {
            return this.pendingSecond;
        },
        resetPending: function () {
            cc.log("CONFIG " + JSON.stringify(this.getConfig()))
            this.pendingSecond = this.getConfig().buildingTime / 1000;
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
        getRange: function () {
            return 0;
        },
        fire: function () {
            if (this.target.size() > 0) {
                let bullet = this.getNewBullet(target[0]);
                this.map.addNewBullet(bullet);
            }

        },
        getNewBullet: function (object) {
            return new Bullet(object);
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
                active = false;
            }
            if (active) {
                if (this.getPending() > 0) {
                    this.updatePending(dt);
                } else {
                    this.target = [];
                    var self = this;
                    const map = playerState.getMap()
                    map.getObjectInRange(this.position, this.getRange()).map(function (obj) {
                        if (self.checkIsTarget(obj)) {
                            self.target.add(obj);
                        }
                    })
                    if (this.attackCoolDown <= 0) {
                        this.fire();
                        this.attackCoolDown = self.getAttackSpeed();
                    } else {
                        this.attackCoolDown -= dt * 1000;
                    }
                }

            }

        },
        checkIsTarget: function (another) {
            return false;
        },
        getLevel: function () {
            return this.level;
        },
        getAttackSpeed: function () {
            return 0;
        },
        getRange: function () {
            return 0;
        },
        getConfig: function () {
            cc.log("load config: type= " + this.type + " instance "+this.instance)
            if (_TOWER_CONFIG == undefined||_TOWER_CONFIG==null) {
                _TOWER_CONFIG= cc.loader.getRes("config/Tower.json");
            }
            cc.log('config: '+ JSON.stringify(_TOWER_CONFIG))
            return _TOWER_CONFIG["tower"][this.type]
        },
        destroy: function () {
        // this._playerState.updateHealth(-1)
        // this._playerState.updateEnergy(this.energyFromDestroy)
        this.isDestroy = true
        if(this.getParent() != null){
            this.getParent().getEnergyUI(cc.p(this.x, this.y), this.energyFromDestroy)
        }
        this.visible = false;
        this.active = false;
    },

    }
)

Tower.TOWER_FACTORY = {}
Tower.RES_SOURCE_PATH = 'asset/tower/frame/'
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

