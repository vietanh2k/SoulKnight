const SATYR_HEALTH_EFFECT_NUM_CELLS = 2
const SATYR_HEALTH_PERCENT = 0.03
const SATYR_EFFECT_TIME_MAX = 1

const Satyr = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.SATYR]
        this.initFromConfig(playerState, config)

        this.effectRadius = SATYR_HEALTH_EFFECT_NUM_CELLS * MAP_CONFIG.CELL_WIDTH

        this.effectTime = SATYR_EFFECT_TIME_MAX;
    },

    initAnimation: function () {
        const duration = 1
        const moveDownAnimId = this.load(res.satyr_plist, 'monster_satyr_run_%04d.png', 0, 12, duration)
        const moveDownRightAnimId = this.load(res.satyr_plist, 'monster_satyr_run_%04d.png', 13, 25, duration)
        const moveRightAnimId = this.load(res.satyr_plist, 'monster_satyr_run_%04d.png', 26, 38, duration)
        const moveUpRightAnimId = this.load(res.satyr_plist, 'monster_satyr_run_%04d.png', 39, 51, duration)
        const moveUpAnimId = this.load(res.satyr_plist, 'monster_satyr_run_%04d.png', 52, 64, duration)
        const moveUpLeftAnimId = this.load(res.satyr_plist, 'monster_satyr_run_flipped (%d).png', 1, 13, duration)
        const moveLeftAnimId = this.load(res.satyr_plist, 'monster_satyr_run_flipped (%d).png', 14, 26, duration)
        const moveDownLeftAnimId = this.load(res.satyr_plist, 'monster_satyr_run_flipped (%d).png', 27, 39, duration)


        this.animationIds = [
            [ moveUpLeftAnimId,       moveDownAnimId,          moveDownRightAnimId ],
            [ moveLeftAnimId,         moveUpAnimId,            moveRightAnimId     ],
            [ moveDownLeftAnimId,     moveUpAnimId,            moveUpRightAnimId   ],
        ]
        this.play(0)

        this.healthFx1 = new sp.SkeletonAnimation(res.satyr_fx_json, res.satyr_fx_atlas)
        this.healthFx1.setAnimation(0, 'fx_back', false)
        this.healthFx1.opacity = 64
        this.addChild(this.healthFx1, -1)

        const self = this
        this.healthFx1.setCompleteListener(self.animation2Func.bind(self))

        //this.healthFx2 = new sp.SkeletonAnimation(res.satyr_fx_json, res.satyr_fx_atlas)
        //this.healthFx2.setAnimation(0, 'fx_cover', true)
        //this.healthFx2.opacity = 64
        //this.addChild(this.healthFx2)
    },

    logicUpdate: function (playerState, dt) {
        if ((this.effectTime -= dt) <= 0) {
            const self = this
            const map = playerState.getMap()
            const enemies = map.queryEnemiesCircle(this.position, this.effectRadius)

            enemies.forEach((monster, id, list) => {
                if (monster !== self) monster.recoverHp(monster.health * SATYR_HEALTH_PERCENT)
            })

            this.effectTime = SATYR_EFFECT_TIME_MAX
        }


        this._super(playerState, dt)
    },

    animation1Func: function () {
        this.healthFx1.setAnimation(0, 'fx_back', false)
        this.healthFx1.setCompleteListener(this.animation2Func.bind(this))
    },

    animation2Func: function () {
        this.healthFx1.setAnimation(0, 'fx_cover', false)
        this.healthFx1.setCompleteListener(this.animation1Func.bind(this))
    },

    render: function (playerState) {
        this._super(playerState)
        this.healthFx1.setPosition(this.width / 2.0, this.height / 2.0)
        //this.healthFx2.setPosition(this.width / 2.0, this.height / 2.0)
    },
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.SATYR, "satyr", false, function (playerState) {
    return new Satyr(MONSTER_ID.SATYR, playerState)
})