
var PopupGold = cc.Node.extend({

    ctor:function (item) {
        this._super();
        this.init(item)
        this.da= 312

    },
    init:function (item) {

        winSize = cc.director.getWinSize();

        var popup = ccs.load(res.popupGold, "").node
        popup.getChildByName('item').setTexture(item.getChildByName('item').getTexture())
        popup.getChildByName('numGold').setString(item.getChildByName('numGold').getString())
        popup.getChildByName('numCost').setString(item.getChildByName('numCost').getString())
        this.addChild(popup,0,100)
        this.addBlockLayer()
        this.getChildByTag(100).getChildByName('btnBack').addClickEventListener(()=>this.hide())
        this.getChildByTag(100).getChildByName('button').addClickEventListener(()=>this.requestBuy())
        popup.setOpacity(20)
        popup.setScale(0.2)

        popup.runAction(cc.fadeIn(0.2))
        popup.runAction(cc.sequence(cc.scaleBy(0.2, 5), cc.scaleBy(0.12,0.9),cc.scaleBy(0.10,1.1), cc.scaleBy(0.08,0.95),cc.scaleBy(0.05,1.05)))
        return true;

    },

    updateInfor:function (item){
        this.getChildByTag(100).getChildByName('item').setTexture(item.getChildByName('item').getTexture())
        this.getChildByTag(100).getChildByName('numGold').setString(item.getChildByName('numGold').getString())
        this.getChildByTag(100).getChildByName('numCost').setString(item.getChildByName('numCost').getString())
    },

    hide:function (){
        this.getChildByTag(100).runAction(cc.fadeOut(0.3))
        this.getChildByTag(100).runAction(cc.scaleBy(0.3, 0.2))
        // popup.runAction(cc.scaleBy(0.3, 5))
        // this.getChildByTag(100).runAction(cc.scaleBy(2, 2))
        this.getChildByTag(200).removeFromParent(false)

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
                blockLayer.parent.hide()
                // blockLayer.removeFromParent()

                return true;

            }
        } , blockLayer);

    },



});

