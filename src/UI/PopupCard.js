
var PopupCard = cc.Node.extend({

    ctor:function (item) {
        this._super();
        this.init(item)
        this.da= 312

    },
    init:function (item) {

        winSize = cc.director.getWinSize();

        var popup = ccs.load(res.popupCard, "").node
        popup.getChildByName('cBackground').setTexture(item.getChildByName('background').getTexture())
        popup.getChildByName('cAvatar').setTexture(item.getChildByName('item').getTexture())
        popup.getChildByName('numCardGet').setString(item.getChildByName('numCard').getString())
        popup.getChildByName('numCost').setString(item.getChildByName('numCost').getString())
        popup.getChildByName('numCost').setTextColor(item.getChildByName('numCost').getTextColor())
        this.addChild(popup,0,100)
        this.addBlockLayer()
        this.getChildByTag(100).getChildByName('btnBack').addClickEventListener(()=>this.hide())
        this.getChildByTag(100).getChildByName('button').addClickEventListener(()=>this.requestBuy())
        if(sharePlayerInfo.gold < parseInt(popup.getChildByName('numCost').getString())){
            popup.getChildByName('button').setColor(new cc.Color(132,117,84,255))
            popup.getChildByName('button').setTouchEnabled(false)
        }
        popup.setOpacity(20)
        popup.setScale(0.2)

        popup.runAction(cc.fadeIn(0.2))
        popup.runAction(cc.sequence(cc.scaleBy(0.15, 5), cc.scaleBy(0.10,0.94),cc.scaleBy(0.08,1.06), cc.scaleBy(0.07,0.96),cc.scaleBy(0.05,1.04)))
        return true;

    },

    updateInfor:function (item){
        this.getChildByTag(100).getChildByName('item').setTexture(item.getChildByName('item').getTexture())
        this.getChildByTag(100).getChildByName('numGold').setString(item.getChildByName('numGold').getString())
        this.getChildByTag(100).getChildByName('numCost').setString(item.getChildByName('numCost').getString())
    },

    hide:function (){
        this.getChildByTag(100).runAction(cc.fadeOut(0.3))
        this.getChildByTag(100).runAction(cc.scaleBy(0.2, 0.2))
        // popup.runAction(cc.scaleBy(0.3, 5))
        // this.getChildByTag(100).runAction(cc.scaleBy(2, 2))
        this.getChildByTag(200).removeFromParent(true)
        this.removeFromParent(true)
        // this.runAction(cc.fadeOut(2))
        // this.visible = false
    },



    requestBuy:function (){

        var leng = 1
        var buyList = []
        buyList.push([100, 0])
        var cost = parseInt(this.getChildByTag(100).getChildByName('numCost').getString())
        try{
            testnetwork.connector.sendBuyCard(leng, buyList,cost);


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

    destroy:function (){
        this.removeFromParent(true)
    }



});

