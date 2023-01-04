var Explosion = cc.Sprite.extend({
    ctor: function (pos) {
        this._super('#monster_die_smoke_fx_0000.png');
        this.initSmoke()
        this.setPosition(pos.x, pos.y)
        this.setScale(CELLWIDTH/this.getContentSize().width*1.5)
        var seq = cc.sequence(cc.delayTime(0.5),cc.fadeOut(0.3), cc.callFunc(()=> this.destroy()))
        this.runAction(seq)
        return true;
    },

    initSmoke:function (){
        var framelist = []
        for(var i=1; i<=19; i++) {
            var frame;
            if(i<10) {
                var str = 'monster_die_smoke_fx_000' + i + '.png';
                frame = cc.spriteFrameCache.getSpriteFrame(str);
            }else{
                var str = 'monster_die_smoke_fx_00' + i + '.png';
                frame = cc.spriteFrameCache.getSpriteFrame(str);
            }
            framelist.push(frame);
        }
        var animation = new cc.Animation(framelist, 0.04);
        var animate = cc.animate(animation);
        this.runAction(animate);
    },
    destroy:function (){
        this.removeFromParent(true);
    }

});




