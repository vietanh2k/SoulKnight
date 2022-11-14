

var MCard = cc.Sprite.extend({


    ctor:function (cardID) {
        this.cardID = cardID
        this.energy = -1
        this._super('asset/card/card_background_4.png');
        this.initCardUI(cardID)
        this.onTouch = false
        this.numSlot = -1
        return true;
    },
    
    initCardUI:function (cardID){
        cc.log("cardID "+ cardID);
        this.setTexture(CardConfig[cardID].resCardBackGround)
        this.cardID = CardConfig[cardID].cardID
        var cardBorder = new cc.Sprite(CardConfig[cardID].resCardBorder)
        var cardAvatar = new cc.Sprite(CardConfig[cardID].resCardAvatar)
        cardBorder.setPosition(this.getContentSize().width * 0.5, this.getContentSize().height / 2)
        cardAvatar.setPosition(this.getContentSize().width * 0.5, this.getContentSize().height / 2)
        var energy = new cc.Sprite(res.energyIcon)
        var whiteColor = new cc.Color(255, 255, 255, 255);
        var blackColor = new cc.Color(0, 0, 0, 255);
        this.energy = CardConfig[cardID].numEnergy
        var lbNumEnergy = new ccui.Text(CardConfig[cardID].numEnergy, res.font_magic, 40)
        lbNumEnergy.setPosition(energy.getContentSize().width * 0.5, energy.getContentSize().height / 2)
        lbNumEnergy.enableShadow()
        lbNumEnergy.setTextColor(whiteColor)
        lbNumEnergy.enableOutline(blackColor, 1)
        energy.addChild(lbNumEnergy, 0,'numEnergy')
        energy.setScale(CELLWIDTH / energy.getContentSize().height * 0.7)
        energy.setPosition(this.getContentSize().width * 0.5, 0)

        this.addChild(cardBorder,0,'cardBorder')
        this.addChild(cardAvatar,0,'cardAvatar')
        if(CardConfig[cardID].numEnergy >= 0){
            // var btnRemoveCard = ccui.Button('asset/battle/battle_btn_destroy.png');
            // btnRemoveCard.setScale(CELLWIDTH / btnRemoveCard.getContentSize().width * 2.2)
            // btnRemoveCard.setPosition(this.getContentSize().width * 0.5, -CELLWIDTH*0.6)
            // btnRemoveCard.addClickEventListener(()=>this.touchRemoveCard);
            // this.addChild(btnRemoveCard, 0 , 'btnRemoveCard');
            // btnRemoveCard.visible = false
            this.addChild(energy,0,'energy')
        }


    },

    setCardUpUI:function (){
        this.getChildByName('energy').visible = false
        if(this.getChildByName('btnRemoveCard') != null) {
            this.getChildByName('btnRemoveCard').visible = true
        }
    },

    setCardDownUI:function (){
        this.getChildByName('energy').visible = true
        if(this.getChildByName('btnRemoveCard') != null) {
            this.getChildByName('btnRemoveCard').visible = false
        }
    },

    updateNewCard:function (cardID){
        this.cardID = cardID
        this.energy = CardConfig[cardID].numEnergy
        this.setTexture(CardConfig[cardID].resCardBackGround)
        this.getChildByName('cardBorder').setTexture(CardConfig[cardID].resCardBorder)
        this.getChildByName('cardAvatar').setTexture(CardConfig[cardID].resCardAvatar)
        this.getChildByName('energy').getChildByName('numEnergy').setString(CardConfig[cardID].numEnergy)
    },

    updateSpeedVec:function (){
      

    },



    updateMove:function (dt){


    },


    destroy:function () {
    
    },




});




