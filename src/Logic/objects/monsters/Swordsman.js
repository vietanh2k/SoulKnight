const Swordsman = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.SWORDSMAN]
        this.initFromConfig(playerState, config)
    },

    initAnimation: function () {
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

        this.play(1)
    }
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.SWORDSMAN, "swordsman", false, function (playerState) {
    const ret = new Swordsman(0, playerState)
    return ret
})