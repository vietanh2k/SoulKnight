
var PopupGold = cc.Node.extend({

    ctor:function (item) {
        this._super();
        this.setPosition(winSize.width/2,winSize.height*5/9)
        this.init(item)
        this.tooltip = false

    },
    init:function (item) {

        winSize = cc.director.getWinSize();

        var popup = ccs.load(res.popupGold, "").node
        popup.getChildByName('item').setTexture(item.getChildByName('item').getTexture())
        popup.getChildByName('numGold').setString(item.getChildByName('numGold').getString())
        popup.getChildByName('numCost').setString(item.getChildByName('numCost').getString())
        popup.getChildByName('numCost').setTextColor(item.getChildByName('numCost').getTextColor())
        this.addChild(popup,0,100)
        this.addBlockLayer()
        popup.getChildByName('btnBack').addClickEventListener(()=>this.hide())
        popup.getChildByName('button').addClickEventListener(()=>this.requestBuy())
        popup.getChildByName('touchLayer').addClickEventListener(()=>this.tapTooltip())
        if(sharePlayerInfo.gem < parseInt(popup.getChildByName('numCost').getString())){
            popup.getChildByName('button').loadTextureNormal('res/common/common_btn_gray.png');
            popup.getChildByName('button').setTouchEnabled(false)
        }
        var tooltipGold = ccs.load(res.tooltipGold, "").node
        tooltipGold.setPosition(0, winSize.height*0.11)
        tooltipGold.visible = false
        this.addChild(tooltipGold,0, 'tooltip')


        popup.setOpacity(20)
        popup.setScale(0.2)

        popup.runAction(cc.fadeIn(0.2))
        popup.runAction(cc.sequence(cc.scaleBy(0.15, 5), cc.scaleBy(0.10,0.94),cc.scaleBy(0.08,1.06), cc.scaleBy(0.07,0.96),cc.scaleBy(0.05,1.04)))
        return true;

    },

    hide:function (){
        this.getChildByTag(100).runAction(cc.fadeOut(0.3))
        this.getChildByTag(100).runAction(cc.scaleBy(0.2, 0.2))
        this.getChildByTag(100).getChildByName('Particle_1').removeFromParent(true)
        // popup.runAction(cc.scaleBy(0.3, 5))
        // this.getChildByTag(100).runAction(cc.scaleBy(2, 2))
        this.getChildByTag(200).removeFromParent(true)
        this.removeFromParent(true)

        // this.runAction(cc.fadeOut(2))
        // this.visible = false
    },

    tapTooltip:function (){
        this.tooltip = !this.tooltip
        this.getChildByName('tooltip').visible = this.tooltip
    },




    requestBuy:function (){
        var numGold = Utils.fromStringDotToNum(this.getChildByTag(100).getChildByName('numGold').getString())
        try{
            testnetwork.connector.sendBuyGemOrGold(1,numGold);
            cc.log(this.getChildByTag(100).getChildByName('numGold').getString())


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

