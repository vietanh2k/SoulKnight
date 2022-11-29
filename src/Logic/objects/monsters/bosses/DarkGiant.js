const DarkGiant = Monster.extend({
    initConfig: function () {
        const config = cf.MONSTER.monster[MONSTER_ID.DARK_GIANT]
        this.speed = config.speed * MAP_CONFIG.CELL_WIDTH
        this.health = config.hp
        this.MaxHealth = config.hp
        this.energyFromDestroy = config.gainEnergy
        this.energyWhileImpactMainTower = config.energy
    },

    initAnimation: function () {
        const duration = 1
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
    }
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.DARK_GIANT, "darkGiant", false, function (playerState) {
    return new DarkGiant(MONSTER_ID.DARK_GIANT, playerState)
})