
var PopupChest= cc.Node.extend({

    ctor:function (item) {
        this._super();
        this.init(item)
        this.da= 312

    },
    init:function (item) {

        winSize = cc.director.getWinSize();
        this.addAtlas()
        var popup = ccs.load(res.popupChest, "").node
        popup.getChildByName('numCost').setString(item.getChildByName('numCost').getString())
        this.addChild(popup,0,100)
        this.addBlockLayer()
        this.getChildByTag(100).getChildByName('btnBack').addClickEventListener(()=>this.hide())
        // this.getChildByTag(100).getChildByName('button').addClickEventListener(()=>this.requestBuy())
        popup.setOpacity(20)
        popup.setScale(0.2)

        popup.runAction(cc.fadeIn(0.2))
        popup.runAction(cc.sequence(cc.scaleBy(0.15, 5), cc.scaleBy(0.10,0.94),cc.scaleBy(0.08,1.06), cc.scaleBy(0.07,0.96),cc.scaleBy(0.05,1.04)))
        return true;

    },

    addAtlas:function (){
        var resultAnimation = new sp.SkeletonAnimation("asset/lobby/treasure/fx/fx_vip.json",
            "asset/lobby/treasure/fx/fx_vip.atlas")
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
        this.getChildByTag(200).removeFromParent(false)
        this.getChildByTag(300).removeFromParent(false)
        this.getChildByTag(100).getChildByName('particle').removeFromParent(false)

        // this.runAction(cc.fadeOut(2))
        // this.visible = false
    },



    requestBuy:function (){

        try{
            testnetwork.connector.sendBuyGemOrGold(1,parseInt(this.getChildByTag(100).getChildByName('numGold').getString()));


        } catch (e){
            cc.log('errrrrrrrrrrror')
        }
    },
    //
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

