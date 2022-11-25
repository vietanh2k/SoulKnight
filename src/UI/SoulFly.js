var SoulFly = cc.Sprite.extend({
    ctor: function (pos) {
        this._super('#monster_die_soul_fx_0000.png');
        this.initSoul()
        this.setPosition(pos.x, pos.y+CELLWIDTH/2)
        this.setScale(CELLWIDTH/this.getContentSize().width*1.5)
        var seq = cc.sequence(cc.delayTime(0.85),cc.fadeOut(0.2), cc.callFunc(()=> this.destroy()))
        this.runAction(seq)
        return true;
    },

    initSoul:function (){
        var framelist = []
        for(var i=0; i<=32; i++) {
            var frame;
            if(i<10) {
                var str = 'monster_die_soul_fx_000' + i + '.png';
                frame = cc.spriteFrameCache.getSpriteFrame(str);
            }else{
                var str = 'monster_die_soul_fx_00' + i + '.png';
                frame = cc.spriteFrameCache.getSpriteFrame(str);
            }
            framelist.push(frame);
        }
        var animation = new cc.Animation(framelist, 0.03);
        var animate = cc.animate(animation);
        this.runAction(animate);
    },
    destroy:function (){
        this.removeFromParent(true);
    }


});




