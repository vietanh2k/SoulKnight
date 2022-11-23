
var PopupChest= cc.Node.extend({

    ctor:function (item,chestID) {
        this._super();
        this.init(item,chestID)
        this.da= 312

    },
    /**
     * khởi tạo infor từ item đã ấn vào
     **/
    init:function (item, chestID) {
        cc.log(chestID)
        var chest = fake.chests[chestID]
        winSize = cc.director.getWinSize();
        this.addAtlas()
        var popup = ccs.load(res.popupChest, "").node
        popup.getChildByName('numCost').setString(item.getChildByName('numCost').getString())
        popup.getChildByName('numCost').setTextColor(item.getChildByName('numCost').getTextColor())
        var strGold = chest.golds[0]+' - '+chest.golds[1]
        cc.log(strGold)
        popup.getChildByName('numGoldGet').setString(strGold)
        cc.log(popup.getChildByName('numGoldGet').getString())
        var strCard ='x'+ chest.cards[0]+ ' - ' +chest.cards[1]
        cc.log(strCard)
        popup.getChildByName('numCardGet').setString(strCard)
        for(var i=0;i<4; i++){
            if(i < chest.rarities.length){
                popup.getChildByName('cType'+(i+1)).loadTexture( 'res/lobby/treasure/common_icon_card_multiple_' +chest.rarities[i]+'.png')
            }else{
                popup.getChildByName('cType'+(i+1)).removeFromParent(true)
            }
            cc.log(i)
            // popup.getChildByName('cType'+(i+1)).setTexture( 'res/lobby/treasure/common_icon_card_multiple_' +chest.rarities[i]+'.png')
        }
        popup.getChildByName('btnBack').addClickEventListener(()=>this.hide())
        popup.getChildByName('button').addClickEventListener(()=>this.requestBuy(chestID))
        if(sharePlayerInfo.gold < parseInt(item.getChildByName('numCost').getString())){
            popup.getChildByName('button').setColor(new cc.Color(132,117,84,255))
            popup.getChildByName('button').setTouchEnabled(false)
        }
        popup.setOpacity(20)
        popup.setScale(0.2)

        popup.runAction(cc.fadeIn(0.2))
        popup.runAction(cc.sequence(cc.scaleBy(0.15, 5), cc.scaleBy(0.10,0.94),cc.scaleBy(0.08,1.06), cc.scaleBy(0.07,0.96),cc.scaleBy(0.05,1.04)))
        this.addChild(popup,0,100)
        this.addBlockLayer()
        return true;

    },

    addAtlas:function (){
        var resultAnimation = new sp.SkeletonAnimation("res/lobby/treasure/fx/fx_vip.json",
            "res/lobby/treasure/fx/fx_vip.atlas")
        resultAnimation.setPosition(0, winSize.height*1/3)
        resultAnimation.setAnimation(0, "animation", true)
        resultAnimation.setOpacity(0)
        resultAnimation.runAction(cc.sequence(cc.delayTime(0.1),cc.fadeIn(0.1)))
        resultAnimation.setScale(0.2)
        resultAnimation.runAction(cc.scaleBy(0.2, 5))
        this.addChild(resultAnimation,0,300)
    },

    hide:function (){
        this.getChildByTag(100).runAction(cc.fadeOut(0.3))
        this.getChildByTag(100).runAction(cc.scaleBy(0.2, 0.2))
        this.getChildByTag(200).removeFromParent(true)
        this.getChildByTag(300).removeFromParent(true)
        this.removeFromParent(true)
        // this.runAction(cc.fadeOut(2))
        // this.visible = false
    },



    requestBuy:function (chestID){
        var buyList = []
        buyList.push([chestID, 1])
        var cost = parseInt(this.getChildByTag(100).getChildByName('numCost').getString())
        sharePlayerInfo.gold -= parseInt(cost)
        LobbyInstant.currencyPanel.updateLabelsGold(Math.floor(cost/50)+1)
        try{
            testnetwork.connector.sendBuyChest(1, buyList,cost);


        } catch (e){
            cc.log('errrrrrrrrrrror')
        }
    },
    //
    /**
     * layer block
     **/
    addBlockLayer:function () {
        var blockLayer = new cc.Sprite(res.house_box)
        blockLayer.setScaleX(1.3*winSize.width/blockLayer.getContentSize().width)
        blockLayer.setScaleY(1.3*winSize.height/blockLayer.getContentSize().height)
        // blockLayer.setPosition(winSize.width/2, winSize.height/2)
        this.addChild(blockLayer,-1,200)
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event){
                cc.log("touch began2333333333: "+ touch.getLocationX());
                // blockLayer.parent.hide()
                // blockLayer.removeFromParent()

                return true;

            }
        } , blockLayer);

    },



});

