
var GoldFly = cc.Node.extend({

    ctor:function (pos, des, num, goldGet) {
        this._super();
        this.init(pos, des , num, goldGet)
        this.da= 312

    },
    init:function (pos, des, num, goldGet) {

        winSize = cc.director.getWinSize();
        var goldForOne = 100
        var num = Math.floor(goldGet/goldForOne)+0.5
        if(num <= 1){
            goldForOne = 10
            num = Math.floor(goldGet/goldForOne)+0.5
            if(num <= 1){
                goldForOne = 1
                num = Math.floor(goldGet/goldForOne)+0.5
            }
        }
        goldForLastOne = goldGet%goldForOne
        for(var i=0 ; i<num ; i++){
            cc.log('golddddddddddddddddd')
            var gold = new cc.Sprite('asset/common/common_icon_gold_small.png')
            var w = gold.getContentSize().width
            gold.setPosition(pos)
            var rx = (Math.random() * w*2)-w;
            var ry = (Math.random() * w*2)-w;
            var p = new cc.p(pos.x+rx,pos.y+ ry)
            var r2 = ((Math.random() * 4)-2)/10

            var seq = cc.sequence(cc.MoveTo(0.35, p), cc.delayTime(0.65), cc.MoveTo(0.6+r2,des),cc.fadeOut(0),cc.callFunc(()=> this.updateLabel(30)))
            var seq2 = cc.sequence( cc.delayTime(1), cc.scaleBy(1.5, 0.4))
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

    updateLabel:function (d){
        LobbyInstant.currencyPanel.updateLabelsGoldFly(d)
    }



});

