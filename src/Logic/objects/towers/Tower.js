var Tower = TowerUI.extend({

    ctor: function (mcard, evolution) {
        this._super(mcard, evolution);
    },

    render: function (playerState) {
        if (!this.isSetPosition) {
            this.renderRule = playerState.rule;

            if (this.renderRule === 1) {
                let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2;
                let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3;
                let height = dy + CELLWIDTH * 5;
                let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH;
                let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH;
                this.x = dx + x;
                this.y = height - y;
            } else {
                let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2;
                let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3;
                let height = dy + CELLWIDTH * 6;
                let width = dx + CELLWIDTH * 7;
                let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH;
                let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH;
                this.x = width - x;
                this.y = height + y;
            }
            this.isSetPosition = true;
            if (this.fireFx != null) {
                this.fireFx.setPosition(this.x, this.y);
            }
        }

        if (this.renderRule === 1) {
            if (this.lastStatus === undefined || this.status !== this.lastStatus || (this.newDir !== undefined && this.newDir != null && this.newDir !== this.lastDir)) {
                if (this.status === 'readyToFire') {
                    this.updateDirection(this.newDir);
                } else {
                    this.playAttack(this.newDir);
                    this.status = 'readyToFire';
                }

                this.lastDir = this.newDir;
                this.lastStatus = this.status;
            }
        } else {
            if (this.lastStatus === undefined || this.status !== this.lastStatus || this.newDir !== undefined && this.newDir != null && this.newDir !== this.lastDir) {
                let dir = (this.newDir + 8) % 16;
                if (this.status === 'readyToFire') {
                    this.updateDirection(dir);
                } else {
                    this.playAttack(dir);
                    this.status = 'readyToFire';
                }
                this.lastDir = this.newDir;
                this.lastStatus = this.status;
            }
        }
    },

    getAttackSpeed: function () {
        return cf.TOWER.tower[this.instance].stat[this.level].attackSpeed / 1000;
    },

    getTargetType: function () {
        return cf.TOWER.tower[this.instance].targetType;
    },

    getPending: function () {
        return this.pendingSecond;
    },

    resetPending: function () {
        // this.pendingSecond = this.getConfig()["buildingTime"] / 1000;
        this.pendingSecond = 0
        this.max_pending = this.pendingSecond;
    },

    updatePending: function (dt) {
        if (this.pendingSecond > 0) {
            this.pendingSecond -= dt;
        }
    },

    fire: function () {
        if (this.target.length > 0) {
            let target = this.chooseTarget();
            let bullet = this.getNewBullet(target);
            this.map.addNewBullet(bullet);
            let direction = target.position.sub(this.position).normalize();
            this.newDir = this.changDirectionHandle(direction);
        }
    },

    chooseTarget: function () {
        if (this.prioritizedTarget === undefined) {
            return this.target[0];
        }
        let record, index;
        switch (this.prioritizedTarget) {
            case cf.PRIORITIZED_TARGET.FULL_HP:
                record = -1;
                index = -1;
                for (let i = 0; i < this.target.length; i++) {
                    if (this.target[i].health > record) {
                        record = this.target[i].health;
                        index = i;
                    }
                }
                return this.target[index];
            case cf.PRIORITIZED_TARGET.LOW_HP:
                record = 4000000000;
                index = -1;
                for (let i = 0; i < this.target.length; i++) {
                    if (this.target[i].health < record) {
                        record = this.target[i].health;
                        index = i;
                    }
                }
                return this.target[index];
            case cf.PRIORITIZED_TARGET.FURTHEST:
                record = -1;
                index = -1;
                for (let i = 0; i < this.target.length; i++) {
                    if (this.target[i].position.sub(this.position).length() > record) {
                        record = this.target[i].position.sub(this.position).length();
                        index = i;
                    }
                }
                return this.target[index];
            case cf.PRIORITIZED_TARGET.NEAREST:
                record = 4000000000;
                index = -1;
                for (let i = 0; i < this.target.length; i++) {
                    if (this.target[i].position.sub(this.position).length() < record) {
                        record = this.target[i].position.sub(this.position).length();
                        index = i;
                    }
                }
                return this.target[index];
            default:
                return this.target[0];
        }
    },

    changDirectionHandle: function (direction) {
        let dirs = [
            [10, 9, 8, 7, 6],
            [11, 12, 8, 7, 5],
            [12, 12, 0, 4, 4],
            [13, 12, 0, 3, 3],
            [14, 15, 0, 1, 2],
        ]
        cc.log('Previous direction' + direction);
        direction.set(
            Math.max(Math.round(2.5 + direction.x * 2.5) - 1, 0),
            Math.max(0, Math.round(2.5 + direction.y * 2.5) - 1)
        );
        cc.log('After direction' + direction);
        if (direction) {
            return dirs[direction.y][direction.x];
        }
        return null;
    },

    getNewBullet: function (object) {
        let speed = cf.TOWER.tower[this.instance].stat[this.level].bulletSpeed;
        let damage = cf.TOWER.tower[this.instance].stat[this.level].damage;
        let radius = cf.TOWER.tower[this.instance].stat[this.level].bulletRadius;
        let position = new Vec2(this.position.x, this.position.y);
        return new Bullet(object, speed, damage, radius, position, this);
    },


    findTargets: function (playerState) {
        this.target = [];
        const self = this;
        const map = playerState.getMap()
        /*map.getObjectInRange(self.position, self.getRange()).map(function (obj) {
            if (self.checkIsTarget(obj)) {
                self.target.push(obj);
            }
        })*/

        const enemies = map.queryEnemiesCircle(this.position, this.getRange() * MAP_CONFIG.CELL_WIDTH)
        enemies.forEach((monster) => {
            if (self.checkIsTarget(monster)) self.target.push(monster)
        })
    },

    /**
     * Update logic (tướng ứng với update trong thiết kế)
     * @param {PlayerState} playerState
     * @param {Number} dt
     * */
    logicUpdate: function (playerState, dt) {
        const self = this;

        if (this.health <= 0) {
            this.active = false;
        }
        this.status = 'readyToFire';

        if (this.getPending() > 0) {
            this.updatePending(dt);
        } else {
            this.visible = true;
            if (this.attackCooldown <= 0) {
                this.findTargets(playerState)
                if (this.target.length > 0) {
                    this.fire();
                    this.status = 'cooldowning';
                    this.attackCooldown = self.getAttackSpeed();
                }
            } else {
                this.attackCooldown -= dt;
            }
        }

    },

    checkIsTarget: function (another) {
        return (another.concept === "monster" || another.concept === "tree");
    },

    getRange: function () {
        return cf.TOWER.tower[this.instance].stat[this.level].range;
    },

    destroy: function () {
        this.isDestroy = true;
        if (this.getParent() != null) {
            this.getParent().getEnergyUI(cc.p(this.x, this.y), 5);
        }
        this.visible = false;
        this.removeFromParent(true);
        //this.active = false;
    },

    upgrade: function (card) {
        if (this.level === 3) {
            if (this.renderRule === 1) {
                Utils.addToastToRunningScene('Đã đạt cấp tiến hóa tối đa!');
            }
            return false;
        }
        this.level += 1;
        this.evolute();
        return true;
    },
});

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
