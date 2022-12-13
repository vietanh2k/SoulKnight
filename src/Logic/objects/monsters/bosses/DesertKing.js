const DESERT_KING_FX_FATE_OUT_TIME = 1
const DESERT_KING_EFFECT_NUM_CELLS = 1.5

const desertKingTakeDamageProxy = function (playerState, many, from) {
    if (Random.rangeInt(1, 2) % 2 === 0) {
        return
    }
    this.___originalTakeDamage(playerState, many, from)
}

const DesertKing = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.DESERT_KING]
        this.initFromConfig(playerState, config)

        this.effectRadius = DESERT_KING_EFFECT_NUM_CELLS * MAP_CONFIG.CELL_WIDTH
    },

    initAnimation: function () {
        const duration = 1.4
        const moveDownAnimId = this.load(res.desert_king_plist, 'monster_desert_king_run_%04d.png', 0, 24, duration)
        const moveDownRightAnimId = this.load(res.desert_king_plist, 'monster_desert_king_run_%04d.png', 25, 49, duration)
        const moveRightAnimId = this.load(res.desert_king_plist, 'monster_desert_king_run_%04d.png', 50, 74, duration)
        const moveUpRightAnimId = this.load(res.desert_king_plist, 'monster_desert_king_run_%04d.png', 75, 99, duration)
        const moveUpAnimId = this.load(res.desert_king_plist, 'monster_desert_king_run_%04d.png', 100, 124, duration)
        const moveUpLeftAnimId = this.load(res.desert_king_plist, 'monster_desert_king_run_flipped (%d).png', 1, 25, duration)
        const moveLeftAnimId = this.load(res.desert_king_plist, 'monster_desert_king_run_flipped (%d).png', 26, 50, duration)
        const moveDownLeftAnimId = this.load(res.desert_king_plist, 'monster_desert_king_run_flipped (%d).png', 51, 75, duration)


        this.animationIds = [
            [ moveUpLeftAnimId,       moveDownAnimId,          moveDownRightAnimId ],
            [ moveLeftAnimId,         moveUpAnimId,            moveRightAnimId     ],
            [ moveDownLeftAnimId,     moveUpAnimId,            moveUpRightAnimId   ],
        ]
        this.play(0)

        const self = this
        this.fx = new sp.SkeletonAnimation(res.desert_king_fx_json, res.desert_king_fx_atlas)
        /*this.fx.visible = false
        this.fx.setCompleteListener(() => {
            self.fx.visible = false
        })*/
        this.fx.setAnimation(0, 'fx_back', true)
        this.fx.opacity = 128
        this.fx.setScale(1.2)
        this.addChild(this.fx, -1)
    },


    fakeTakeDamageForMonsters: function (playerState, monsters) {
        const self = this
        monsters.forEach((monster, i) => {
            if (monster !== self && monster.takeDamage !== desertKingTakeDamageProxy) {
                monster.___originalTakeDamage = monster.takeDamage
                monster.takeDamage = desertKingTakeDamageProxy
                playerState.getMap().addEffect(new DesertKingEffect(monster, self))
            }
        })
    },

    logicUpdate: function (playerState, dt) {
        //this.restoreTakeDamageForEffectedMonsters()

        if (Random.rangeInt(1, 10) % 10 === 0) {
            const monsters = playerState.getMap().queryEnemiesCircle(this.position, this.effectRadius)
            this.fakeTakeDamageForMonsters(playerState, monsters)
        }

        this._super(playerState, dt)
    },

    /*takeDamage: function (many, from) {
        if (Random.rangeInt(1, 2) % 2 === 0) {
            this.fx.setAnimation(0, 'fx_back', false)
            this.fx.visible = true
            this.fx.opacity = 255
            this.fx.runAction(new cc.FadeOut(DESERT_KING_FX_FATE_OUT_TIME))
            return
        }

        this._super(many)
    },*/

    render: function (playerState) {
        this._super(playerState)

        if (this.fx.visible) this.fx.setPosition(this.width / 2.0, this.height / 2.0)
    },

})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.DESERT_KING, "desertKing", false, function (playerState) {
    return new DesertKing(MONSTER_ID.DESERT_KING, playerState)
})