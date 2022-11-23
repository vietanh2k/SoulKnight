const Monster = AnimatedSprite.extend({
    ctor: function (type, playerState) {
        this._super(res.m1);
        this._playerState = playerState
        this.isDestroy = false
        this.initAnimation()
        this.active = true
        this.visible = true
        this.energyFromDestroy = 6
        this.renderRule = this._playerState.rule

        this.position = new Vec2(MAP_CONFIG.CELL_WIDTH / 2.0, MAP_CONFIG.CELL_HEIGHT / 2.0)
        this.prevPosition = new Vec2(0,0)
        this.speed = 30.0
        this.concept="monster"
        this.health = 30;
        this.MaxHealth = 30;
        this.healthUI = null
        this.addHealthUI()

        return true;
    },

    initAnimation: function (){
        const moveDownAnimId = this.load(res.Swordman_plist, 'monster_swordsman_run_%04d.png', 0, 11, 1)
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
        this.play(0)
    },

    debug: function (map) {
        const currentCell = map.getCellAtPosition(this.position);
        if (currentCell == null || currentCell.getEdgePositionWithNextCell() == null) {
            this._playerState.updateHealth(-1)
            cc.log('destroy')
            this.destroy()


            /*while (true) {
                const c = map.getCellAtPosition(this.position);
                let x = 0
                x++
            }*/
        }
    },

    logicUpdate: function (playerState, dt){
        if(this.health<=0){
            this.destroy();
            return;
        }
        this.prevPosition.set(this.position.x, this.position.y)

        const map = playerState.getMap()
        const distance = this.speed * dt
        this.route(map, distance, null)

        this.debug(map)
    },

    route: function (map, distance, prevCell) {
        let currentCell = map.getCellAtPosition(this.position);

        if (currentCell == null) return;

        if (currentCell === prevCell) {
            currentCell = currentCell.getNextCell()
        }

        if (currentCell == null) return;

        const targetPosition = currentCell.getEdgePositionWithNextCell();

        if (targetPosition == null) return;

        const direction = targetPosition.sub(this.position);
        const length = direction.length();
        direction.x /= length;
        direction.y /= length;

        if (length < distance) {
            const remain = distance - length;
            this.position.set(targetPosition.x, targetPosition.y, currentCell);
            this.route(map, remain, currentCell);
            return;
        }

        const lastPos = this.position.add(direction.mul(distance));
        this.position.set(lastPos.x, lastPos.y);
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
            const v = this.animationIds[dir.y +1]
            if (v) this.play(v[dir.x +1])
        }
    },

    addHealthUI: function () {
        this.healthUI = ccs.load(res.healthMonster, "").node;
        this.healthUI.opacity = 0
        this.healthUI.setScale(0.3)
        this.healthUI.setPosition(CELLWIDTH*0.73,CELLWIDTH*1.25)
        this.addChild(this.healthUI)
    },
    hurtUI: function () {
        this.healthUI.stopAllActions()
        var percen = this.health / this.MaxHealth*100
        this.healthUI.getChildByName('loading').setPercent(percen)
        var seq = cc.sequence(cc.fadeIn(0), cc.delayTime(2),cc.fadeOut(0.6))
        this.healthUI.runAction(seq)
    },

    destroy: function () {
        this._playerState.updateEnergy(this.energyFromDestroy)
        this.isDestroy = true
        if(this.getParent() != null){
            this.getParent().getEnergyUI(cc.p(this.x, this.y), this.energyFromDestroy)
            var ex = new Explosion(cc.p(this.x, this.y))
            this.getParent().addChild(ex)
        }
        this.visible = false;
        // var ex = new Explosion()
        // ex.setPosition(300, 500)
        // this.addChild(ex, 5000)
        this.removeFromParent(true)
    },

});



MonsterFactory.prototype.addMonsterInitializer(0, "swordsman", false, function () {
    return null
})
