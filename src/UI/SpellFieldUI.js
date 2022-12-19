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
        // this.schedule(this.updateDuration, this.ccDT)
        this.isCast = false
        this.updateDuration()
        return true;
    },


    initAnimation: function (resSpell) {
        this.anim = new sp.SkeletonAnimation("res/potion/"+resSpell+".json",
            "res/potion/"+resSpell+".atlas")
        this.anim.setAnimation(0, "animation_full", true)
        this.addChild(this.anim)
    },

    updateDuration: function (){
        // this.duration -= this.ccDT;
        // if(this.duration <= 0){
        //     this.destroy()
        // }
        let seq = cc.sequence(cc.delayTime(this.duration+0.1), cc.callFunc(()=>{
            this.destroy();
        }))
        this.runAction(seq);
    },

    destroy: function (){
        this.removeFromParent(true);

    },
});