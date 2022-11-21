
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
        this.schedule(this.updateTimeUI, 1)
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
        item1.getChildByName('button').addClickEventListener(()=>this.showPopupChest(item1, 0, 1))
        mainscene.getChildByName('nodeItem1').addChild(item1,0,1)
        var item2 = ccs.load(res.cardItemShop, "").node.getChildByName('itemNode')
        item2.removeFromParent(true)
        mainscene.getChildByName('nodeItem2').addChild(item2,0,2)
        // item2.getChildByName('button').addClickEventListener(()=>this.showPopupCard(item2, 2))
        var item3 = ccs.load(res.cardItemShop, "").node.getChildByName('itemNode')
        item3.removeFromParent(true)
        mainscene.getChildByName('nodeItem3').addChild(item3,0,3)
        // item3.getChildByName('button').addClickEventListener(()=>this.showPopupCard(item3, 3))

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
        // let newCards = []
        // for(var i=0; i<1; i++){
        //     var typeCard = 2
        //     var numCardGet = 35
        //     var card = sharePlayerInfo.collection[typeCard]
        //     var lvl = card.level
        //     var newFrag = card.fragment + numCardGet
        //     var newCard = new Card(typeCard, lvl, 35);
        //     newCards.push(newCard)
        // }
        // LobbyInstant.addChild(new OpenChestAnimationUI(newCards, 20),3);

    },

    showPopupCard:function (cardID,numGold, numSlot){
        this.numSlot = numSlot
        this.popup = new PopupCard(cardID,numGold)
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
        sharePlayerInfo.gold += parseInt(packet.amout)
        if(this.popup != null) {
            if (this.popup.getChildByTag(100).getChildByName('numCost') != null) {
                sharePlayerInfo.gem -= parseInt(this.popup.getChildByTag(100).getChildByName('numCost').getString())
                this.removeChild(this.popup)
                var g = new GoldFly(new cc.p(winSize.width / 2, winSize.height * 0.5), new cc.p(winSize.width * 0.242, winSize.height * 0.968), packet.amout)
                LobbyInstant.addChild(g, 5000)
            }
        }
        else{
            LobbyInstant.currencyPanel.updateLabelsGold(20)
            this.updateCanBuyUI()
        }
    },

    updateBuyCard:function (packet){
        sharePlayerInfo.gold -= parseInt(packet.cost)
        LobbyInstant.currencyPanel.updateLabelsGold(Math.floor(packet.cost/50)+1)
        cc.log(parseInt(packet.cost))
        cc.log(sharePlayerInfo.gold)
        cc.log(LobbyInstant.currencyPanel.tmpGold)
        // this.removeChild(this.popup)
        this.updateCanBuyUI()
        this.updateBuySlot()
        var leng = packet.leng
        let newCards = []
        for(var i=0; i<leng; i++){
            var typeCard = packet.buyList[i][0]
            var numCardGet = packet.buyList[i][1]
            var card = sharePlayerInfo.collection[typeCard]
            var lvl = card.level
            var newFrag = card.fragment + numCardGet
            var newCard = new Card(typeCard, lvl, newFrag);
            newCards.push(newCard)
        }
        sharePlayerInfo.addNewCards(newCards);

    },

    updateBuyChest:function (packet){
        sharePlayerInfo.gold -= parseInt(packet.cost)
        LobbyInstant.currencyPanel.updateLabelsGold(Math.floor(packet.cost/50)+1)
        this.removeChild(this.popup)
        this.updateCanBuyUI()
        this.updateBuySlot()
        var leng = packet.leng
        let newCards = []
        for(var i=0; i<leng; i++){
            var typeCard = packet.buyList[i][0]
            var numCardGet = packet.buyList[i][1]
            var card = sharePlayerInfo.collection[typeCard]
            var lvl = card.level
            var newFrag = card.fragment + numCardGet
            var newCard = new Card(typeCard, lvl, newFrag);
            cc.log(newFrag+'newFrag')
            newCards.push(newCard)
            // newCards2.push(newCard)
        }
        LobbyInstant.addChild(new OpenChestAnimationUI(newCards, 100),3);
        sharePlayerInfo.addNewCards(newCards);


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
        // setInterval(()=>{
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
        // },1000)


    },

    /**
     * update shop daily tu server
     **/
    updateShop:function (pkg){
        this.updateChest(pkg)
        this.updateCard(pkg)
        this.updateCanBuyUI()
    },

    updateChest:function (pkg){
        const chestID = pkg.chestOffers[0][0]
        var chest = this.getChildByName('scene').getChildByName('nodeItem1').getChildByTag(1)
        chest.getChildByName('button').addClickEventListener(()=>this.showPopupChest(chest, chestID, 1))
        chest.getChildByName('numCost').setString(pkg.chestOffers[0][1])
    },

    updateCard:function (pkg){
        var cardID1 = pkg.cardOffers[0][0]
        cc.log(cardID1+'===========')
        // if(cardID1 >= sharePlayerInfo.collection.length){
        //     cardID1 = sharePlayerInfo.collection.length -2
        // }
        // if(cardID1 >= 8){
        //     cardID1 = 7
        // }
        var cardInfor1 = sharePlayerInfo.collection[cardID1]
        var card1 = this.getChildByName('scene').getChildByName('nodeItem2').getChildByTag(2)
        card1.getChildByName('item').setTexture(cardInfor1.texture)
        card1.getChildByName('numCost').setString(pkg.cardOffers[0][1])
        card1.getChildByName('button').addClickEventListener(()=>this.showPopupCard(cardID1, pkg.cardOffers[0][1], 2))
        card1.getChildByName('numCard').setString('x30')
        var cardID2 = pkg.cardOffers[1][0]
        cc.log(cardID2+'===========')
        // if(cardID2 >= 8){
        //     cardID2 = 7
        // }
        var cardInfor2 = sharePlayerInfo.collection[cardID2]
        var card2 = this.getChildByName('scene').getChildByName('nodeItem3').getChildByTag(3)
        card2.getChildByName('item').setTexture(cardInfor2.texture)
        card2.getChildByName('numCost').setString(pkg.cardOffers[1][1])
        card2.getChildByName('button').addClickEventListener(()=>this.showPopupCard(cardID2, pkg.cardOffers[1][1],3))
        card2.getChildByName('numCard').setString('x30')
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

