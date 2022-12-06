

var MCard = cc.Sprite.extend({


    ctor:function (type) {
        // this.cardID = cardID
        this.energy = -1;
        this.type = type;
        this.rarity = null;
        this._super('res/card/card_background_4.png');
        this.concept = null
        this.initCardUI(type);
        this.onTouch = false;
        this.numSlot = -1;

        return true;
    },
    
    initCardUI:function (type){
        let cardInfor = sharePlayerInfo.collection.find(element => element.type === type);
        let levelConfig = cf.CARD_LEVEL.find(element => element.level === cardInfor.level);
        if (levelConfig === undefined) {
            cc.log('WARNING: levelConfig is undefined');
        } else {
            this.rarity = levelConfig.rarity;
        }
        this.concept = cardInfor.concept
        this.setTexture('res/card/card_background_'+(this.rarity+1)+'.png');
        var cardBorder = new cc.Sprite('res/card/card_border_'+(this.rarity+1)+'.png');
        var cardAvatar = new cc.Sprite(cardInfor.texture)
        cardBorder.setPosition(this.getContentSize().width * 0.5, this.getContentSize().height / 2)
        cardAvatar.setPosition(this.getContentSize().width * 0.5, this.getContentSize().height / 2)
        var energy = new cc.Sprite(res.energyIcon)
        var whiteColor = new cc.Color(255, 255, 255, 255);
        var blackColor = new cc.Color(0, 0, 0, 255);
        this.energy = cardInfor.energy
        this.energy = Math.floor(cardInfor.energy/3)
        var lbNumEnergy = new ccui.Text(this.energy, res.font_magic, 40)
        lbNumEnergy.setPosition(energy.getContentSize().width * 0.5, energy.getContentSize().height / 2)
        lbNumEnergy.enableShadow()
        lbNumEnergy.setTextColor(whiteColor)
        lbNumEnergy.enableOutline(blackColor, 1)
        energy.addChild(lbNumEnergy, 0,'numEnergy')
        energy.setScale(CELLWIDTH / energy.getContentSize().height * 0.7)
        energy.setPosition(this.getContentSize().width * 0.5, 0)

        this.addChild(cardBorder,0,'cardBorder')
        this.addChild(cardAvatar,0,'cardAvatar')
            // var btnRemoveCard = ccui.Button('res/battle/battle_btn_destroy.png');
            // btnRemoveCard.setScale(CELLWIDTH / btnRemoveCard.getContentSize().width * 2.2)
            // btnRemoveCard.setPosition(this.getContentSize().width * 0.5, -CELLWIDTH*0.6)
            // btnRemoveCard.addClickEventListener(()=>this.touchRemoveCard);
            // this.addChild(btnRemoveCard, 0 , 'btnRemoveCard');
            // btnRemoveCard.visible = false
        this.addChild(energy,0,'energy')


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

    updateNewCard:function (type){
        this.type = type
        let cardInfor = sharePlayerInfo.collection.find(element => element.type === type);
        let levelConfig = cf.CARD_LEVEL.find(element => element.level === cardInfor.level);
        this.concept = cardInfor.concept
        this.energy = cardInfor.energy
        this.energy = Math.floor(cardInfor.energy/3)
        if (levelConfig === undefined) {
            cc.log('WARNING: levelConfig is undefined');
        } else {
            this.rarity = levelConfig.rarity;
        }
        this.setTexture('res/card/card_background_'+(this.rarity+1)+'.png')
        this.getChildByName('cardBorder').setTexture('res/card/card_border_'+(this.rarity+1)+'.png')
        this.getChildByName('cardAvatar').setTexture(cardInfor.texture)
        this.getChildByName('energy').getChildByName('numEnergy').setString(this.energy)
    },




    updateMove:function (dt){


    },


    destroy:function () {
    
    },
    getConcept: function (){
        return "tower";
    },
    getInstance: function (){
        switch (this.cardID){
            case 2:
                return "0"
            default:
                return "1"
        }
    }




});




