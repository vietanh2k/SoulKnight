var Explosion = cc.Sprite.extend({
    ctor: function (pos) {
        this._super('res/game/animation/explosion/a1.png');
        // this.animationIds = [this.load(res.explosion_plist, 'a%d.png', 1, 9, 1)]
        // this.play(0)
        this.init()
        this.setPosition(pos.x, pos.y)
        this.setScale(0.4)
        var seq = cc.sequence(cc.delayTime(0.56),cc.fadeOut(0.24), cc.callFunc(()=> this.destroy()))
        this.runAction(seq)
        return true;
    },

    init:function (){
        cc.spriteFrameCache.addSpriteFrames(res.explosion_plist, res.explosion_png);
        var framelist = []
        for(var i=1; i<=9; i++) {
            var str  = 'a'+i+'.png'
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framelist.push(frame);
        }
        var animation = new cc.Animation(framelist, 0.08);
        var animate = cc.animate(animation)
        this.runAction(animate)
    },
    destroy:function (){
        this.removeFromParent(true)
    }


});




