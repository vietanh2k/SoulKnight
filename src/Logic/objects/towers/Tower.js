var Tower = TowerUI.extend({

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
            if (this.fire_fx != null) {
                this.fire_fx.setPosition(this.x, this.y);
            }
        }

        if (this.renderRule === 1) {
            if (this.lastStatus === undefined || this.status !== this.lastStatus || (this.newDir !== undefined && this.newDir != null && this.newDir !== this.lastDir)) {
                if (this.status === 'idle') {
                    this.updateDirection(this.newDir);
                } else {
                    this.playAttack(this.newDir);
                    this.status = 'idle';
                }

                this.lastDir = this.newDir;
                this.lastStatus = this.status;
            }
        } else {
            if (this.lastStatus === undefined || this.status !== this.lastStatus || this.newDir !== undefined && this.newDir != null && this.newDir !== this.lastDir) {
                let dir = (this.newDir + 8) % 16;
                if (this.status === 'idle') {
                    this.updateDirection(dir);
                } else {
                    this.playAttack(dir);
                    this.status = 'idle';
                }
                this.lastDir = this.newDir;
                this.lastStatus = this.status;
            }
        }
    },

    getAttackSpeed: function () {
        return cf.TOWER.tower[this.instance].stat[this.level].attackSpeed / 1000;
    },

    getPending: function () {
        return this.pendingSecond;
    },

    resetPending: function () {
        this.pendingSecond = cf.TOWER.buildingTime / 1000;
    },

    updatePending: function (dt) {
        if (this.pendingSecond > 0) {
            this.pendingSecond -= dt;
        }
    },

    fire: function () {
        if (this.target.length > 0) {
            let bullet = this.getNewBullet(this.target[0]);
            this.map.addNewBullet(bullet);
            let direction = this.target[0].position.sub(this.position).normalize();
            this.newDir = this.changDirectionHandle(direction);
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
        return new Bullet(object, speed, damage, radius, position);
    },

    logicUpdate: function (playerState, dt) {
        if (this.health <= 0) {
            this.active = false;
        }
        this.status = 'idle';
        if (this.active) {
            if (this.getPending() > 0) {
                this.updatePending(dt);
            } else {
                this.visible = true;
                this.target = [];
                let self = this;
                const map = playerState.getMap()
                map.getObjectInRange(self.position, self.getRange()).map(function (obj) {
                    if (self.checkIsTarget(obj)) {
                        self.target.push(obj);
                    }
                });
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
        this.active = false;
    },

    upgrade: function (card) {
        if (this.level === 3) {
            if (this.renderRule === 1) {
                Utils.addToastToRunningScene('Đã đạt cấp tiến hóa tối đa!');
            }
            return false;
        }

        this.level += 1;
        setTimeout(() => {
            this.evolute()
        }, 1000);
        return true;
    },
});
