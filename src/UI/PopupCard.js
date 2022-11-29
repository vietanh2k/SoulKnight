
var PopupCard = cc.Node.extend({

    ctor:function (cardID,numGold, numCard) {
        this._super();
        this.setPosition(winSize.width/2,winSize.height*5/9)
        this.init(cardID,numGold, numCard)
        this.interval = null

    },
    init:function (cardID,numGold, numCard) {

        winSize = cc.director.getWinSize();
        let cardInfor = sharePlayerInfo.collection.find(element => element.type === cardID);
        var popup = ccs.load(res.popupCard, "").node
        // popup.getChildByName('cBackground').setTexture(item.getChildByName('background').getTexture())
        popup.getChildByName('nameCard').setString(cardInfor.name)
        cc.log('============='+cardInfor.name)
        popup.getChildByName('cAvatar').setTexture(cardInfor.texture)
        popup.getChildByName('numCardGet').setString('x'+numCard)
        popup.getChildByName('numCost').setString(numGold)
        var strNumCard = cardInfor.fragment +'/' +cardInfor.reqFrag
        popup.getChildByName('numCard').setString(strNumCard)
        var percen = cardInfor.fragment / cardInfor.reqFrag*100
        popup.getChildByName('loading1').setPercent(percen)
        popup.getChildByName('cBorder').addClickEventListener(()=>{
            let cardInfoUI = new CardInfoUI(new Card(cardInfor.type, cardInfor.level, cardInfor.fragment))
            cardInfoUI.getChildByName('botPanelBackground').removeAllChildrenWithCleanup(true)
            LobbyInstant.addChild(cardInfoUI, 6000, cf.TAG_CARDINFOUI);
        })
        if(percen < 100) {
            popup.getChildByName('loadingMax').visible = false
        }
        this.addChild(popup,0,100)
        this.addBlockLayer()
        this.getChildByTag(100).getChildByName('btnBack').addClickEventListener(()=>this.hide())
        this.getChildByTag(100).getChildByName('button').addClickEventListener(()=>this.requestBuy(cardID, numCard, numGold))
        if(sharePlayerInfo.gold < parseInt(popup.getChildByName('numCost').getString())){
            popup.getChildByName('button').setColor(new cc.Color(132,117,84,255))
            popup.getChildByName('button').setTouchEnabled(false)
            popup.getChildByName('numCost').setTextColor(new cc.Color(191, 26, 64, 255))
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

    buyUI:function (){
        var numCardGet = this.getChildByTag(100).getChildByName('numCardGet').getString()
        var tmp = numCardGet.split('x')
        var num = parseInt(tmp[1])
        var delay = 0.6
        for(var i=0 ; i<num ; i++){

            var card = ccs.load(res.cardUI, "").node
            card.setPosition(0, -61.75)
            card.getChildByName('background').setTexture(this.getChildByTag(100).getChildByName('cBackground').getTexture())
            // card.getChildByName('border').setTexture(this.getChildByTag(100).getChildByName('cBorder').getTextureNormal())
            card.getChildByName('item').setTexture(this.getChildByTag(100).getChildByName('cAvatar').getTexture())
            var seq = cc.sequence(cc.delayTime(0.05),cc.ScaleBy(0.55, 0.2), cc.delayTime(delay-0.05), cc.RotateBy(0.4,-10))
            var seq2 = cc.sequence(cc.delayTime(0.05), cc.MoveTo(0.5,new cc.p(100,-110)), cc.delayTime(delay),cc.MoveTo(0.5, new cc.p(-80,44)),cc.fadeOut(0))

            //,cc.callFunc(()=> this.updateLabelCard())
            card.runAction(seq)
            card.runAction(seq2)
            this.addChild(card)
            delay+= 0.05
        }
        var seq3 = cc.sequence( cc.delayTime(1.65), cc.callFunc(()=> this.updateLabelCard(num)))
        this.runAction(seq3)
    },

    updateLabelCard:function (num){
        var label = this.getChildByTag(100).getChildByName('numCard')
        var loading1 = this.getChildByTag(100).getChildByName('loading1')

        var tmp = label.getString().split('/')
        var lb1 = parseInt(tmp[0])
        var lb2 = parseInt(tmp[1])
        var count = 1
        this.interval = setInterval(()=>{
            lb1 += 1
            var percen = lb1/lb2*100
            if(percen >=100) {
                percen = 100
                this.getChildByTag(100).getChildByName('loadingMax').visible = true
            }
            label.setString(lb1 + '/' + lb2)
            loading1.setPercent(percen)
            if(count >=num){
                clearInterval(this.interval);
            }
            count += 1
        },50)
    },

    hide:function (){
        clearInterval(this.interval);
        this.removeFromParent(true)
    },



    requestBuy:function (cardID, numCard, cost){
        this.getChildByTag(100).getChildByName('button').setColor(new cc.Color(132,117,84,255))
        this.getChildByTag(100).getChildByName('button').setTouchEnabled(false)
        this.buyUI()
        var leng = 1
        var buyList = []
        buyList.push([cardID, numCard])
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



});

