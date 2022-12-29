const darkGiantFakeFindTargets = function (playerState) {
    const darkGiant = []
    this.target = [];
    const self = this;
    const map = playerState.getMap()

    const enemies = map.queryEnemiesCircle(this.position, this.getRange() * MAP_CONFIG.CELL_WIDTH)
    enemies.forEach((monster, id, list) => {
        if (monster.constructor === DarkGiant) {
            darkGiant.push(monster)
            //cc.log("=================================DARK_GIANT===================================================")
        }

        self.target.push(monster)
        //cc.log("=================================MONSTERS===================================================")
    })

    if (darkGiant.length !== 0) {
        this.currentTarget = darkGiant[0]
        this.target.length = 0
        this.target = [...darkGiant]
    }
}

const DarkGiant = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.DARK_GIANT]
        this.initFromConfig(playerState, config)

        this.towers = []
        this.towersFindTargets = []
    },

    initAnimation: function (playerState) {
        const duration = 1.2
        const moveDownAnimId = this.load(res.dark_giant_plist, 'monster_dark_giant_run_%04d.png', 0, 13, duration)
        const moveDownRightAnimId = this.load(res.dark_giant_plist, 'monster_dark_giant_run_%04d.png', 14, 27, duration)
        const moveRightAnimId = this.load(res.dark_giant_plist, 'monster_dark_giant_run_%04d.png', 28, 41, duration)
        const moveUpRightAnimId = this.load(res.dark_giant_plist, 'monster_dark_giant_run_%04d.png', 42, 55, duration)
        const moveUpAnimId = this.load(res.dark_giant_plist, 'monster_dark_giant_run_%04d.png', 56, 69, duration)
        const moveUpLeftAnimId = this.load(res.dark_giant_plist, 'monster_dark_giant_run_flip (%d).png', 1, 14, duration)
        const moveLeftAnimId = this.load(res.dark_giant_plist, 'monster_dark_giant_run_flip (%d).png', 15, 28, duration)
        const moveDownLeftAnimId = this.load(res.dark_giant_plist, 'monster_dark_giant_run_flip (%d).png', 29, 42, duration)


        this.animationIds = [
            [ moveUpLeftAnimId,       moveDownAnimId,          moveDownRightAnimId ],
            [ moveLeftAnimId,           moveUpAnimId,            moveRightAnimId     ],
            [ moveDownLeftAnimId,         moveUpAnimId,            moveUpRightAnimId   ],
        ]
        this.play(0)
    },

    logicUpdate: function (playerState, dt) {
        const self = this

        this.towers.forEach((tower, i, list) => {
            tower.findTargets = self.towersFindTargets[i]
            tower.release()
        })
        this.towers.length = 0
        this.towersFindTargets.length = 0

        const allTowers = playerState.getMap().towers
        allTowers.forEach((tower, i, list) => {
            tower.retain()
            self.towers.push(tower)
            self.towersFindTargets.push(tower.findTargets)
            tower.findTargets = darkGiantFakeFindTargets
        })

        this._super(playerState, dt)
    },

    destroy: function () {
        const self = this

        this.towers.forEach((tower, i, list) => {
            tower.findTargets = self.towersFindTargets[i]
            tower.release()
        })
        this.towers.length = 0
        this.towersFindTargets.length = 0

        this._super()
    },
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.DARK_GIANT, "darkGiant", false, function (playerState) {
    return new DarkGiant(MONSTER_ID.DARK_GIANT, playerState)
})