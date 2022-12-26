const NINJA_DIGGING_SKIN_NAME = "map_desert"
const NINJA_DIGGING_FADE_OUT_TIME = 0.6
const NINJA_DIGGING_FADE_IN_TIME = 2
const NINJA_PERCENT_AXIS_OFFSET = 0.5
const NINJA_FX_SCALE = 1.3

const NINJA_DIGGING_DOWN_TIME = 1.0;
const NINJA_DIGGING_UP_TIME = 1.5;

const Ninja = Monster.extend({
    initConfig: function (playerState) {
        const config = cf.MONSTER.monster[MONSTER_ID.NINJA]
        this.initFromConfig(playerState, config)

        this.defaultAbilityDistance = MAP_CONFIG.CELL_WIDTH * 3
        this.abilityDistance = this.defaultAbilityDistance

        this.isStopedMoving = false

        this.diggingDownTime = 0;
        this.diggingUpTime = 0;
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

        this.diggingfx = new sp.SkeletonAnimation(res.ninja_fx_digging_json, res.ninja_fx_digging_atlas)
        this.diggingfx.visible = false
        //this.diggingfx.stop()

        //this.diggingfx.setScale(1.1)

        this.addChild(this.diggingfx, -1)

        this.diggingSkinName = NINJA_DIGGING_SKIN_NAME
    },

    logicUpdate: function (playerState, dt) {
        this.active = this.inactiveSourceCounter === 0;

        if (this.active === false) {
            return;
        }

        const self = this

        if (this.isStopedMoving) {
            if (this.diggingDownTime > 0) {
                if ((this.diggingDownTime -= dt) <= 0) {
                    self.diggingfx.setAnimation(0, 'fx_digging', true)
                    self.diggingfx.setScale(1.0)

                    //self.opacity = 0
                    self.diggingfx.visible = true

                    this.isStopedMoving = false
                }
            }

            if (this.diggingUpTime > 0) {
                if ((this.diggingUpTime -= dt) <= 0) {
                    self.diggingfx.setScale(1.0)

                    self.diggingfx.visible = false
                    self.concept = "monster"

                    this.isStopedMoving = false
                }
            }

            return
        }

        this._super(playerState, dt)

        if (this.concept == null && !this.isDestroy && (this.abilityDistance -= this.speed * dt) <= 0) {
            this.isStopedMoving = true

            //this.diggingfx.setAnimationListener(this, (animation, trackEntry, evt) => {

            //this.runAction(new cc.FadeIn(NINJA_DIGGING_FADE_OUT_TIME))
            this.diggingfx.setAnimation(0, 'fx_dig_up', false)
            this.diggingUpTime = NINJA_DIGGING_UP_TIME
            /*this.diggingfx.setCompleteListener((evt) => {
                //
                // evt == 0 => animation start
                // evt == 2 => animation end
                //
                //if (evt !== 2) return

                self.diggingfx.setCompleteListener(null)
                self.diggingfx.setScale(1.0)

                //self.opacity = 255
                self.diggingfx.visible = false
                //self.diggingfx.stop()
                self.concept = "monster"

                self.isStopedMoving = false
            })*/
            this.runAction(new cc.FadeIn(NINJA_DIGGING_FADE_IN_TIME))
            this.diggingfx.setScale(NINJA_FX_SCALE)
        }
    },

    render: function (playerState) {
        this._super(playerState)

        this.diggingfx.setPosition(this.width / 2.0, this.height / 2.0)

        /*const dir = this.position.sub(this.prevPosition).normalize()
        dir.set(Math.round(dir.x), Math.round(dir.y))

        if (dir.x !== 0 && dir.y !== 0) {
            this.diggingfx.setPosition(this.width / 2.0, this.height / 2.0)
            return
        }

        if (this.renderRule === 1) {
            this.diggingfx.setPosition(this.width / (2 - NINJA_PERCENT_AXIS_OFFSET * dir.x), this.height / (2 + NINJA_PERCENT_AXIS_OFFSET * dir.y))
        } else {
            this.diggingfx.setPosition(this.width / (2 + NINJA_PERCENT_AXIS_OFFSET * dir.x), this.height / (2 - NINJA_PERCENT_AXIS_OFFSET * dir.y))
        }*/
    },

    takeDamage: function (playerState, many, from) {
        const self = this

        //this.health -= many
        this._super(playerState, many, from)

        if (many && this.concept != null && !(from instanceof IceBall)) {
            //this.setColor(cc.color(255,0,0,255))
            this.concept = null
            this.abilityDistance = this.defaultAbilityDistance
            this.isStopedMoving = true
            this.diggingDownTime = NINJA_DIGGING_DOWN_TIME;

            //this.opacity = 0

            this.diggingfx.visible = true

            /*this.diggingfx.setAnimationListener(this, (animation, trackEntry, evt) => {
                cc.log("+++++++++++++++++++++++++++++++++++++++++++" + evt)
                if (evt !== 2) return

                self.diggingfx.setAnimationListener(null, null)
                self.diggingfx.setAnimation(0, 'fx_digging', true)
                self.isStopedMoving = false

                self.opacity = 0
                self.diggingfx.visible = true
            })*/



            //this.diggingfx.setPosition(this.width / 2.0, this.height / 2.0)

            this.diggingfx.setSkin(this.diggingSkinName +  "_top")

            this.diggingfx.setSlotsToSetupPose()

            this.diggingfx.setAnimation(0, 'fx_dig_down', false)

            /*this.diggingfx.setCompleteListener((evt) => {
                //cc.log("++++++++++++++++++++++++++++++++++++++++++++++++  " + evt)
                //if (evt !== 2) return

                //self.diggingfx.setAnimationListener(null, null)
                //self.diggingfx.setPosition(this.width / 2.0, this.height / 2.0)
                self.diggingfx.setCompleteListener(null)
                self.diggingfx.setAnimation(0, 'fx_digging', true)
                self.diggingfx.setScale(1.0)
                self.isStopedMoving = false

                self.opacity = 0
                self.diggingfx.visible = true
            })*/

            this.runAction(new cc.FadeOut(NINJA_DIGGING_FADE_OUT_TIME))

            this.diggingfx.setScale(NINJA_FX_SCALE)
        }
    },
})

MonsterFactory.prototype.addMonsterInitializer(MONSTER_ID.NINJA, "ninja", false, function (playerState) {
    return new Ninja(MONSTER_ID.NINJA, playerState)
})