
let EndBattleUI = cc.Layer.extend({

    ctor:function (resultString,numTrophy) {
        this._super();
        this.inter = null
        this.init(resultString,numTrophy);



    },
    init:function (resultString, numTrophy) {
        winSize = cc.director.getWinSize();
        if(resultString == 'draw'){
            numTrophy = Math.floor(numTrophy/4);
        }
        let delayT = numTrophy*0.05+0.5;
        let seq1 = cc.sequence(cc.delayTime(0.7), cc.callFunc(()=>this.addAtlasEndBattle(resultString)),
            cc.delayTime(1.7), cc.callFunc(()=>this.addInforEndBattle(resultString)),
            cc.delayTime(1.7), cc.callFunc(()=>this.addTrophyEndBattle(numTrophy)),
            cc.delayTime(delayT), cc.callFunc(()=>this.addBtnBackEndBattle(resultString)))

        this.runAction(seq1)


        return true;
    },


    addAtlasEndBattle: function (resultString) {

        let resultAnimation = new sp.SkeletonAnimation("res/battle_result/fx/fx_result_" + resultString + ".json",
            "res/battle_result/fx/fx_result_" + resultString + ".atlas")
        resultAnimation.setScale(8.9 * WIDTHSIZE / resultAnimation.getBoundingBox().width)
        resultAnimation.setPosition(winSize.width / 2, winSize.height / 2 + CELLWIDTH * 0.2+CELLWIDTH*3)
        resultAnimation.setAnimation(0, "fx_result_" + resultString + "_init", false)
        resultAnimation.setOpacity(0)
        let seq = cc.sequence(cc.delayTime(0.5), cc.MoveTo(0.2,cc.p(winSize.width / 2, winSize.height / 2 + CELLWIDTH * 0.2)))
        let seq2 = cc.sequence(cc.delayTime(0.3), cc.fadeIn(0.55))
        let initSequence = cc.sequence(
            cc.callFunc(() => resultAnimation.setAnimation(0, "fx_result_" + resultString + "_init", false)),
            cc.delayTime(3),
            cc.callFunc(() => {
                resultAnimation.setAnimation(0, "fx_result_" + resultString + "_idle", true);
            }),
            cc.delayTime(1.75)
        );
        this.runAction(initSequence)
        resultAnimation.runAction(seq)
        resultAnimation.runAction(seq2)
        this.addChild(resultAnimation, 4001)
    },
    addInforEndBattle: function (resultString) {

        let infor = ccs.load(res.inforEndBattle, "").node;
        infor.getChildByName('name1').setString(sharePlayerInfo.name);
        let healthA = GameStateManagerInstance.playerA.health;
        let healthB = GameStateManagerInstance.playerB.health;
        infor.getChildByName('health1').setString(healthA);
        infor.getChildByName('health2').setString(healthB);
        if(healthA == 0){
            infor.getChildByName('health1').setTextColor(new cc.Color(191, 26, 64, 255))
        }
        if(healthB == 0){
            infor.getChildByName('health2').setTextColor(new cc.Color(191, 26, 64, 255))
        }
        infor.getChildByName('trophyGet').setString(0);
        if(resultString == 'win' || resultString == 'draw'){
            infor.getChildByName('Text_12').setString('+');
        }else{
            infor.getChildByName('Text_12').setString('-');
        }
        infor.setPosition(0, -CELLWIDTH);
        infor.setOpacity(0);
        let seq = cc.sequence(cc.delayTime(0.95), cc.MoveBy(0.3,cc.p(0,CELLWIDTH)));
        let seq2 = cc.sequence(cc.delayTime(0.95), cc.fadeIn(0.35));
        infor.runAction(seq);
        infor.runAction(seq2);
        this.addChild(infor, 4002, 4002);
    },
    addTrophyEndBattle: function (num) {
        let infor = this.getChildByTag(4002)
        let tmp = 0
        this.inter =setInterval(()=>{
            infor.getChildByName('trophyGet').setString(tmp);
            tmp +=1;
            if(tmp == num) {
                clearInterval(this.inter);
            }
        },50)

    },

    addBtnBackEndBattle: function (resultString) {

        let btnBack = ccui.Button('res/common/common_btn_blue.png');
        btnBack.setTitleText('Trở Về')
        btnBack.setTitleFontName(res.font_magic)

        btnBack.setScale((WIDTHSIZE * 1.4 / 7) / btnBack.getNormalTextureSize().height)
        btnBack.setTitleFontSize(23)
        btnBack.setPosition(winSize.width / 2, winSize.height / 2 + HEIGHTSIZE * -3.85 / 9-CELLWIDTH)
        btnBack.addClickEventListener(this.backToLobby);
        btnBack.opacity = 0
        let seq = cc.sequence( cc.MoveBy(0.25,cc.p(0,CELLWIDTH)))
        let seq2 = cc.sequence(cc.fadeIn(0.35))
        btnBack.runAction(seq)
        btnBack.runAction(seq2)
        this.addChild(btnBack, 4003);
    },


    backToLobby:function () {
        clearInterval(this.inter);
        fr.view(LobbyScene)


    },



});
