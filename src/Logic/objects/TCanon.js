// var _TOWER_CONFIG;
var TCanon = TowerUI.extend({
        /**
         * Khởi tạo
         * @param {MCard} card:
         * @param {PlayerState} playerState: trạng thái người chơi
         * @param {Vec2} position: vị trí deploy
         * @param {MapView} map: map add */
        ctor: function (card, playerState, position, map) {
            cc.log('init canon')
            this._super(card, 0);
            // cc.log("Create new Tower: Type=" + type + "player state" + playerState + "position" + position)

            this._playerState = playerState
            this.active = true
            this.visible = false

            this.attackCoolDown = 0;
            this.instance = "1";
            this.target = [];
            this.position = position;
            this.health = 100
            this.physicbox = null;
            this.isDestroy = false
            this.renderRule = this._playerState.rule
            this._playerState = playerState
            this.new_direction = null
            this.direction = 0;

            this.status = 'idle'
            this.level = 1
            this.map = map
            this._is_set_pos = false
            // this.initAnimation()
            this.resetPending();

            return true;
        },
        AnimationSetUp: function (card) {
            this.initTextures = [];
            this.idlePrefixNames = [];
            this.attackPrefixNames = [];
            for (let i = 0; i < 3; i++) {
                this.initTextures[i] = 'asset/tower/frame/cannon_1_2/tower_cannon_idle_' + i + '_0000.png';
                this.idlePrefixNames[i] = 'tower_cannon_idle_' + i + '_';
                this.attackPrefixNames[i] = 'tower_cannon_attack_' + i + '_';
            }
            this.initTextures[3] = 'asset/tower/frame/cannon_3/tower_cannon_idle_3_0000.png';
            this.idlePrefixNames[3] = 'tower_cannon_idle_3_';
            this.attackPrefixNames[3] = 'tower_cannon_attack_3_';
            this.idleIDP = 15;
            this.attackIDP = 9;
        },


        render: function (playerState) {
            if (!this._is_set_pos) {
                this.renderRule = playerState.rule
                var self = this

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
                this._is_set_pos = true
            }

        },
        getAttackSpeed: function () {
            return this.getConfig()["stat"][this.getLevel()]['attackSpeed'] / 1000;
        },
        getPending: function () {
            return this.pendingSecond;
        },
        resetPending: function () {
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
                var direction = this.target[0].position.sub(this.position);
                cc.log("Change Direction tower: " + direction);
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
        },
        getNewBullet: function (object) {
            var speed = this.getConfig()['stat'][this.getLevel()]['bulletSpeed'],
                damage = this.getConfig()['stat'][this.getLevel()]['damage'],
                radius = this.getConfig()['stat'][this.getLevel()]['bulletRadius'],
                position = new Vec2(this.position.x, this.position.y);
            return new Bullet(object, speed, damage, radius, position);
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
                this.update(dt);

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
                        if (this.target.length > 0) {
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
            return (another.concept == "monster" || another.concept == "tree");
        },
        getLevel: function () {
            return this.level;
        },
        getRange: function () {
            return this.getConfig()['stat'][this.getLevel()]['range']
        },
        getConfig: function () {
            if (_TOWER_CONFIG == undefined || _TOWER_CONFIG == null) {
                _TOWER_CONFIG = cc.loader.getRes("config/Tower.json");
            }
            _TOWER_CONFIG["tower"][this.instance]["buildingTime"] = _TOWER_CONFIG.buildingTime
            return _TOWER_CONFIG["tower"][this.instance]
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
        upgrade: function (card) {
            this.evolute();
            if(this.level<3){
                this.level += 1;
            }
        }

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

