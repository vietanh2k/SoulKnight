FIREBALL_WIDTH = 180

const SpellFieldUI = cc.Node.extend({
    ctor: function ( posUI , resSpell, duration) {
        this._super();
        this.setPosition(posUI.x, posUI.y)
        this.initAnimation(resSpell)
        this.radius = 0.8
        this.setScale(2*CELLWIDTH/FIREBALL_WIDTH*this.radius)
        this.ccDT = 0.03
        this.duration = duration;
        this.schedule(this.updateDuration, this.ccDT)
        this.isCast = false
        return true;
    },

    initPosStart: function (posUI) {
        this._speed = 10 * CELLWIDTH
        this.setPosition(posUI.x, posUI.y +4 * CELLWIDTH)
    },

    initAnimation: function (resSpell) {
        this.anim = new sp.SkeletonAnimation("res/potion/"+resSpell+".json",
            "res/potion/"+resSpell+".atlas")
        this.anim.setAnimation(0, "animation_full", true)
        this.addChild(this.anim)
    },

    updateDuration: function (){
        this.duration -= this.ccDT;
        if(this.duration <= 0){
            this.destroy()
        }
    },

    destroy: function (){
        this.removeFromParent(true);

    },
});