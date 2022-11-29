const Bat = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.BAT]
        this.initFromConfig(playerState, config)

        const map = playerState.getMap()
        //this.position.set(map.gateCell.position.x, map.gateCell.position.y)
        const lastCell = map.cells[MAP_CONFIG.MAP_WIDTH - 1][MAP_CONFIG.MAP_HEIGHT - 1]
        this._route = new Route([
            new Vec2(0 + MAP_CONFIG.CELL_HALF_WIDTH + MAP_CONFIG.CELL_HALF_WIDTH / 2.0,  -MAP_CONFIG.CELL_HEIGHT + MAP_CONFIG.CELL_HALF_HEIGHT),
            new Vec2(0 + MAP_CONFIG.CELL_HALF_WIDTH,  -MAP_CONFIG.CELL_HEIGHT + MAP_CONFIG.CELL_HALF_HEIGHT + MAP_CONFIG.CELL_HALF_HEIGHT / 2.0),
            new Vec2(0 + MAP_CONFIG.CELL_HALF_WIDTH,                                0 + MAP_CONFIG.CELL_HALF_HEIGHT),
            new Vec2(4 * MAP_CONFIG.CELL_WIDTH + MAP_CONFIG.CELL_HALF_WIDTH,        4 * MAP_CONFIG.CELL_HEIGHT + MAP_CONFIG.CELL_HALF_HEIGHT),
            new Vec2(lastCell.getEdgePositionWithNextCell().x, lastCell.getEdgePositionWithNextCell().y),
        ])
        this._routePardId = -1
    },

    initAnimation: function () {
        const duration = 0.5
        const moveDownAnimId = this.load(res.bat_plist, 'monster_bat_run_%04d.png', 0, 7, duration)
        const moveDownRightAnimId = this.load(res.bat_plist, 'monster_bat_run_%04d.png', 8, 15, duration)
        const moveRightAnimId = this.load(res.bat_plist, 'monster_bat_run_%04d.png', 16, 23, duration)
        const moveUpRightAnimId = this.load(res.bat_plist, 'monster_bat_run_%04d.png', 24, 31, duration)
        const moveUpAnimId = this.load(res.bat_plist, 'monster_bat_run_%04d.png', 32, 39, duration)
        const moveUpLeftAnimId = this.load(res.bat_plist, 'monster_bat_run_flip (%d).png', 1, 8, duration)
        const moveLeftAnimId = this.load(res.bat_plist, 'monster_bat_run_flip (%d).png', 9, 16, duration)
        const moveDownLeftAnimId = this.load(res.bat_plist, 'monster_bat_run_flip (%d).png', 17, 24, duration)

        this.animationIds = [
            [ moveUpLeftAnimId,       moveDownAnimId,          moveDownRightAnimId ],
            [ moveLeftAnimId,           moveUpAnimId,            moveRightAnimId     ],
            [ moveDownLeftAnimId,         moveUpAnimId,            moveUpRightAnimId   ],
        ]

        this.play(0)
    },

    route: function (map, distance, prevCell) {
        this._routePardId = this._route.drive(this._routePardId, this.position, distance)
        if (this._routePardId === this._route.points.length - 1) {
            this._playerState.updateHealth(-this.energyWhileImpactMainTower)
            this.destroy()
            return false
        }

        return false
    },

    render: function (playerState) {
        this.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + winSize.height)
        this._super(playerState)
    }
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.BAT, "bat", false, function (playerState) {
    const ret = new Bat(0, playerState)
    return ret
})