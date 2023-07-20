var Explosion = cc.Sprite.extend({
    ctor: function (pos, radius) {
        this._super('#bo1.png');
        this.initSmoke()
        this.setPosition(pos.x, pos.y)
        this.setScale(radius/this.getContentSize().width*2)
        var seq = cc.sequence(cc.delayTime(0.4),cc.fadeOut(0.3), cc.callFunc(()=> this.destroy()))
        this.runAction(seq)
        return true;
    },

    initSmoke:function (){
        var framelist = []
        for(var i=1; i<=9; i++) {
            var frame;
            var str = 'bo' + i + '.png';
            frame = cc.spriteFrameCache.getSpriteFrame(str);
            framelist.push(frame);
        }
        var animation = new cc.Animation(framelist, 0.05);
        var animate = cc.animate(animation);
        this.runAction(animate);
    },
    destroy:function (){
        this.removeFromParent(true);
    }

});




