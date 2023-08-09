
var ItemFly = cc.Node.extend({

    ctor:function (ress, posUI, desUI, num, type) {
        this._super();
        this.init(ress, posUI, desUI , num)
        this.type = type;       //type = 1 => coin, 2 => energy

    },
    init:function (ress, posUI, desUI , numGet) {

        winSize = cc.director.getWinSize();
        var numForOne = 1
        if(numGet > 30){
            numForOne = 2
        }

        var num = Math.floor((numGet-1)/numForOne)+1
        var numForLastOne =numGet - (numForOne*(num-1))
        // LobbyInstant.currencyPanel.updateLabelsGem(2)
        for(var i=0 ; i<num ; i++){
            var item = new cc.Sprite(ress)
            item.setPosition(posUI);
            let w = CELL_SIZE_UI/4*3;
            var rx = (Math.random() * w*2)-w;
            var ry = (Math.random() * w*2)-w;
            var p = new cc.p(posUI.x+rx,posUI.y+ ry)
            var r2 = ((Math.random() * 5)-2.5)/10
            var seq = cc.sequence(cc.MoveTo(0.35, p), cc.delayTime(0.95+r2),cc.fadeOut(0), cc.callFunc((p)=> this.moveToDes(ress, p, desUI, numForOne)))
            if(i == num-1){
                seq = cc.sequence(cc.MoveTo(0.35, p), cc.delayTime(0.95+r2),cc.fadeOut(0), cc.callFunc((p)=> this.moveToDes(ress, p, desUI, numForLastOne)))
            }
            var seq3 = cc.sequence( cc.delayTime(3), cc.callFunc(()=> this.destroy()));

            item.runAction(seq)
            item.runAction(seq3)
            this.addChild(item)
        }
        return true;

    },

    moveToDes:function (ress, posUI, desUI, numForOne){
        var item = new cc.Sprite(ress);
        let pos = new cc.p(BackgroundLayerInstance.x + posUI.x, BackgroundLayerInstance.y + posUI.y);
        item.setPosition(pos);
        var seq = cc.sequence(cc.MoveTo(0.45,desUI),cc.fadeOut(0),cc.callFunc(()=> this.updateLabel(numForOne)));
        var seq3 = cc.sequence( cc.delayTime(0.5), cc.callFunc(()=> item.removeFromParent(true)));
        item.runAction(seq)
        item.runAction(seq3)
        GamelayerInstance.addChild(item)

    },

    destroy:function (){
        this.removeFromParent(true)
    },

    updateLabel:function (num){
        if(this.type == 1){
            GamelayerInstance.updateLabelCoin(num);
        }
        if(this.type == 2){
            GamelayerInstance.updateLabelEnergy(num);
        }
        // LobbyInstant.currencyPanel.updateLabelsGoldFly(numGold)
    }



});

