const darkGiantFakeFindTargets = function (playerState) {
    const darkGiant = []
    this.target = [];
    const self = this;

    this.___originalFindTarget(playerState)
    const enemies = this.target
    enemies.forEach((monster, id, list) => {
        if (monster.constructor === DarkGiant) {
            darkGiant.push(monster)
            //cc.log("=================================DARK_GIANT===================================================")
        }
        //cc.log("=================================MONSTERS===================================================")
    })

    if (darkGiant.length !== 0) {
        this.target.length = 0
        this.target = [...darkGiant]
    }
}

const DarkGiant = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.DARK_GIANT]
        this.initFromConfig(playerState, config)

        this.towers = []
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
            if (tower.findTargets === darkGiantFakeFindTargets) {
                tower.findTargets = tower.___originalFindTarget
            }

            tower.release()
        })
        this.towers.length = 0

        const allTowers = playerState.getMap().towers
        allTowers.forEach((tower, i, list) => {
            tower.retain()
            self.towers.push(tower)
            if (tower.findTargets !== darkGiantFakeFindTargets) {
                tower.___originalFindTarget = tower.findTargets
                tower.findTargets = darkGiantFakeFindTargets
            }
        })

        this._super(playerState, dt)
    },

    destroy: function () {
        const self = this

        this.towers.forEach((tower, i, list) => {
            if (tower.findTargets === darkGiantFakeFindTargets) {
                tower.findTargets = tower.___originalFindTarget
            }
            tower.release()
        })
        this.towers.length = 0

        this._super()
    },
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.DARK_GIANT, "darkGiant", false, function (playerState) {
    return new DarkGiant(MONSTER_ID.DARK_GIANT, playerState)
})