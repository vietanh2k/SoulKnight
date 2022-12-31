var Tower = TowerUI.extend({

    ctor: function (rule, card, evolution) {
        this._super(card, evolution);
        this.inactiveSourceCounter = 0;

        if (rule === 1) {
            this.correspondingCard = sharePlayerInfo.deck.find(element => element.type === card);
        } else if (rule === 2) {
            this.correspondingCard = shareOpponentInfo.deck.find(element => element.type === card);
        }
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
                    this.updateDirectionForIdle(this.newDir);
                } else {
                    this.updateDirectionForAttack(this.newDir);
                    this.status = 'readyToFire';
                }

                this.lastDir = this.newDir;
                this.lastStatus = this.status;
            }
        } else {
            if (this.lastStatus === undefined || this.status !== this.lastStatus || this.newDir !== undefined && this.newDir != null && this.newDir !== this.lastDir) {
                let dir = (this.newDir + 8) % 16;
                if (this.status === 'readyToFire') {
                    this.updateDirectionForIdle(dir);
                } else {
                    this.updateDirectionForAttack(dir);
                    this.status = 'readyToFire';
                }
                this.lastDir = this.newDir;
                this.lastStatus = this.status;
            }
        }
    },

    getRange: function () {
        // const map = playerState.getMap()
        // let range = cf.TOWER.tower[this.instance].stat[this.level].range;
        // if (map._mapController.intArray[this.mapPos.x][this.mapPos.y] === cf.MAP_CELL.BUFF_RANGE + cf.MAP_CELL.TOWER_ADDITIONAL) {
        //     range *= cf.MAP_BUFF.RANGE;
        // }
        let range = cf.TOWER.tower[this.instance].stat[this.level].range;
        if (this._playerState.rule === 1 && GameStateManagerInstance.playerA._map._mapController.intArray[this.mapPos.x][this.mapPos.y] === cf.MAP_CELL.BUFF_RANGE + cf.MAP_CELL.TOWER_ADDITIONAL || this._playerState.rule === 2 && GameStateManagerInstance.playerB._map._mapController.intArray[this.mapPos.x][this.mapPos.y] === cf.MAP_CELL.BUFF_RANGE + cf.MAP_CELL.TOWER_ADDITIONAL) {
            range *= cf.MAP_BUFF.RANGE;
        }
        return range;
    },

    /**
     * @returns {number} Khoảng thời gian (giây) giữa 2 lần bắn liên tiếp.
     */
    getAttackSpeed: function () {
        let attackSpeed = cf.TOWER.tower[this.instance].stat[this.level].attackSpeed / 1000;
        if (this._playerState.rule === 1 && GameStateManagerInstance.playerA._map._mapController.intArray[this.mapPos.x][this.mapPos.y] === cf.MAP_CELL.BUFF_ATTACK_SPEED + cf.MAP_CELL.TOWER_ADDITIONAL || this._playerState.rule === 2 && GameStateManagerInstance.playerB._map._mapController.intArray[this.mapPos.x][this.mapPos.y] === cf.MAP_CELL.BUFF_ATTACK_SPEED + cf.MAP_CELL.TOWER_ADDITIONAL) {
            attackSpeed /= cf.MAP_BUFF.ATTACK_SPEED;
        }
        return attackSpeed;
    },

    getDamage: function () {
        let damage = cf.TOWER.tower[this.instance].stat[this.level].damage;
        damage *= Math.pow(cf.STAT_MULTIPLIER_PER_LEVEL, this.correspondingCard.level - 1);
        if (this._playerState.rule === 1 && GameStateManagerInstance.playerA._map._mapController.intArray[this.mapPos.x][this.mapPos.y] === cf.MAP_CELL.BUFF_DAMAGE + cf.MAP_CELL.TOWER_ADDITIONAL || this._playerState.rule === 2 && GameStateManagerInstance.playerB._map._mapController.intArray[this.mapPos.x][this.mapPos.y] === cf.MAP_CELL.BUFF_DAMAGE + cf.MAP_CELL.TOWER_ADDITIONAL) {
            damage *= cf.MAP_BUFF.DAMAGE;
        }
        if (this.damageBuffEffect !== undefined) {
            damage *= (1 + this.damageBuffEffect.damageAdjustment);
        }
        return Math.floor(damage);
    },

    getBulletSpeed: function () {
        return cf.TOWER.tower[this.instance].stat[this.level].bulletSpeed;
    },

    getBulletRadius: function () {
        return cf.TOWER.tower[this.instance].stat[this.level].bulletRadius;
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
        if (this.currentTarget != null && !this.currentTarget.isDestroy && this.target.indexOf(this.currentTarget) !== -1 && "monster" === this.currentTarget.concept) {
            return this.currentTarget;
        }
        if (this.prioritizedTarget === undefined) {
            this.prioritizedTarget = cf.PRIORITIZED_TARGET.FULL_HP;
        }
        let record, index;
        if (this.currentTarget) {
            this.currentTarget.release()
        }

        switch (this.prioritizedTarget) {
            case cf.PRIORITIZED_TARGET.FULL_HP:
                record = -1;
                index = -1;
                for (let i = 0; i < this.target.length; i++) {
                    if ("monster" === this.target[i].concept && this.target[i].health > record) {
                        record = this.target[i].health;
                        index = i;
                    }
                }
                this.currentTarget = this.target[index];
                break;
            case cf.PRIORITIZED_TARGET.LOW_HP:
                record = 4000000000;
                index = -1;
                for (let i = 0; i < this.target.length; i++) {
                    if ("monster" === this.target[i].concept && this.target[i].health < record) {
                        record = this.target[i].health;
                        index = i;
                    }
                }
                this.currentTarget = this.target[index];
                break;
            case cf.PRIORITIZED_TARGET.FURTHEST:
                record = -1;
                index = -1;
                for (let i = 0; i < this.target.length; i++) {
                    if ("monster" === this.target[i].concept && this.target[i].position.sub(this.position).length() > record) {
                        record = this.target[i].position.sub(this.position).length();
                        index = i;
                    }
                }
                this.currentTarget = this.target[index];
                break;
            case cf.PRIORITIZED_TARGET.NEAREST:
                record = 4000000000;
                index = -1;
                for (let i = 0; i < this.target.length; i++) {
                    if ("monster" === this.target[i].concept && this.target[i].position.sub(this.position).length() < record) {
                        record = this.target[i].position.sub(this.position).length();
                        index = i;
                    }
                }
                this.currentTarget = this.target[index];
                break;
            default:
                this.currentTarget = this.target[0];
                break;
        }

        if (this.currentTarget) {
            this.currentTarget.retain()
        }

        return this.currentTarget;
    },

    changDirectionHandle: function (direction) {
        let dirs = [
            [10, 9, 8, 7, 6],
            [11, 12, 8, 7, 5],
            [12, 12, 0, 4, 4],
            [13, 12, 0, 3, 3],
            [14, 15, 0, 1, 2],
        ]
        direction.set(
            Math.max(Math.round(2.5 + direction.x * 2.5) - 1, 0),
            Math.max(0, Math.round(2.5 + direction.y * 2.5) - 1)
        );
        if (direction) {
            return dirs[direction.y][direction.x];
        }
        return null;
    },

    getNewBullet: function (object) {
        let speed = this.getBulletSpeed();
        let damage = this.getDamage();
        let radius = this.getBulletRadius();
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
            if (self.checkIsTarget(monster)) {
                if (self.getTargetType() === 'all' || self.getTargetType() === monster.class) {
                    self.target.push(monster);
                }
            }
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
                    for (let i = 0; i < this.target.length; i++) {
                        if ("monster" === this.target[i].concept) {
                            this.fire();
                            this.status = 'cooldowning';
                            this.attackCooldown = self.getAttackSpeed();
                            break;
                        }
                    }
                }
            } else {
                this.attackCooldown -= dt;
            }
        }

    },

    checkIsTarget: function (another) {
        return (another.concept === "monster" || another.concept === "tree");
    },

    destroy: function () {
        let index = convertMapPosToIndex(this.position);
        if (this.renderRule === 1) {
            GameStateManagerInstance.playerA.getMap()._mapController.intArray[index.x][index.y] -= cf.MAP_CELL.TOWER_ADDITIONAL;
        } else if (this.renderRule === 2) {
            GameStateManagerInstance.playerB.getMap()._mapController.intArray[index.x][index.y] -= cf.MAP_CELL.TOWER_ADDITIONAL;
        }

        this.isDestroy = true;
        if (this.getParent() != null) {
            this.getParent().getEnergyUI(cc.p(this.x, this.y), 5);
        }
        this.visible = false;
        if (this.fireFx !== undefined && this.fireFx != null) {
            this.fireFx.clearTrack(0);
            this.fireFx.removeFromParent(true);
        }
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
