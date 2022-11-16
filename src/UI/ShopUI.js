
var ShopUI = cc.Layer.extend({

    ctor:function () {
        this._super();

        this.m = 45
        this.s = 10

        this.popupGold = null
        this.goldItemID = null
        this.init()
        this.scheduleUpdate();
    },
    init:function () {

        winSize = cc.director.getWinSize();


        this.initItemUI();



        return true;
    },



    initItemUI:function()
    {
        var mainscene = ccs.load(res.shopScene, "").node;
        var item1 = ccs.load(res.shopItem, "").node.getChildByName('itemNode')
        item1.removeFromParent(false)
        mainscene.getChildByName('nodeItem1').addChild(item1,0,1)
        var item2 = ccs.load(res.cardItemShop, "").node.getChildByName('itemNode')
        item2.removeFromParent(false)
        mainscene.getChildByName('nodeItem2').addChild(item2,0,2)
        var item3 = ccs.load(res.cardItemShop, "").node.getChildByName('itemNode')
        item3.removeFromParent(false)
        mainscene.getChildByName('nodeItem3').addChild(item3,0,3)

        this.addChild(mainscene,0,'scene');
        var golditem1 = mainscene.getChildByName('goldItem1')
        golditem1.getChildByName('button').addClickEventListener(()=>this.showPopup(golditem1))
        var golditem2 = mainscene.getChildByName('goldItem2')
        golditem2.getChildByName('button').addClickEventListener(()=>this.showPopup(golditem2))
        var golditem3 = mainscene.getChildByName('goldItem3')
        golditem3.getChildByName('button').addClickEventListener(()=>this.showPopup(golditem3))


        // this.showPopup()

    },
    updateRealTime:function (dt){
        this.s -= dt
        if(this.s <0) {
            this.s = 60
            this.m -= 1
        }
    },

    showPopup:function (itemNode){
        cc.log(itemNode)
        cc.log('rrrrrrrrrrrrrrrrrrrrrrr')
        var pop = new PopupGold(itemNode)
        pop.setPosition(320,600)
        this.addChild(pop)
        // var to = new Toast('nooooo')
        // this.addChild(new ChestInfoUI(1,0, 2), 4);


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
    updateShop:function (pkg){
        this.getChildByName('scene').getChildByTag(1).getChildByName('numCost').setString(pkg.chestOffers[0][1])
    },

    update:function (dt){
        this.updateRealTime(dt)
        this.updateTimeUI()
    },




});

