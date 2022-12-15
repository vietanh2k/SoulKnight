TIME_PER_HEAL = 0.1;

const FLOAT_THRESHOLD = 0.04

const Monster = AnimatedSprite.extend({
    ctor: function (type, playerState) {
        this._super(res.m1);
        this._playerState = playerState
        this.isDestroy = false
        this.initAnimation()
        this.setScale(1.2)
        this.active = true
        this.visible = true

        this.mapId = -1
        this.isChosen = false
        this.timeHealBuff = 0
        this.numHealBuff = 0
        this.sumHealDt = 0;
        this.timeSpeedUpBuff = 0
        this.rateSpeedUpBuff = 1
        this.renderRule = this._playerState.rule

        const startCell = playerState.getMap().getStartCell()
        this.position = new Vec2(startCell.getEdgePositionWithNextCell().x, startCell.getEdgePositionWithNextCell().y)
        this.prevPosition = new Vec2(startCell.getCenterPosition().x,startCell.getCenterPosition().y)

        this.concept="monster"
        this.healthUI = null

        this.initConfig(playerState)
        this.addHealthUI()

        this.impactedMonster = null
        this.pointToAvoidBlockingMonster = null
        this.avoidMonsterStage = 0

        this.recoverHpFx = new sp.SkeletonAnimation(res.heal_fx_json, res.heal_fx_atlas)
        this.recoverHpFx.visible = false
        this.recoverHpFx.opacity = 64
        this.addChild(this.recoverHpFx)

        this.tempTargetPosition = new Vec2(0,0)
        this.targetPosition = null
        this.impactVec = new Vec2(0,0)
        this.movingDirection = new Vec2(0,0)
        this.transformMat = new Mat3()
        this.impactCenter = new Vec2(0,0)
        this.impactMonsters = new UnorderedList()
        this.impactDirection = null

        return true;
    },

    initFromConfig: function (playerState, config) {
        this.speed = config.speed * MAP_CONFIG.CELL_WIDTH
        this.class = config.class
        this.health = config.hp
        this.MaxHealth = config.hp
        this.energyFromDestroy = config.gainEnergy

        this.category = config.category
        if (config.category === 'boss') {
            this.energyWhileImpactMainTower = 5
        } else {
            this.energyWhileImpactMainTower = 1
        }

        this.weight = config.weight
        this.hitRadius = config.hitRadius * MAP_CONFIG.CELL_WIDTH
    },

    initConfig: function (playerState) {
        this.initFromConfig(playerState)
    },

    initAnimation: function (){
        /*const moveDownAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 0, 11, 1)
        const moveDownRightAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 12, 23, 1)
        const moveRightAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 24, 35, 1)
        const moveUpRightAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 36, 47, 1)
        const moveUpAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 48, 59, 1)
        const moveUpLeftAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_up_left (%d).png', 1, 12, 1)
        const moveLeftAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_left (%d).png', 1, 12, 1)
        const moveDownLeftAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_down_left (%d).png', 1, 12, 1)

        this.animationIds = [
            [ moveDownLeftAnimId,       moveDownAnimId,          moveDownRightAnimId ],
            [ moveLeftAnimId,           moveUpAnimId,            moveRightAnimId     ],
            [ moveUpLeftAnimId,         moveUpAnimId,            moveUpRightAnimId   ],
        ]
        this.play(0)*/
    },


    /**      _
     *   .       .
     * .           .
     * .           . ----> direction
     *   .       .
     *       -
     *       |
     *       |
     *       v
     *       right side point
     * */
    // direction must be normalized
    getRightSidePoint: function (direction, radius) {
        const rotate = this.transformMat.setRotation(-Math.PI / 2.0)
        return this.position.add(rotate.mul(direction).normalize().mul(radius))
    },

    // direction must be normalized
    getLeftSidePoint: function (direction, radius) {
        const rotate = new Mat3().setRotation(Math.PI / 2.0)
        return this.position.add(rotate.mul(direction).normalize().mul(radius))
    },

    getForwardSidePoint: function (direction, radius) {
        return this.position.add(direction.mul(radius))
    },

    getForwardTangent: function (center, direction) {
        const rotate = this.transformMat.setRotation(-Math.PI / 2.0)
        const dir = this.position.sub(center).normalize()
        const ret = rotate.mul(dir).normalize()

        if (direction.dot(ret) < 0.0) {
            ret.set(-ret.x, -ret.y)
        }

        return ret
    },

    calculateImpactCenter: function (playerState) {
        const map = playerState.getMap()
        const self = this
        let sum = new Vec2(0,0)
        //cc.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        this.impactMonsters.forEach((monster, id, list) => {
            //cc.log("calculateImpactCenter --> " + id)
            const vec = monster.position.sub(self.position)
            const dir = vec.normal()

            if (monster.isDestroy || dir.dot(monster.movingDirection) < -0.9 || vec.length() > monster.hitRadius + self.hitRadius + MAP_CONFIG.CELL_WIDTH / 4.0) {
                list.remove(id)
                monster.release()
                //cc.log("Remove --> " + id)
                return
            }

            sum = sum.add(monster.position)
        })
       // cc.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")

        if (this.impactMonsters.size() !== 0) {
            sum = sum.div(this.impactMonsters.size())
        } else {
            sum.set(0,0)
        }
        return sum
    },

    calculateImpactDirection: function () {
        let sum = new Vec2(0,0)
        this.impactMonsters.forEach((monster, id, list) => {
            sum = sum.add(monster.movingDirection)
        })

        if (this.impactMonsters.size() !== 0) {
            sum = sum.div(this.impactMonsters.size())
        } else {
            sum.set(0,0)
        }
        return sum
    },

    debug: function (map) {
        const currentCell = map.getCellAtPosition(this.position);
        if (currentCell == null || currentCell.getEdgePositionWithNextCell() == null) {
            this._playerState.updateHealth(-this.energyWhileImpactMainTower)
            cc.log('destroy hp house = '+GameStateManagerInstance.frameCount)
            this.destroy()


            /*while (true) {
                const c = map.getCellAtPosition(this.position);
                let x = 0
                x++
            }*/
        }
    },

    isAtLocation: function (map, loc) {

        const currentCell = map.getCellAtPosition(this.position);
        // cc.log('222222222222:'+currentCell.getLocation().x+''+currentCell.getLocation().y)
        // cc.log('333333333333:'+loc.x+''+loc.y)
        if (currentCell != null) {
            var curLoc = currentCell.getLocation();
            if(curLoc.x == loc.x && curLoc.y == loc.y-1){
                cc.log('trueeeeeeee')
                return true;
            }
        }
        // cc.log('falseeeeeeeeee')
        return false;
    },

    updateHealDuration:function (dt){
        this.sumHealDt += dt;
        while (this.sumHealDt > TIME_PER_HEAL) {
            this.sumHealDt -= TIME_PER_HEAL
            if(this.timeHealBuff > 0){
                this.timeHealBuff -= TIME_PER_HEAL;
                this.recoverHp(this.numHealBuff)
                this.hurtUI()
            }
        }
    },


    getHealBuffState:function (timeHealBuff, numHealBuff){
        this.timeHealBuff = timeHealBuff;
        this.numHealBuff = numHealBuff;
    },

    updateSpeedUpDuration:function (dt){

        if(this.timeSpeedUpBuff > 0){
            this.timeSpeedUpBuff -= dt;
        }else {
            this.rateSpeedUpBuff = 1;
        }

    },

    getSpeedUpState:function (timeSpeedUpBuff, rateSpeedUpBuff){
        this.timeSpeedUpBuff = timeSpeedUpBuff;
        this.rateSpeedUpBuff = rateSpeedUpBuff;
    },

    logicUpdate: function (playerState, dt){
        if(this.health<=0){
            this.destroy();
            return;
        }
        if(this.timeHealBuff > 0) {
            this.updateHealDuration(dt);
        }
        this.updateSpeedUpDuration(dt);




        if (this.poisonByTOilGunDuration !== undefined && this.poisonByTOilGunDuration > 0) {
            let dtPoison = Math.min(dt, this.poisonByTOilGunDuration);
            this.takeDamage(playerState, this.poisonByTOilGunDps * dtPoison);
            this.hurtUI();
            this.poisonByTOilGunDuration -= dtPoison;
        }

        /*if (this.impactedMonster) {
            if (this.impactedMonster.isDestroy) {
                this.targetPosition = null
                this.impactedMonster = null
            } else if (this.speed > this.impactedMonster.speed && this.avoidMonsterStage < 2) {
                //const forwardDir = this.position.sub(this.prevPosition).normalize()
                //this.pointToAvoidBlockingMonster = this.impactedMonster.getRightSidePoint(forwardDir, this.hitRadius + this.impactedMonster.hitRadius)
                const rotate = new Mat3().setRotation(Math.PI / 2.0)
                const rDir = this.position.sub(this.impactedMonster.position).normalize()
                const tangent = rotate.mul(rDir)
                this.targetPosition = this.position.add(tangent.mul(this.speed * (dt)))
                this.avoidMonsterStage = 1
            }

            if (this.impactedMonster && this.speed <= this.impactedMonster.speed) {
                this.targetPosition = null
                this.impactedMonster = null
            }
        }*/

        this.prevPosition.set(this.position.x, this.position.y)

        let distance = 0;
        if (this.freezeByTIceGunDuration !== undefined && this.freezeByTIceGunDuration > 0) {
            let dtFreeze = Math.min(dt, this.freezeByTIceGunDuration);
            dt -= dtFreeze;
            this.freezeByTIceGunDuration -= dtFreeze;
            if (this.freezeByTIceGunDuration <= 0) {
                this.freezeByTIceGunDuration = 0;
                this.isVulnerableByTIceGun = false;
            }
            if (this.slowDuration !== undefined && this.slowDuration > 0) {
                this.slowDuration -= dtFreeze;
                if (this.slowDuration < 0) {
                    this.slowDuration = 0;
                }
            }
            if (this.stunDuration !== undefined && this.stunDuration > 0) {
                this.stunDuration -= dtFreeze;
                if (this.stunDuration < 0) {
                    this.stunDuration = 0;
                }
            }
        }
        if (this.stunDuration !== undefined && this.stunDuration > 0) {
            let dtStun = Math.min(dt, this.stunDuration);
            dt -= dtStun;
            this.stunDuration -= dtStun;
            if (this.slowDuration !== undefined && this.slowDuration > 0) {
                this.slowDuration -= dtStun;
                if (this.slowDuration < 0) {
                    this.slowDuration = 0;
                }
            }
            if (this.freezeByTIceGunDuration !== undefined && this.freezeByTIceGunDuration > 0) {
                this.freezeByTIceGunDuration -= dtStun;
                if (this.freezeByTIceGunDuration <= 0) {
                    this.freezeByTIceGunDuration = 0;
                    this.isVulnerableByTIceGun = false;
                }
            }
        }
        if (this.speedReduced !== undefined && this.slowDuration !== undefined && this.slowDuration > 0) {
            let dtSlow = Math.min(dt, this.slowDuration);
            dt -= dtSlow;
            this.slowDuration -= dtSlow;
            distance += (this.speed - this.speedReduced) * dtSlow;
        }
        distance += this.speed * dt;
        distance *= this.rateSpeedUpBuff;

        this.targetPosition = null
        if (this.impactMonsters.size() !== 0) {
            this.impactCenter = this.calculateImpactCenter(playerState)
            this.impactDirection = this.calculateImpactDirection()

            if (!this.impactCenter.isZero() && !this.impactDirection.isZero()) {
                this.impactVec = this.getForwardTangent(this.impactCenter, this.impactDirection).normalize()
                this.tempTargetPosition = this.position.add(this.impactVec.mul(distance))
                this.targetPosition = this.tempTargetPosition
            }
        }

        const map = playerState.getMap()

        if (this.targetPosition) {
            //const cell = map.getCellAtPosition(this.targetPosition)
            //if (!cell || cell.nextCell == null) {
            //    distance = 0.5
            //    this.targetPosition = null
            //    //cc.log('=====================================')
            //}

            const pos = this.position
            const r = this.hitRadius
            const cells = map.queryCellsOverlap(pos, r)

            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i]
                if (!cell || !cell.nextCell) {
                    distance = 0.0
                    this.targetPosition = null
                    break
                }
            }
        }

        if (this.route(map, distance, null)) {
            //this.destroy()

            if (!this.targetPosition) this.debug(map)
        }

        if (!this.position.isApprox(this.prevPosition)) {
            this.movingDirection = this.position.sub(this.prevPosition).normalize()
        }

        /*if (this.targetPosition && this.position.isApprox(this.targetPosition)) {
            this.targetPosition = null
        }

        if (this.impactedMonster) {
            if (!Circle.isCirclesOverlapped(this.impactedMonster.position, this.impactedMonster.hitRadius, this.position, this.hitRadius)) {
                this.targetPosition = null
                this.impactedMonster = null
            } else {
                const forwardDir = this.position.sub(this.prevPosition).normalize()
                const tPos = this.getTargetPositionFromMap(map, null)
                let rDir = tPos.sub(this.position).normalize()

                if (forwardDir.dot(rDir) > 0) {
                    this.targetPosition = null
                    this.impactedMonster = null
                }
            }
        }*/

        //this.debug(map)
    },

    getTargetPositionFromMap: function (map, prevCell) {
        let currentCell = map.getCellAtPosition(this.position);
        if (currentCell == null) return null;

        if (currentCell === prevCell) {
            currentCell = currentCell.getNextCell()
        }

        if (currentCell == null) return null;

        let ret = currentCell.getEdgePositionWithNextCell();

        // corner movement
        const next = currentCell.getNextCell();
        if (next) {
            const relPos = this.position.sub(currentCell.getCenterPosition());
            const dir = relPos.normal();
            const outDir =  next.getCenterPosition().sub(currentCell.getCenterPosition()).normalize();

            dir.set(Math.round(dir.x), Math.round((dir.y)))
            outDir.set(Math.round(outDir.x), Math.round((outDir.y)))

            if (!outDir.equals(dir)) {
                if (Math.abs(relPos.x) <= MAP_CONFIG.CELL_WIDTH / 4.0 && Math.abs(relPos.y) <= MAP_CONFIG.CELL_HEIGHT / 4.0) {
                    ret = currentCell.getCornerCellOutPos();
                } else {
                    //dir.set(-dir.x, -dir.y)
                    ret = currentCell.getCenterPosition().add(dir.mul(MAP_CONFIG.HALF_CELL_DIMENSIONS_OFFSET[dir.y + 1][dir.x + 1] / 2.0));
                }
            }
        }

        if (ret == null) return null;

        return ret
    },

    route: function (map, distance, prevCell) {
        let currentCell = map.getCellAtPosition(this.position);

        if (!currentCell) return true;

        if (currentCell === prevCell) {
            currentCell = currentCell.getNextCell()
        }

        if (!currentCell) return true;

        let targetPosition = null
        if (this.targetPosition) {
            targetPosition = this.targetPosition
        } else {
            targetPosition = this.getTargetPositionFromMap(map, prevCell)
            if (targetPosition == null) return true;
        }

        const direction = targetPosition.sub(this.position);
        const length = direction.length();
        direction.x /= length;
        direction.y /= length;

        if (length < distance) {
            const remain = distance - length;
            this.position.set(targetPosition.x, targetPosition.y, currentCell);

            if (this.targetPosition) return true;

            return this.route(map, remain, currentCell);
        }

        const lastPos = this.position.add(direction.mul(distance));
        this.position.set(lastPos.x, lastPos.y);

        return true
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

            this.healthUI.setPosition(this.width / 2.0, this.height * 1.0)


        if (dir && this.currentAnimationId !== -1) {
            const v = this.animationIds[dir.y +1]
            if (v) this.play(v[dir.x +1])
        }

        if (this.recoverHpFx.visible === true) {
            this.recoverHpFx.setPosition(this.width / 2.0, this.height / 2.0)
        }
    },

    addHealthUI: function () {
        this.healthUI = ccs.load(res.healthMonster, "").node;
        this.healthUI.opacity = 0

        this.healthUI.setScale(0.3)
        this.addChild(this.healthUI)
    },
    hurtUI: function () {
        this.healthUI.stopAllActions()
        var percen = this.health / this.MaxHealth*100
        if(percen < 0) {
            return;
            // percen = 0;
        }
        this.healthUI.getChildByName('loading').setPercent(percen)
        var seq = cc.sequence(cc.fadeIn(0), cc.delayTime(2),cc.fadeOut(0.6))
        this.healthUI.runAction(seq)
    },

    destroy: function () {
        this._playerState.updateEnergy(this.energyFromDestroy)
        this.isDestroy = true
        cc.log('destroy tai frame = '+GameStateManagerInstance.frameCount)
        if(this.getParent() != null){
            this.getParent().getEnergyUI(cc.p(this.x, this.y), this.energyFromDestroy)
            var ex = new Explosion(cc.p(this.x, this.y))
            var soul = new SoulFly(cc.p(this.x, this.y))
            this.getParent().addChild(ex)
            this.getParent().addChild(soul)
        }
        this.visible = false;
        // var ex = new Explosion()
        // ex.setPosition(300, 500)
        // this.addChild(ex, 5000)
        this.removeFromParent(true)
        this.animationCleanup()
    },

    takeDamage: function (playerState, many, from) {
        let multiplier = 1;
        if (this.isVulnerableByTIceGun) {
            multiplier *= 1.5;
        }
        this.health = Math.max(this.health - many * multiplier, 0)
        if (this.health > this.MaxHealth) {
            this.health = this.MaxHealth;
        }
    },

    stun: function (duration) {
        this.stunDuration = duration;
    },

    freezeByTIceGun: function (duration, bulletIsLevelThree) {
        this.freezeByTIceGunDuration = duration;
        if (bulletIsLevelThree) {
            this.isVulnerableByTIceGun = true;
        }
    },

    poisonByTOilGun: function (dps, duration) {
        this.poisonByTOilGunDuration = duration;
        this.poisonByTOilGunDps = dps;
    },

    slow: function (speedReduced, duration) {
        this.speedReduced = speedReduced;
        this.slowDuration = duration;
    },

    recoverHp: function (many) {
        many = Math.floor(many)
        this.health = Math.min(this.health + many, this.MaxHealth)

        if (this.recoverHpFx.visible === false) {
            const self = this
            this.recoverHpFx.visible = true
            this.recoverHpFx.setAnimation(0, 'fx_heal', false)
            this.recoverHpFx.setCompleteListener(() => {
                self.recoverHpFx.visible = false
                self.recoverHpFx.setCompleteListener(null)
            })
        }
    },

    onImpact: function (playerState, anotherMonster) {
        /*this.impactedMonster = anotherMonster
        this.avoidMonsterStage = 0
        //cc.log("onImpact")

        const tPos = this.getTargetPositionFromMap(playerState.getMap(), null)

        if (tPos) {
            let tDir = tPos.sub(this.position).normalize()

            let rDir = this.impactedMonster.position.sub(this.position).normalize()

            if (rDir.dot(tDir) < 0) {
                this.targetPosition = null
                this.impactedMonster = null
            }
        }*/
        if (this.speed <= anotherMonster.speed) return
        //if (this.impactMonsters.size() >= 2) return
        //if (this.position.sub(anotherMonster.position).length() <= this.hitRadius + anotherMonster.hitRadius) {
        //    let dir = this.position.sub(anotherMonster.position).normalize()
        //    const pos = anotherMonster.position.add(dir.mul(this.hitRadius + anotherMonster.hitRadius))
        //    this.position.set(pos.x, pos.y)
        //}

        //const tangent = anotherMonster.getForwardTangent(this.position)
        //this.impactVec = this.impactVec.add(tangent).normalize();

        const map = playerState.getMap()

        let dir1 = this.position.sub(anotherMonster.position).normalize()
        const pos = anotherMonster.position.add(dir1.mul(this.hitRadius + anotherMonster.hitRadius))
        const cell = map.getCellAtPosition(pos)
        if (cell && cell.nextCell) {
            this.position.set(pos.x, pos.y)
        }

        const dir = anotherMonster.position.sub(this.position).normalize()
        if (dir.dot(anotherMonster.movingDirection) < -0.9) {
            return
        }

        /*const dir = anotherMonster.position.sub(this.position).normalize()
        if (dir.dot(this.movingDirection) < -FLOAT_THRESHOLD) {
            return
        }*/

        if (this.impactMonsters.indexOf(anotherMonster) === -1) {
            this.impactMonsters.add(anotherMonster)
            anotherMonster.retain()
        }
    },

});
