const Giant = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.GIANT]
        this.initFromConfig(playerState, config)
    },

    initAnimation: function () {
        const duration = 1.3
        const moveDownAnimId = this.load(res.giant_plist, 'monster_giant_run_%04d.png', 0, 15, duration)
        const moveDownRightAnimId = this.load(res.giant_plist, 'monster_giant_run_%04d.png', 16, 31, duration)
        const moveRightAnimId = this.load(res.giant_plist, 'monster_giant_run_%04d.png', 32, 47, duration)
        const moveUpRightAnimId = this.load(res.giant_plist, 'monster_giant_run_%04d.png', 48, 63, duration)
        const moveUpAnimId = this.load(res.giant_plist, 'monster_giant_run_%04d.png', 64, 79, duration)
        const moveUpLeftAnimId = this.load(res.giant_plist, 'monster_giant_run_flipped (%d).png', 1, 16, duration)
        const moveLeftAnimId = this.load(res.giant_plist, 'monster_giant_run_flipped (%d).png', 17, 32, duration)
        const moveDownLeftAnimId = this.load(res.giant_plist, 'monster_giant_run_flipped (%d).png', 33, 48, duration)

        this.animationIds = [
            [ moveUpLeftAnimId,       moveDownAnimId,          moveDownRightAnimId ],
            [ moveLeftAnimId,           moveUpAnimId,            moveRightAnimId     ],
            [ moveDownLeftAnimId,         moveUpAnimId,            moveUpRightAnimId   ],
        ]

        this.play(0)
    }
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.GIANT, "giant", false, function (playerState) {
    const ret = new Giant(0, playerState)
    return ret
})