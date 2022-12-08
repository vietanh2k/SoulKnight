//const icemanFakeTowerLogicUpdate = function (playerState, dt) {
//    if (this.)
//
//    this.___originalLogicUpdate(playerState, dt)
//}

const ICEMAN_FREEZE_EFFECT_TIME = 3

const Iceman = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.ICEMAN]
        this.initFromConfig(playerState, config)
    },

    initAnimation: function () {
        const duration = 1.6
        const moveDownAnimId = this.load(res.iceman_plist, 'monster_iceman_run_%04d.png', 0, 23, duration)
        const moveDownRightAnimId = this.load(res.iceman_plist, 'monster_iceman_run_%04d.png', 24, 47, duration)
        const moveRightAnimId = this.load(res.iceman_plist, 'monster_iceman_run_%04d.png', 48, 71, duration)
        const moveUpRightAnimId = this.load(res.iceman_plist, 'monster_iceman_run_%04d.png', 72, 95, duration)
        const moveUpAnimId = this.load(res.iceman_plist, 'monster_iceman_run_%04d.png', 96, 119, duration)
        const moveUpLeftAnimId = this.load(res.iceman_plist, 'monster_iceman_run_flipped (%d).png', 1, 24, duration)
        const moveLeftAnimId = this.load(res.iceman_plist, 'monster_iceman_run_flipped (%d).png', 25, 48, duration)
        const moveDownLeftAnimId = this.load(res.iceman_plist, 'monster_iceman_run_flipped (%d).png', 49, 72, duration)


        this.animationIds = [
            [ moveUpLeftAnimId,       moveDownAnimId,          moveDownRightAnimId ],
            [ moveLeftAnimId,         moveUpAnimId,            moveRightAnimId     ],
            [ moveDownLeftAnimId,     moveUpAnimId,            moveUpRightAnimId   ],
        ]
        this.play(0)
    },

    takeDamage: function (playerState, many, from) {
        if (from && Random.rangeInt(1, 10) % 10 === 0) {
            //from.___originalLogicUpdate = from.logicUpdate
            //from.logicUpdate = icemanFakeTowerLogicUpdate

            if (from.___freezeEffect) {
                from.___freezeEffect.reset()
            } else {
                from.___freezeEffect = new FreezeEffect(ICEMAN_FREEZE_EFFECT_TIME, from)
                playerState.getMap().addEffect(from.___freezeEffect)
            }
        }

        this._super(playerState, many, from)
    }
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.ICEMAN, "iceman", false, function (playerState) {
    return new Iceman(MONSTER_ID.ICEMAN, playerState)
})