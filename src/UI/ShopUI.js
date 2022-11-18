
var ShopUI = cc.Layer.extend({

    ctor:function () {
        this._super();

        this.m = 45
        this.s = 10

        this.popup = null
        /**
         * slot đang mua là slot nào
         **/
        this.numSlot = null
        this.init()
        // this.scheduleUpdate();
    },
    init:function () {

        winSize = cc.director.getWinSize();


        this.initItemUI();



        return true;
    },


    /**
     * khởi tạo UI cho các item
     **/
    initItemUI:function()
    {
        var mainscene = ccs.load(res.shopScene, "").node;
        var item1 = ccs.load(res.shopItem, "").node.getChildByName('itemNode')
        item1.removeFromParent(true)
        mainscene.getChildByName('nodeItem1').addChild(item1,0,1)
        var item2 = ccs.load(res.cardItemShop, "").node.getChildByName('itemNode')
        item2.removeFromParent(true)
        mainscene.getChildByName('nodeItem2').addChild(item2,0,2)
        item2.getChildByName('button').addClickEventListener(()=>this.showPopupCard(item2, 2))
        var item3 = ccs.load(res.cardItemShop, "").node.getChildByName('itemNode')
        item3.removeFromParent(true)
        mainscene.getChildByName('nodeItem3').addChild(item3,0,3)
        item3.getChildByName('button').addClickEventListener(()=>this.showPopupCard(item3, 3))

        this.addChild(mainscene,0,'scene');
        var golditem1 = mainscene.getChildByName('goldItem1')
        golditem1.getChildByName('button').addClickEventListener(()=>this.showPopupGold(golditem1))
        var golditem2 = mainscene.getChildByName('goldItem2')
        golditem2.getChildByName('button').addClickEventListener(()=>this.showPopupGold(golditem2))
        var golditem3 = mainscene.getChildByName('goldItem3')
        golditem3.getChildByName('button').addClickEventListener(()=>this.showPopupGold(golditem3))
        this.updateTimeUI()
        this.updateCanBuyUI()

    },

    showPopupGold:function (itemNode){
        this.popup = new PopupGold(itemNode)
        this.popup.setPosition(winSize.width/2,winSize.height*5/9)
        this.addChild(this.popup,0,'popup')

    },

    showPopupCard:function (itemNode, numSlot){
        this.numSlot = numSlot
        this.popup = new PopupCard(itemNode)
        this.popup.setPosition(winSize.width/2,winSize.height*5/9)
        this.addChild(this.popup,0,'popup')
    },

    showPopupChest:function (itemNode, chestID, numSlot){
        this.numSlot = numSlot
        this.popup = new PopupChest(itemNode, chestID)
        this.popup.setPosition(winSize.width/2,winSize.height*0.425)
        this.addChild(this.popup,0,'popup')

    },

    updateBuyGold:function (packet){
        cc.log(this.popup.getChildByTag(100).getChildByName('numGold').getString())
        sharePlayerInfo.gold += parseInt(packet.amout)
        sharePlayerInfo.gem -= parseInt(this.popup.getChildByTag(100).getChildByName('numCost').getString())
        LobbyInstant.currencyPanel.updateLabels()
        this.removeChild(this.popup)
        this.updateCanBuyUI()
    },

    updateBuyCard:function (packet){
        // cc.log(this.popup.getChildByTag(100).getChildByName('numGold').getString())
        sharePlayerInfo.gold -= parseInt(packet.cost)
        LobbyInstant.currencyPanel.updateLabels()
        this.removeChild(this.popup)
        this.updateCanBuyUI()
        this.updateBuySlot()
    },

    updateBuyChest:function (packet){
        sharePlayerInfo.gold -= parseInt(packet.cost)
        LobbyInstant.currencyPanel.updateLabels()
        this.removeChild(this.popup)
        this.updateCanBuyUI()
        this.updateBuySlot()
    },
    /**
     * moi ngay chi mua 1 lan
     * Mua xong thi khong mua duoc nua
     **/
    updateBuySlot:function (){
        if(this.numSlot != null){
            this.getChildByName('scene').getChildByName( 'nodeItem' +this.numSlot).getChildByTag(this.numSlot).getChildByName('button').visible = false
            this.getChildByName('scene').getChildByName( 'nodeItem' +this.numSlot).getChildByTag(this.numSlot).getChildByName('numCost').visible = false
            this.getChildByName('scene').getChildByName( 'nodeItem' +this.numSlot).getChildByTag(this.numSlot).setOpacity(180)
            var updateBuy = ccs.load(res.updateBuy, "").node;
            this.getChildByName('scene').getChildByName( 'nodeItem' +this.numSlot).addChild(updateBuy)
        }
    },

    /**
     * thoi gian reset shop daily
     * update moi 1s
     **/
    updateTimeUI:function (){
        setInterval(()=>{
            let today = new Date()
            let tomorrow =  new Date()
            tomorrow.setDate(today.getDate() + 1)
            tomorrow.setHours(0,0,0,0)
            var remainTime = tomorrow.getTime()-today.getTime()
            var sec = Math.floor((remainTime/1000) % 60)
            var minute = Math.floor((remainTime/1000/60)% 60)
            var hour = Math.floor(remainTime/1000/60/60)
            var str = ''
            if(hour > 0){
                str += hour +'h '
            }
            if(minute > 0){
                str += minute+'m'
            }
            if(hour == 0 && minute == 0){
                str += sec +'s'
            }
            this.getChildByName('scene').getChildByName('loginItem').getChildByName('time').setString(str)
        },1000)


    },

    /**
     * update shop daily tu server
     **/
    updateShop:function (pkg){
        this.updateChest(pkg)
    },

    updateChest:function (pkg){
        const chestID = pkg.chestOffers[0][0]
        var chest = this.getChildByName('scene').getChildByName('nodeItem1').getChildByTag(1)
        chest.getChildByName('button').addClickEventListener(()=>this.showPopupChest(chest, chestID, 1))
        chest.getChildByName('numCost').setString(pkg.chestOffers[0][1])
    },

    /**
     * UI có đủ tiền hay không
     **/
    updateCanBuyUI:function (dt){
        for(var i=1 ; i<=3 ; i++){
            if(sharePlayerInfo.gold < parseInt(this.getChildByName('scene').getChildByName('nodeItem'+i).getChildByTag(i).getChildByName('numCost').getString())) {
                this.getChildByName('scene').getChildByName('nodeItem'+i).getChildByTag(i).getChildByName('numCost').setTextColor(new cc.Color(191, 26, 64, 255))
            }else{
                this.getChildByName('scene').getChildByName('nodeItem'+i).getChildByTag(i).getChildByName('numCost').setTextColor(new cc.Color(255, 255, 255, 255))
            }
        }
        for(var i=4 ; i<=6 ; i++){
            if(sharePlayerInfo.gem < parseInt(this.getChildByName('scene').getChildByTag(i).getChildByName('numCost').getString())) {
                this.getChildByName('scene').getChildByTag(i).getChildByName('numCost').setTextColor(new cc.Color(191, 26, 64, 255))
            }else{
                this.getChildByName('scene').getChildByTag(i).getChildByName('numCost').setTextColor(new cc.Color(255, 255, 255, 255))
            }
        }
    },

    update:function (dt){

    },




});

