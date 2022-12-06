const DesertKing = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.DESERT_KING]
        this.initFromConfig(playerState, config)
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

        //this.fx = new sp.SkeletonAnimation(res.desert_king_fx_json, res.desert_king_fx_atlas)
        //this.fx.setAnimation(0, 'fx_back', true)
        //this.
        //this.fx.visible = false
        //this.addChild(this.fx)
    },


})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.DESERT_KING, "desertKing", false, function (playerState) {
    return new DesertKing(MONSTER_ID.DESERT_KING, playerState)
})