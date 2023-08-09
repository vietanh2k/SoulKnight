SPELL_FIELD_WIDTH = 230

const HealSkillUI = cc.Node.extend({
    ctor: function ( posUI, duration, radius) {
        this._super();
        this.setPosition(posUI.x, posUI.y)
        this.initAnimation()
        this.radius = radius;
        this.setScale(2*CELL_SIZE_UI/SPELL_FIELD_WIDTH*this.radius)
        this.duration = duration;
        // this.schedule(this.updateDuration, this.ccDT)
        this.isCast = false
        this.updateDuration()
        this.setLocalZOrder(winSize.height +CELL_SIZE_UI*2);
        return true;
    },


    initAnimation: function () {
        this.anim = new sp.SkeletonAnimation("res/potion/effect_buff_heal.json",
            "res/potion/effect_buff_heal.atlas")
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