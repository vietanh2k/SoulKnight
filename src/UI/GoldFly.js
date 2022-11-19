
var GoldFly = cc.Node.extend({

    ctor:function (pos, des, goldGet) {
        this._super();
        this.init(pos, des , goldGet)
        this.da= 312

    },
    init:function (pos, des, goldGet) {

        winSize = cc.director.getWinSize();
        var goldForOne = 100
        var _scale = 1
        if(goldGet <200){
            goldForOne = 10
            _scale = 0.75
        }
        if(goldGet <10){
            goldForOne = 1
            _scale = 0.5
        }
        var num = Math.floor((goldGet-1)/goldForOne)+1
        var goldForLastOne =goldGet - (goldForOne*(num-1))
        cc.log('num='+num)
        cc.log('goldForOne='+goldForOne)
        cc.log('goldForLastOne='+goldForLastOne)
        for(var i=0 ; i<num ; i++){
            cc.log('golddddddddddddddddd')
            var gold = new cc.Sprite('asset/common/common_icon_gold_small.png')
            var w = gold.getContentSize().width*_scale
            gold.setPosition(pos)
            var rx = (Math.random() * w*2)-w;
            var ry = (Math.random() * w*2)-w;
            var p = new cc.p(pos.x+rx,pos.y+ ry)
            var r2 = ((Math.random() * 3)-1.5)/10
            gold.setScale(_scale)
            var seq

            seq = cc.sequence(cc.MoveTo(0.35, p), cc.delayTime(0.65), cc.MoveTo(0.5+r2,des),cc.fadeOut(0),cc.callFunc(()=> this.updateLabel(goldForOne)))
            if(i == num-1){
                seq = cc.sequence(cc.MoveTo(0.35, p), cc.delayTime(0.65), cc.MoveTo(0.5+r2,des),cc.fadeOut(0),cc.callFunc(()=> this.updateLabel(goldForLastOne)))
            }
            var seq2 = cc.sequence( cc.delayTime(1), cc.scaleBy(1, 0.5/_scale))
            var seq3 = cc.sequence( cc.delayTime(3), cc.callFunc(()=> this.destroy()))
            gold.runAction(seq)
            gold.runAction(seq2)
            gold.runAction(seq3)
            this.addChild(gold)
        }
        return true;

    },



    destroy:function (){
        this.removeFromParent(true)
    },

    updateLabel:function (numGold){
        LobbyInstant.currencyPanel.updateLabelsGoldFly(numGold)
    }



});

