
var ShopUI = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init()
        this.m = 45
        this.s = 10

        this.popupGold = null
        this.listener1 = null
        this.scheduleUpdate();
    },
    init:function () {

        winSize = cc.director.getWinSize();
        this.listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                cc.log('bbbbbbbbbbbbbbbbb')
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            },

            onTouchEnded: function (touch, event) {
                cc.log('aaaaaaaaaaaaaaaaa')
                var target = event.getCurrentTarget();
                if(target.getParent().getParent().getParent() != null){
                    target.getParent().getParent().getParent().showPopup()

                }else{
                    target.visible = false
                }
            }
        });

        this.initBackGround();



        return true;
    },



    initBackGround:function()
    {
        var mainscene = ccs.load(res.shopScene, "").node;
        var item1 = ccs.load(res.shopItem, "").node
        mainscene.getChildByName('nodeItem1').addChild(item1)
        var item2 = ccs.load(res.shopItem, "").node
        mainscene.getChildByName('nodeItem2').addChild(item2)
        var item3 = ccs.load(res.shopItem, "").node
        mainscene.getChildByName('nodeItem3').addChild(item3)

        this.addChild(mainscene,0,'scene');
        // this.getChildByName('scene').getChildByName('goldItem1').addClickEventListener(() => {
        //     this.addBlockLayer();
        // });
        // this.addBlockLayer()
        for(var i=1;i<=3; i++) {
            var itemGold = this.getChildByName('scene').getChildByName('goldItem'+i).getChildByName('Image_1')
            cc.eventManager.addListener(this.listener1.clone(), itemGold);
        }
        // this.showPopup()

    },
    updateRealTime:function (dt){
        this.s -= dt
        if(this.s <0) {
            this.s = 60
            this.m -= 1
        }
    },

    updateTimeUI:function (dt){
        var str
        if(this.m >0){
            str = this.m+'m ' +Math.floor(this.s) +'s'
        }else{
            str = this.s +'s'
        }

        this.getChildByName('scene').getChildByName('loginItem').getChildByName('time').setString(str)
    },
    update:function (dt){
        this.updateRealTime(dt)
        this.updateTimeUI()
    },
    showPopup:function (){
        if(this.popupGold == null) {
            this.popupGold = ccs.load(res.popupGold, "").node
            this.popupGold.setPosition(winSize.width/2,winSize.height*2/5)
            this.addChild(this.popupGold)
        }
        // this.popupGold.opacity = 0
        // this.popupGold.scale = 0.2
        // cc.tween(this.popupGold)
        //     .to(0.5, {scale: 1, opacity: 255},{easing: "quartInOut"})
        //     .start();
    },
    hidePopup:function (){

    },
    addBlockLayer:function () {
        // this.unscheduleAllCallbacks()
        var blockLayer = new cc.Sprite(res.house_box)
        blockLayer.setScaleX(1.3*winSize.width/blockLayer.getContentSize().width)
        blockLayer.setScaleY(1.3*winSize.height/blockLayer.getContentSize().height)
        blockLayer.setPosition(winSize.width/2, winSize.height/2)
        this.addChild(blockLayer,0)
        cc.eventManager.addListener(this.listener1.clone(), blockLayer);

        var item4 = ccs.load(res.popupGold, "").node
        item4.setPosition(winSize.width/2,winSize.height*2/5)
        this.addChild(item4,0,'scene');

    },



});

