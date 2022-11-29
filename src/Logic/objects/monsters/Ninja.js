const Ninja = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.NINJA]
        this.initFromConfig(playerState, config)

        this.defaultAbilityDistance = MAP_CONFIG.CELL_WIDTH * 3
        this.abilityDistance = this.defaultAbilityDistance
    },

    initAnimation: function () {
        const duration = 0.6
        const moveDownAnimId = this.load(res.ninja_plist, 'monster_ninja_run_%04d.png', 0, 9, duration)
        const moveDownRightAnimId = this.load(res.ninja_plist, 'monster_ninja_run_%04d.png', 10, 19, duration)
        const moveRightAnimId = this.load(res.ninja_plist, 'monster_ninja_run_%04d.png', 20, 29, duration)
        const moveUpRightAnimId = this.load(res.ninja_plist, 'monster_ninja_run_%04d.png', 30, 39, duration)
        const moveUpAnimId = this.load(res.ninja_plist, 'monster_ninja_run_%04d.png', 40, 49, duration)
        const moveUpLeftAnimId = this.load(res.ninja_plist, 'monster_ninja_run_flipped (%d).png', 1, 10, duration)
        const moveLeftAnimId = this.load(res.ninja_plist, 'monster_ninja_run_flipped (%d).png', 11, 20, duration)
        const moveDownLeftAnimId = this.load(res.ninja_plist, 'monster_ninja_run_flipped (%d).png', 21, 30, duration)


        this.animationIds = [
            [ moveUpLeftAnimId,       moveDownAnimId,          moveDownRightAnimId ],
            [ moveLeftAnimId,           moveUpAnimId,            moveRightAnimId     ],
            [ moveDownLeftAnimId,         moveUpAnimId,            moveUpRightAnimId   ],
        ]
        this.play(0)
    },

    logicUpdate: function (playerState, dt) {
        this._super(playerState, dt)

        if (this.concept == null && (this.abilityDistance -= this.speed * dt) <= 0) {
            this.setColor(cc.color(255,255,255,255))
            this.concept = "monster"
        }
    },

    takeDamage: function (many) {
        this.health -= many

        if (many && this.concept != null) {
            this.setColor(cc.color(255,0,0,255))
            this.concept = null
            this.abilityDistance = this.defaultAbilityDistance
        }
    },
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.NINJA, "ninja", false, function (playerState) {
    return new Ninja(MONSTER_ID.NINJA, playerState)
})