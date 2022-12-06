
var ShopUI = cc.Layer.extend({

    ctor:function () {
        this._super();

        this.m = 45
        this.s = 10

        this.popup = null
        this.lbCantLoad = null
        this.checkLoadSuccess = false
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

        this.addChild(mainscene,0,'scene');
        var golditem1 = mainscene.getChildByName('goldItem1')
        golditem1.getChildByName('touchLayer').addClickEventListener(()=>this.showPopupGold(golditem1))
        var golditem2 = mainscene.getChildByName('goldItem2')
        golditem2.getChildByName('touchLayer').addClickEventListener(()=>this.showPopupGold(golditem2))
        var golditem3 = mainscene.getChildByName('goldItem3')
        golditem3.getChildByName('touchLayer').addClickEventListener(()=>this.showPopupGold(golditem3))
        this.updateTimeUI()




    },


    showPopupGold:function (itemNode){
        this.popup = new PopupGold(itemNode)
        this.addChild(this.popup,0,'popup')
    },

    showPopupCard:function (cardID,numGold,numCard, numSlot){
        this.numSlot = numSlot
        this.popup = new PopupCard(cardID,numGold, numCard)

        this.addChild(this.popup,0,'popup')
        // var ex = new Explosion()
        // ex.setPosition(300, 500)
        // this.addChild(ex, 5000)
    },

    showPopupChest:function (itemNode, chestID, numSlot){
        this.numSlot = numSlot
        this.popup = new PopupChest(itemNode, chestID)
        this.addChild(this.popup,0,'popup')


    },

    updateBuyGold:function (packet){
        sharePlayerInfo.gold += parseInt(packet.amout)
        sharePlayerInfo.gem -= parseInt(this.popup.getChildByTag(100).getChildByName('numCost').getString())
        this.removeChild(this.popup)
        var g = new GoldFly(new cc.p(winSize.width / 2, winSize.height * 0.5), new cc.p(winSize.width * 0.242, winSize.height * 0.968), packet.amout)
        LobbyInstant.addChild(g, 5000)
    },

    updateBuyCard:function (packet){
        sharePlayerInfo.gold -= parseInt(packet.cost)
        LobbyInstant.currencyPanel.updateLabelsGold(Math.floor(packet.cost/50)+1)
        cc.log(parseInt(packet.cost))
        cc.log(sharePlayerInfo.gold)
        cc.log(LobbyInstant.currencyPanel.tmpGold)
        // this.removeChild(this.popup)
        this.updateCanBuyUI()
        this.updateBuySlot(this.numSlot)
        var leng = packet.leng
        let newCards = []
        for(var i=0; i<leng; i++){
            var typeCard = packet.buyList[i][0]
            var numCardGet = packet.buyList[i][1]
            var card = sharePlayerInfo.collection.find(element => element.type === typeCard);
            var lvl = card.level
            var newFrag = card.fragment + numCardGet
            var newCard = new Card(typeCard, lvl, newFrag);
            newCards.push(newCard)
        }
        sharePlayerInfo.addNewCards(newCards);

    },

    updateBuyChest:function (newCards, goldGet){
        sharePlayerInfo.gold += parseInt(goldGet)
        LobbyInstant.currencyPanel.updateLabelsGold(Math.floor(goldGet/50)+1)
        this.removeChild(this.popup)
        this.updateCanBuyUI()
        this.updateBuySlot(this.numSlot)
        LobbyInstant.addChild(new OpenChestAnimationUI(newCards, goldGet),3);
        sharePlayerInfo.addNewCards(newCards);


    },
    /**
     * moi ngay chi mua 1 lan
     * Mua xong thi khong mua duoc nua
     **/
    updateBuySlot:function (numSlot){
        if(numSlot != null){
            this.getChildByName('scene').getChildByName( 'nodeItem' +numSlot).getChildByTag(numSlot).getChildByName('button').visible = false
            this.getChildByName('scene').getChildByName( 'nodeItem' +numSlot).getChildByTag(numSlot).getChildByName('numCost').visible = false
            this.getChildByName('scene').getChildByName( 'nodeItem' +numSlot).getChildByTag(numSlot).setOpacity(180)
            var updateBuy = ccs.load(res.updateBuy, "").node;
            this.getChildByName('scene').getChildByName( 'nodeItem' +numSlot).addChild(updateBuy)
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
        cc.log(pkg.status)
        if(pkg.status == 'Success') {
            this.checkLoadSuccess = true
            cc.log('bbbbbbbbbbbbb')
            if(this.lbCantLoad != null){
                this.lbCantLoad.removeFromParent(true)
                this.lbCantLoad = null
            }
            this.updateChest(pkg)
            this.updateCard(pkg)
            this.updateCanBuyUI()
        }else{
            if(this.lbCantLoad == null){
                cc.log('aaaaaaaaaaaa')
                this.lbCantLoad = ccs.load(res.cantLoadShop, "").node;
                this.lbCantLoad.setPosition(winSize.width/2, winSize.height*0.74)
                this.addChild(this.lbCantLoad)
            }
        }
    },

    updateChest:function (pkg){
        var chest = ccs.load(res.shopItem, "").node.getChildByName('itemNode')
        chest.removeFromParent(true)
        this.getChildByName('scene').getChildByName('nodeItem1').addChild(chest,0,1)
        if(pkg.chestOffers.length >0) {
            const chestID = pkg.chestOffers[0][0]

            chest.getChildByName('touchLayer').addClickEventListener(() => this.showPopupChest(chest, chestID, 1))
            chest.getChildByName('numCost').setString(pkg.chestOffers[0][1])

        }else{
            this.updateBuySlot(1)
        }
    },

    updateCard:function (pkg){
        var card1 = ccs.load(res.cardItemShop, "").node.getChildByName('itemNode')
        card1.removeFromParent(true)
        this.getChildByName('scene').getChildByName('nodeItem2').addChild(card1,0,2)
        cc.log('collec:' + sharePlayerInfo.collection.length)
        if(pkg.cardOffers[0] != undefined) {
            var cardID1 = pkg.cardOffers[0][0]
            // var cardInfor1 = sharePlayerInfo.collection[cardID1]
            let cardInfor1 = sharePlayerInfo.collection.find(element => element.type === cardID1);


            card1.getChildByName('item').setTexture(cardInfor1.texture)
            card1.getChildByName('numCost').setString(pkg.cardOffers[0][2])
            card1.getChildByName('touchLayer').addClickEventListener(() => this.showPopupCard(cardID1, pkg.cardOffers[0][2],pkg.cardOffers[0][1], 2))
            card1.getChildByName('numCard').setString('x'+ pkg.cardOffers[0][1])

        }else{
            var card1 = this.getChildByName('scene').getChildByName('nodeItem2').getChildByTag(2)
            card1.getChildByName('numCard').setString('x30')
            this.updateBuySlot(2)
        }
        var card2 = ccs.load(res.cardItemShop, "").node.getChildByName('itemNode')
        card2.removeFromParent(true)
        this.getChildByName('scene').getChildByName('nodeItem3').addChild(card2,0,3)
        if(pkg.cardOffers[1] != undefined) {
            var cardID2 = pkg.cardOffers[1][0]
            let cardInfor2 = sharePlayerInfo.collection.find(element => element.type === cardID2);
            card2.getChildByName('item').setTexture(cardInfor2.texture)

            card2.getChildByName('numCost').setString(pkg.cardOffers[1][2])
            card2.getChildByName('touchLayer').addClickEventListener(() => this.showPopupCard(cardID2, pkg.cardOffers[1][2],pkg.cardOffers[1][1], 3))
            card2.getChildByName('numCard').setString('x'+ pkg.cardOffers[1][1])
        }else{
            var card2 = this.getChildByName('scene').getChildByName('nodeItem3').getChildByTag(3)
            card2.getChildByName('numCard').setString('x30')
            this.updateBuySlot(3)
        }
    },

    /**
     * UI có đủ tiền hay không
     **/
    updateCanBuyUI:function (dt){
        for(var i=1 ; i<=3 ; i++){
            if(this.getChildByName('scene').getChildByName('nodeItem'+i) != undefined) {
                if (sharePlayerInfo.gold < parseInt(this.getChildByName('scene').getChildByName('nodeItem' + i).getChildByTag(i).getChildByName('numCost').getString())) {
                    this.getChildByName('scene').getChildByName('nodeItem' + i).getChildByTag(i).getChildByName('numCost').setTextColor(new cc.Color(191, 26, 64, 255))
                } else {
                    this.getChildByName('scene').getChildByName('nodeItem' + i).getChildByTag(i).getChildByName('numCost').setTextColor(new cc.Color(255, 255, 255, 255))
                }
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

    destroyPopup:function (){
        while (this.getChildByName('popup') != null) {
            this.removeChild(this.getChildByName('popup'))
        }
    },




});

