FIREBALL_WIDTH = 180

const SpellFallUI = cc.Node.extend({
    ctor: function ( posUI , resSpell, aniSpell) {
        this._super();
        this.castPosition = posUI
        this.initPosStart(posUI)
        this.initAnimation(resSpell, aniSpell)
        this.radius = 0.8
        this.setScale(2*CELLWIDTH/FIREBALL_WIDTH*this.radius)
        this.ccDT = 0.02
        this.schedule(this.fall, this.ccDT)
        this.isCast = false
        return true;
    },

    initPosStart: function (posUI) {
        this._speed = 10 * CELLWIDTH
        this.setPosition(posUI.x, posUI.y +4 * CELLWIDTH)
    },

    initAnimation: function (resSpell, aniSpell) {
        this.anim = new sp.SkeletonAnimation("res/potion/"+resSpell+".json",
            "res/potion/"+resSpell+".atlas")
        this.anim.setAnimation(0, aniSpell, true);
        this.addChild(this.anim)
    },
    fall: function (){
        this.y -= this.ccDT * this._speed
        if(this.y <= this.castPosition.y){
            this.y = this.castPosition.y
            this._speed = 0;
            this.cast(2)
            this.unscheduleAllCallbacks();

        }
    },
    cast: function (time){
        if(this.isCast == false) {
            this.isCast = true;
            this.anim.setAnimation(0, "animation_full", true);
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