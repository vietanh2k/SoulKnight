SPELL_FALL_WIDTH = 180

const SpellFallUI = cc.Node.extend({
    ctor: function ( posUI ,time , resSpell, aniSpell, stat) {
        this._super();
        this.castPosition = posUI
        this.initPosStart(posUI)
        this.initAnimation(resSpell, aniSpell)
        this.radius = stat[0]
        this.time = time
        this.setScale(2*CELLWIDTH/SPELL_FALL_WIDTH*this.radius)
        this.isCast = false
        this.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + winSize.height)
        this.fall();
        return true;
    },

    initPosStart: function (posUI) {
        // this._speed = 12 * CELLWIDTH
        this.setPosition(posUI.x, posUI.y +4 * CELLWIDTH)
    },

    initAnimation: function (resSpell, aniSpell) {
        this.anim = new sp.SkeletonAnimation("res/potion/"+resSpell+".json",
            "res/potion/"+resSpell+".atlas")
        this.anim.setAnimation(0, aniSpell, true);
        this.addChild(this.anim)
    },
    fall: function (){
        let seq = cc.sequence(cc.MoveTo(0.3, this.castPosition), cc.callFunc(()=>{
            this.cast(2);
        }))
        this.runAction(seq)
    },
    cast: function (time){
        if(this.isCast == false) {
            this.isCast = true;
            this.setLocalZOrder(GAME_CONFIG.RENDER_START_Z_ORDER_VALUE)
            this.anim.setAnimation(0, "animation_full", true);
        }
        if(this.time === 1) {
            this.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(() => {
                this.anim.setAnimation(0, "animation_top", true);
                this.fadeOut(0.5);
            })))
        }
        this.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(()=>{
            this.destroy();
        })))
    },

    destroy: function (){
        this.removeFromParent(true);


        //this.debug(map)
    },
});