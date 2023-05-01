var utils = utils || {}

const AnimatedSprite = cc.Sprite.extend({
    //animations: null,
    //animates: null,
    //animateActions: null,
    //currentAnimationId: null,

    // playTime != 0 => play repeat, ow => play once
    //playTime: null,
    //prevAnimationId: null,

    ctor: function (p) {
        this._super(p)

        this.animations = []
        this.animates = []
        this.animateActions = []
        this.currentAnimationId = -1
        this.currentAnimationDuration = 1
        this.durationScale = 1
        this.playTime = 0
        this.prevAnimationId = -1

        // this.setBlendFunc(cc.SRC_ALPHA, cc.ONE)
    },

    animationCleanup: function () {
        for (let i = 0; i < this.animations.length; i++) {
            this.animateActions[i].release()
        }
    },

    clone: function() {
        const ret = new AnimatedSprite()
        const pos = this.getPosition()
        ret.setPosition(pos.x, pos.y)
        ret.setScale(this.getScaleX(), this.getScaleY())
        ret.setRotation(this.getRotation())
        ret.setAnchorPoint(this.getAnchorPoint())

        ret.animations = [...this.animations]

        for (let i = 0; i < ret.animations.length; i++) {
            ret.animates.push(new cc.Animate(ret.animations[i]))
            ret.animateActions.push(new cc.RepeatForever(ret.animates[i]))
            ret.animateActions[i].retain()
        }

        ret.play(this.currentAnimationId)

        return ret
    },

    // return loaded animation id
    load: function(srcPList, fmt, from, to, animationDuration = 1) {
        if (!cc.spriteFrameCache.isSpriteFramesWithFileLoaded(srcPList)) {
            cc.spriteFrameCache.addSpriteFrames(srcPList)
        }

        const animationName = srcPList + fmt + animationDuration + from + to
        let animation = cc.animationCache.getAnimation(animationName)

        if (animation == null) {
            const animationFrames = []
            for (let i = from; i <= to; i++) {
                // cc.log('file name' + utils.String.format(fmt, i));
                animationFrames.push(cc.spriteFrameCache.getSpriteFrame(utils.String.format(fmt, i)))
            }

            animation = new cc.Animation(animationFrames, animationDuration / (to - from + 1))
            cc.animationCache.addAnimation(animation, animationName)
        }

        const ret = this.animations.length
        this.animations.push(animation)
        this.animates.push(new cc.Animate(this.animations[ret]))
        this.animateActions.push(new cc.RepeatForever(this.animates[ret]))
        this.animateActions[ret].retain()

        return ret
    },
    // return loaded animation id
    /**
     * Load animation từ một list các file
     * @param {Array} filenames: tên file
     * @param {String} name: tên animation
     * @param {Number} delay: thời gian giữa 2 frame tinhs bằng milisecond
     * */
    loadFromMultiFile: function(filenames, name,delay = 1) {
        filenames.map(filename=>{
            if(cc.spriteFrameCache.getSpriteFrame(filename)==null){
                var frame = new cc.SpriteFrame(filename);
                cc.spriteFrameCache.addSpriteFrame(frame, filename);
            }
        })

        const animationName = name
        let animation = cc.animationCache.getAnimation(animationName)

        if (animation == null) {
            const animationFrames = [];
            filenames.map(filename=>{
                cc.log('cc.spriteFrameCache.getSpriteFrame(filename)')
                cc.log(cc.spriteFrameCache.getSpriteFrame(filename))
                animationFrames.push(cc.spriteFrameCache.getSpriteFrame(filename))
            })

            animation = new cc.Animation(animationFrames, 0.1)
            cc.animationCache.addAnimation(animation, animationName)
        }


        const ret = this.animations.length
        // this.animations.push(animation)
        let animated = new cc.Animate(animation),
            animateAction = new cc.RepeatForever(animated);
        animateAction.retain();
        // this.animates.push(new cc.Animate(this.animations[ret]))
        // this.animateActions.push(new cc.RepeatForever(this.animates[ret]))
        // this.animateActions[ret].retain()

        return animateAction
    },

    // play animation id
    play: function (animationId) {
        if (animationId === -1) {
            this.stop()
        }

        if (this.currentAnimationId !== animationId) {
            if (this.currentAnimationId !== -1) {
                this.animates[this.currentAnimationId].setDuration(this.currentAnimationDuration)
                this.stopAction(this.animateActions[this.currentAnimationId])
            }

            this.runAction(this.animateActions[animationId])
            this.currentAnimationId = animationId

            this.currentAnimationDuration = this.animates[this.currentAnimationId].getDuration()
            this.animates[this.currentAnimationId].setDuration(this.durationScale * this.currentAnimationDuration)
        }
    },

    // stop current animation
    stop: function () {
        if (this.currentAnimationId !== -1) {
            this.animates[this.currentAnimationId].setDuration(this.currentAnimationDuration)
            this.stopAction(this.animateActions[this.currentAnimationId])
            this.currentAnimationId = -1
        }
    },

    setDurationScale: function (scale) {
        this.durationScale = scale
        
        if (this.currentAnimationId !== -1) {
            this.animates[this.currentAnimationId].setDuration(this.durationScale * this.currentAnimationDuration)
            //this.stopAction(this.animateActions[this.currentAnimationId])
            //this.runAction(this.animateActions[this.currentAnimationId])
        }
    },

    getDurationScale: function () {
        return this.durationScale
    },

    playForDuration: function (animationId, duration = -1) {
        if (duration !== 0 && this.playTime === 0) {

            if (duration < 0) {
                this.playTime = this.animations[animationId].getDuration()
            } else {
                this.playTime = duration //this.animations[animationId].getDuration()
            }

            this.prevAnimationId = this.currentAnimationId
            this.play(animationId)
            return this.playTime
        }
        return 0
    },

    replay: function (animationId) {
        this.setRestoreOriginalFrame(true)
        if (this.currentAnimationId !== -1) {
            this.stopAction(this.animateActions[this.currentAnimationId])
        }

        this.runAction(this.animateActions[animationId])
        this.currentAnimationId = animationId
    },

    getCurrentAnimationId: function () {
        return this.currentAnimationId
    },

    setCurrentAnimationId: function (id) {
        if (id < 0 || id >= this.animateActions.length) {
            return
        }

        this.play(id)
    },

    getAnimationsCount: function () {
        return this.animateActions.length
    },

    getDuration: function (animationId) {
        return this.animations[animationId].getDuration()
    },

    update: function (game) {
        //this._super.update(Clock.dt)

        if (this.playTime !== 0) {
            this.playTime = Math.max(0, this.playTime - Clock.dt)

            if (this.playTime === 0) {
                this.play(this.prevAnimationId)
            }
        }
    }
})

