const Assassin = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.ASSASSIN]
        this.initFromConfig(playerState, config)
    },

    initAnimation: function () {
        const duration = 0.6
        const moveDownAnimId = this.load(res.assassin_plist, 'monster_assassin_run_%04d.png', 0, 9, duration)
        const moveDownRightAnimId = this.load(res.assassin_plist, 'monster_assassin_run_%04d.png', 10, 19, duration)
        const moveRightAnimId = this.load(res.assassin_plist, 'monster_assassin_run_%04d.png', 20, 29, duration)
        const moveUpRightAnimId = this.load(res.assassin_plist, 'monster_assassin_run_%04d.png', 30, 39, duration)
        const moveUpAnimId = this.load(res.assassin_plist, 'monster_assassin_run_%04d.png', 40, 49, duration)
        const moveUpLeftAnimId = this.load(res.assassin_plist, 'monster_assassin_run_flip (%d).png', 1, 10, duration)
        const moveLeftAnimId = this.load(res.assassin_plist, 'monster_assassin_run_flip (%d).png', 11, 20, duration)
        const moveDownLeftAnimId = this.load(res.assassin_plist, 'monster_assassin_run_flip (%d).png', 21, 30, duration)


        this.animationIds = [
            [ moveUpLeftAnimId,       moveDownAnimId,          moveDownRightAnimId ],
            [ moveLeftAnimId,           moveUpAnimId,            moveRightAnimId     ],
            [ moveDownLeftAnimId,         moveUpAnimId,            moveUpRightAnimId   ],
        ]
        this.play(0)
    }
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.ASSASSIN, "assassin", false, function (playerState) {
    return new Assassin(MONSTER_ID.ASSASSIN, playerState)
})