/*AnimatedSprite.create = function () {
    const ret = {
        animations: [],
        animates: [],
        animateActions: [],
        currentAnimationId: -1,
    }
    return ret
}*/

/*utils.AnimatedSprite = {
    // animations: array of cc.Animation
    create: function (animations) {
        utils.AnimatedSprite
    },

    _loadNewAnimation: function (srcPList, fmt, from, to) {
        if (!cc.spriteFrameCache.isSpriteFramesWithFileLoaded(srcPList)) {
            cc.spriteFrameCache.addSpriteFrames(srcPList)
        }

        const animationFrames = []
        for (let i = from; i <= to; i++) {
            animationFrames.push(cc.spriteFrameCache.getSpriteFrame(utils.String.format(fmt, i)))
        }

        return new cc.Animation(animationFrames, 1 / (to - from + 1))
    },

    load: function (srcPList, fmt, from, to) {
        if (!cc.spriteFrameCache.isSpriteFramesWithFileLoaded(srcPList)) {
            cc.spriteFrameCache.addSpriteFrames(srcPList)
        }

        const animationFrames = []
        for (let i = from; i <= to; i++) {
            animationFrames.push(cc.spriteFrameCache.getSpriteFrame(utils.String.format(fmt, i)))
        }

        const animation = new cc.Animation(animationFrames, 1 / (to - from + 1))
        const animate = new cc.Animate(animation)

        const sprite = new cc.Sprite(animationFrames[0])
        sprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE)
        sprite.runAction(new cc.RepeatForever(animate))

        return sprite
    },

    // return cc.Animation
    loadAnimation: function (srcPList, fmt, from, to, animationNameCache) {
        const animation = cc.animationCache.getAnimation(animationNameCache)

        if (animation != null) {
            return animation
        }

        const ret =  this._loadNewAnimation(srcPList, fmt, from, to, animationNameCache)
        cc.animationCache.addAnimation(ret, animationNameCache)
        return ret
    }
}*/