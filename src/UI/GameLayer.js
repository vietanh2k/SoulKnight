GamelayerInstance = null
ChapterMap = Array.from(
    {length: 10 + 1},
    () => Array.from(
        {length: 10 + 1},
        ()=> -1
    )
);

SaveMap = {};
CurMap = [4,1]
SavePlayer = null;
CurLvl = 1;
Cur_Chapter = 1;
Cur_Map = 1;

LVL_BOSS = 5;

DX = [1, -1, 0, 0]
DY = [0, 0, 1, -1]

//luu vi tri hien tai cua player
CurDx = 0;
CurDy = 1;
SMALL_MAP = null;

var GameLayer = cc.Layer.extend({
    camera: null,
    joystick: null,
    bg: null,
    player: null,
    btnFire: null,

    ctor: function(isResetMap) {
        this._super();
        this.isPause = false;
        this.optionUI = null;
        if (!cc.spriteFrameCache.isSpriteFramesWithFileLoaded(res.boomPlist)) {
            cc.spriteFrameCache.addSpriteFrames(res.boomPlist)
        }

        if (!cc.spriteFrameCache.isSpriteFramesWithFileLoaded(res.boss1Plist)) {
            cc.spriteFrameCache.addSpriteFrames(res.boss1Plist)
        }

        if (!cc.spriteFrameCache.isSpriteFramesWithFileLoaded(res.appearPlist)) {
            cc.spriteFrameCache.addSpriteFrames(res.appearPlist)
        }

        if(SMALL_MAP === null){
            SMALL_MAP = new SmallMap();
            SMALL_MAP.retain()

        }

        if(isResetMap){
            this.initNewChapterMap();
            let chapStr = "Chap "+Cur_Chapter+"-"+Cur_Map;
            var chap = new ccui.Text(chapStr, res.font_magic, 34)
            chap.setPosition(winSize.width/2, winSize.height/2+CELL_SIZE_UI*2)
            chap.opacity = 0;
            let seq = cc.sequence(cc.delayTime(1), cc.fadeIn(0.5), cc.delayTime(1), cc.fadeOut(0.7));
            let seq2 = cc.sequence(cc.delayTime(1), cc.scaleBy(0.3, 1.2), cc.delayTime(1.2), cc.callFunc(()=>{
                chap.removeFromParent(true);
            }));
            chap.runAction(seq);
            chap.runAction(seq2);
            this.addChild(chap, 1)
        }

        this.addSmallMap()
        SMALL_MAP.updatePos();

        this.resetKey();

        this.paddleHp = null;
        winSize = cc.director.getWinSize();
        this.bg = null;
        this.initFireBtn();
        this.initSwitchWeaponBtn();

        this.initSkillBtn();
        this.initBtnOption();
        this.isStop = false;
        GamelayerInstance = this
        this.bg = new BackgroundLayer();
        // this.initFireBtn();
        this.addChild(this.bg, -1);
        this.tmpCoin = 0;
        this.tmpEnergy = 0;
        if(SavePlayer != null){
            this.tmpCoin = SavePlayer.coin;
            this.tmpEnergy = SavePlayer.curMana;
            this.updateSwitchWp(SavePlayer.we.energy, SavePlayer.we.getTexture())
        }
        this.initStatPaddle();
        this.initCoinPaddle();
        this.joystick = new Joystick();
        this.joystick.setPosition(this.joystick.radius*1.3, this.joystick.radius*1.2 );
        this.joystick.opacity = 150;
        this.addChild(this.joystick);
        this.updateSwitchWp(SavePlayer.we.energy, SavePlayer.we.getTexture())
        this.addKeyboardListener();

        this.updateStatPaddle()
        this.updateCoinPaddle()
        this.scheduleUpdate();
    },

    addSmallMap: function() {
        let smallMapBack = new cc.Sprite(res.smallMapBack);
        smallMapBack.setPosition(winSize.width*0.835, winSize.height*0.6);
        smallMapBack.setAnchorPoint(0, 0)
        smallMapBack.opacity = 100

        this.addChild(smallMapBack)

        if(SMALL_MAP.getParent() != null){
            SMALL_MAP.removeFromParent(true);

        }
        var clippingNode = new cc.ClippingNode();
        var stencil = new cc.DrawNode();
        stencil.drawRect(new cc.p(0,0), new cc.p(150,150), new cc.p(150,0), new cc.p(150,150), cc.color(255, 0, 0, 0));

        // var spritePosition = SMALL_MAP.getPosition();
        // stencil.setPosition(spritePosition);
        //
        // var spriteAnchorPoint = SMALL_MAP.getAnchorPoint();
        // stencil.setAnchorPoint(spriteAnchorPoint);

        clippingNode.stencil = stencil;

        clippingNode.addChild(SMALL_MAP);
        clippingNode.setPosition(winSize.width*0.835, winSize.height*0.6)
        // clippingNode.setGlobalZOrder(3);
        this.addChild(clippingNode);

        let mapStr = Cur_Chapter+"-"+Cur_Map;
        var labelMap = new ccui.Text(mapStr, res.font_lama, 22);
        labelMap.setPosition(winSize.width*0.855, winSize.height*0.63);
        this.addChild(labelMap);

    },

    initCoinPaddle: function() {
        this.coinPaddle = ccs.load(res.coinPaddle, "").node;
        var coinBack = this.coinPaddle.getChildByName("back");

        this.coinPaddle.setPosition(winSize.width - coinBack.width*1.5, winSize.height - coinBack.height*1.5)

        this.addChild(this.coinPaddle,0);
        this.updateCoinPaddle()

    },

    updateCoinPaddle: function (dt) {
        if(this.coinPaddle != null){
            let coin = this.bg.player.coin;
            this.coinPaddle.getChildByName('num').setString(coin);
        }
    },

    initStatPaddle: function() {
        this.paddleHp = ccs.load(res.paddleHp, "").node;
        var paddleBack = this.paddleHp.getChildByName("paddle");
        this.paddleHp.setPosition(paddleBack.width/2+10, winSize.height - paddleBack.height/2)

        this.addChild(this.paddleHp,0,'scene');
        this.updateStatPaddle()

    },

    updateStatPaddle: function (dt) {
        if(this.paddleHp != null){
            let maxHp = this.bg.player.maxHp;
            let curHp = this.bg.player.curHp;
            let maxMana = this.bg.player.maxMana;
            let curMana = this.tmpEnergy;
            let maxS = this.bg.player.maxS;
            let curS = this.bg.player.curS;

            this.paddleHp.getChildByName('hpNum').setString(curHp+"/"+maxHp);
            var hpPercent = curHp/maxHp*100;
            if(hpPercent > 100) {
                hpPercent = 100;
            }
            this.paddleHp.getChildByName('hpBar').setPercent(hpPercent);

            this.paddleHp.getChildByName('eneryNum').setString(curMana+"/"+maxMana);
            var eneryPercent = curMana/maxMana*100;
            if(eneryPercent > 100) {
                eneryPercent = 100;
            }
            this.paddleHp.getChildByName('eneryBar').setPercent(eneryPercent);

            this.paddleHp.getChildByName('shieldNum').setString(curS+"/"+maxS);
            var shieldPercent = curS/maxS*100;
            if(shieldPercent > 100) {
                shieldPercent = 100;
            }
            this.paddleHp.getChildByName('shieldBar').setPercent(shieldPercent);
        }
    },

    initFireBtn: function() {
        this.btnFire = new ccui.Button(res.btnFire);
        this.btnFire.setScale(0.8)
        this.btnFire.opacity = 150
        this.btnFire.setPosition(winSize.width - this.btnFire.width/1.4, this.btnFire.width/2);
        this.addChild(this.btnFire, 999)
        // this.btnFire.addClickEventListener(() => {
        //     this.fireBullet()
        // });

        this.btnFire.addTouchEventListener(function(sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_BEGAN) {
                if(BackgroundLayerInstance.isItemCanActive) {
                    BackgroundLayerInstance.activeItem();
                    return
                }

                if(BackgroundLayerInstance.state === GAME_CONFIG.STATE_ONSTART){
                    return;
                }
                BackgroundLayerInstance.setTouchFireState(true)
            } else if (eventType == ccui.Widget.TOUCH_MOVED) {
                // Xử lý sự kiện khi người dùng di chuyển vị trí giữ button
            } else if (eventType == ccui.Widget.TOUCH_ENDED) {
                BackgroundLayerInstance.setTouchFireState(false)
            } else if (eventType == ccui.Widget.TOUCH_CANCELED) {
                BackgroundLayerInstance.setTouchFireState(false)
            }
        });

    },

    initSwitchWeaponBtn: function() {
        this.btnSwitch = new ccui.Button(res.btnSwitch);
        this.btnSwitch.setScale(0.8)
        this.btnSwitch.opacity = 150
        this.btnSwitch.setPosition(winSize.width - this.btnSwitch.width/1.4, this.btnSwitch.width*1.6);
        this.addChild(this.btnSwitch, 999)
        // this.btnFire.addClickEventListener(() => {
        //     this.fireBullet()
        // });

        this.btnSwitch.addClickEventListener(() => {
            BackgroundLayerInstance.player.switchWeapon();
        });

        let energy = new cc.Sprite(res.numEnergy);
        energy.setPosition(this.btnSwitch.width/4.5, this.btnSwitch.width/1.4)
        this.btnSwitch.addChild(energy);

        this.numEnergyWp = new ccui.Text('0', res.font_normal, 26)
        this.numEnergyWp.enableShadow()
        this.numEnergyWp.enableOutline(new cc.Color(255, 255, 255, 255), 5)
        this.numEnergyWp.setPosition(this.btnSwitch.width/4.5, this.btnSwitch.width/1.4)
        this.btnSwitch.addChild(this.numEnergyWp);

        this.curWp = new cc.Sprite(res.gun);
        this.curWp.setPosition(this.btnSwitch.width/2, this.btnSwitch.width/2)
        this.curWp.setScale(3)
        this.btnSwitch.addChild(this.curWp);

    },

    initSkillBtn: function() {
        this.skillNode = ccs.load(res.skillNode, "").node;
        this.skillNode.setScale(0.9);
        this.skillNode.opacity = 150;
        let back = this.skillNode.getChildByName("back");
        this.skillNode.getChildByName("barSkill").setPercent(100);
        this.skillNode.getChildByName("blueSkill").visible = true;
        this.skillNode.setPosition(winSize.width - back.width*1.95, back.height*0.55)

        this.skillNode.getChildByName("btn").addClickEventListener(() => {
            this.activePlayerSkill();
        });

        this.addChild(this.skillNode,0);

    },

    initBtnOption: function() {
        this.btnOption = ccui.Button(res.btnOption);
        this.btnOption.setPosition(winSize.width - this.btnOption.width/2-10, winSize.height - this.btnOption.height/2-10)
        this.btnOption.addClickEventListener(()=>{
            if(BackgroundLayerInstance.state == GAME_CONFIG.STATE_ONSTART) return;
            if(!this.isPause){
                this.isPause = true;
                BackgroundLayerInstance.objectView.pauseObj();
                this.showOption();
            }else {
                this.hideOption()
                this.isPause = false;
            }


        });
        this.addChild(this.btnOption, 1, 'btnOption');

    },

    showOptionLose: function(text) {
        this.isPause = true;
        this.btnOption.setTouchEnabled(false);
        BackgroundLayerInstance.objectView.pauseObj();
        if(this.optionUI == null){
            this.optionUI = new cc.Sprite(res.optionBack);
            this.optionUI.setPosition(winSize.width/2, winSize.height/2);
            this.optionUI.scale = 0.7;
            this.optionUI.opacity = 150;
            var seq = cc.sequence( cc.ScaleTo(0.1, 1));
            this.optionUI.runAction(seq);
            var seq2 = cc.sequence(  cc.fadeIn(0.1));
            this.optionUI.runAction(seq2);
            this.addChild(this.optionUI);

            var lb = new ccui.Text(text, res.font_magic, 30)
            lb.setPosition(this.optionUI.width/2, this.optionUI.height-28);
            this.optionUI.addChild(lb)

            var btnContin = ccui.Button(res.btnContin);
            btnContin.setPosition(this.optionUI.width/2, this.optionUI.height/2)
            btnContin.addClickEventListener(()=>{
                this.hideOption()
                this.isPause = false;
            });
            this.optionUI.addChild(btnContin, 1);
            btnContin.setTouchEnabled(false);
            btnContin.setColor(cc.color(126, 124, 140));

            var btnHome = ccui.Button(res.btnHome);
            btnHome.setPosition(this.optionUI.width/2, this.optionUI.height/2 - 75)
            btnHome.addClickEventListener(()=>{
                fr.view(LobbyUI, 1 );
            });
            this.optionUI.addChild(btnHome, 1);
        }
    },

    showOption: function() {
        if(this.optionUI == null){
            this.optionUI = new cc.Sprite(res.optionBack);
            this.optionUI.setPosition(winSize.width/2, winSize.height/2);
            this.optionUI.scale = 0.7;
            this.optionUI.opacity = 150;
            var seq = cc.sequence( cc.ScaleTo(0.1, 1));
            this.optionUI.runAction(seq);
            var seq2 = cc.sequence(  cc.fadeIn(0.1));
            this.optionUI.runAction(seq2);
            this.addChild(this.optionUI);

            var lb = new ccui.Text('Dừng', res.font_magic, 30)
            lb.setPosition(this.optionUI.width/2, this.optionUI.height-28);
            this.optionUI.addChild(lb)

            var btnContin = ccui.Button(res.btnContin);
            btnContin.setPosition(this.optionUI.width/2, this.optionUI.height/2)
            btnContin.addClickEventListener(()=>{
                this.hideOption()
                this.isPause = false;
            });
            this.optionUI.addChild(btnContin, 1);

            var btnHome = ccui.Button(res.btnHome);
            btnHome.setPosition(this.optionUI.width/2, this.optionUI.height/2 - 75)
            btnHome.addClickEventListener(()=>{
                fr.view(LobbyUI, 1 );
            });
            this.optionUI.addChild(btnHome, 1);
        }
    },

    hideOption: function() {
        if(this.optionUI != null){
            this.optionUI.removeFromParent(true);
            this.optionUI = null;
        }
    },

    activePlayerSkill: function() {
        if(BackgroundLayerInstance){
            BackgroundLayerInstance.player.pressSkill();
        }

    },

    updateSkillBtn: function() {
        let maxCd = this.bg.player.cdSkillMax;
        let curCd = this.bg.player.cdSkill;
        let percen = 0;
        if(curCd <= 0){
            percen = 100;
            this.skillNode.getChildByName("blueSkill").visible = true;
        }else{
            percen = (maxCd-curCd)/maxCd*100;
            this.skillNode.getChildByName("blueSkill").visible = false;
        }
        this.skillNode.getChildByName("barSkill").setPercent(percen);

    },

    updateLabelCoin: function(num) {
        this.tmpCoin += num;
        if (this.tmpCoin > BackgroundLayerInstance.player.coin) {
            this.tmpCoin = BackgroundLayerInstance.player.coin;
        }
        this.coinPaddle.getChildByName('num').setString(this.tmpCoin);
    },

    updateLabelEnergy: function(num) {
        this.tmpEnergy += num;
        if (this.tmpEnergy > BackgroundLayerInstance.player.curMana) {
            this.tmpEnergy = BackgroundLayerInstance.player.curMana;
        }
        let maxMana = BackgroundLayerInstance.player.maxMana;
        this.paddleHp.getChildByName('eneryNum').setString(this.tmpEnergy+"/"+maxMana);

    },

    updateSwitchWp: function(numEnergy, res) {
        this.numEnergyWp.setString(numEnergy);
        this.curWp.setTexture(res)
    },


    update: function(dt) {
        if(this.isPause) return;
            // this.bg.player.updateMove(this.joystick.direction, dt)
        if(BackgroundLayerInstance.state != GAME_CONFIG.STATE_ONSTART){
            this.updateMoveDirection(dt);
        }

            this.bg.update(dt);
            this.updateStatPaddle();
            // this.updateCoinPaddle();
            this.updateSkillBtn();
            // this.isStop++;
            if(this.isStop == true){
                this.newLvl()
            }
    },

    addKeyboardListener:function(){
        //Add code here

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {
                MW.KEYS[key] = true;
            },
            onKeyReleased: function (key, event) {
                MW.KEYS[key] = false;
            }
        }, this);

    },

    updateMoveDirection: function(dt) {
        if(this.joystick.direction.x !== 0 || this.joystick.direction.y !== 0){
            this.bg.player.updateMove(this.joystick.direction, dt)
        }else{
            let direc = new cc.p(0,0);
            if (MW.KEYS[cc.KEY.down]) {
                direc = cc.pAdd(direc, new cc.p(0, -1));
            }
            if (MW.KEYS[cc.KEY.up]) {
                direc = cc.pAdd(direc, new cc.p(0, 1));
            }
            if (MW.KEYS[cc.KEY.left]) {
                direc = cc.pAdd(direc, new cc.p(-1, 0));
            }
            if (MW.KEYS[cc.KEY.right]) {
                direc = cc.pAdd(direc, new cc.p(1, 0));
            }

            // if(direc.x !== 0 || direc.y !== 0) {
                direc = cc.pNormalize(direc);
                this.bg.player.updateMove(direc, dt)
            // }
        }
    },

    resetKey: function() {
        MW.KEYS[cc.KEY.down] = false;
        MW.KEYS[cc.KEY.left] = false;
        MW.KEYS[cc.KEY.up] = false;
        MW.KEYS[cc.KEY.right] = false;
    },

    initNewChapterMap:function () {

        // var spriteSize = cc.size(5, 5); // Kích thước hình vuông nhỏ
        // SMALL_MAP.setContentSize(spriteSize);

// Thiết lập chế độ hiển thị chỉ trong hình vuông nhỏ
//         SMALL_MAP.setCascadeBoundingBox(spriteSize);

        let ranMap = Math.floor(Math.random()*3);
        let map = cf.MAP2[ranMap];
        let startPoint = map.startPoint;
        CurMap = startPoint;
        let endPoint = map.endPoint;
        let midPointArr = map.midPoint;

        for(var i =0; i< ChapterMap.length; i++){
            for(var j =0; j< ChapterMap.length; j++) {
                ChapterMap[i][j] = -1;
            }
        }
        ChapterMap[startPoint[0]][startPoint[1]] = GAME_CONFIG.HOME_STATE;
        ChapterMap[endPoint[0]][endPoint[1]] = GAME_CONFIG.DES_STATE;

        for(var i=0; i<midPointArr.length; i++){
            let x = midPointArr[i][0];
            let y = midPointArr[i][1];
            ChapterMap[x][y] = GAME_CONFIG.ENEMY_STATE;
        }

        //tạo ô chest và ô shop
        let listPosible = [];           // list map co thể là ô chest
        for(var i = 0; i< ChapterMap.length; i++){      // lấy ra những ô kề
            for(var j = 0; j< ChapterMap.length; j++) {
                if(ChapterMap[i][j] <= 0 || ChapterMap[i][j] >= GAME_CONFIG.DES_STATE) continue;

                for(var k = 0;k < DX.length; k++){
                    let x = i + DX[k];
                    let y = j + DY[k]
                    if(ChapterMap[x][y] >= 0) continue;

                    listPosible.push([x,y]);
                }
            }
        }

        for(var i=0; i< 1; i++){
            if(listPosible.length <= 0) break;
            let ran = Math.floor((Math.random() * listPosible.length));
            ChapterMap[listPosible[ran][0]][listPosible[ran][1]] = GAME_CONFIG.CHEST_STATE;
            listPosible.splice(ran, 1)
        }

        for(var i=0; i< 1; i++){
            if(listPosible.length <= 0) break;
            let ran = Math.floor((Math.random() * listPosible.length));
            ChapterMap[listPosible[ran][0]][listPosible[ran][1]] = GAME_CONFIG.SPECIAL_STATE;
            listPosible.splice(ran, 1)
        }

        //sang chapter moi thi o middle
        CurDx = 0;
        CurDy = 0;
        SMALL_MAP.updateMap();
        return true;
    },



    viewNewMap: function(gateId) {
        this.unscheduleAllCallbacks()
        SavePlayer.removeFromParent(true);
        SavePlayer.removeSkill();

        //sang chapter moi
        if(gateId[0] === 0 && gateId[1] === 0){
            if(Cur_Map >= LVL_BOSS){
                GamelayerInstance.showOptionLose("Chiến Thắng");
                return;
            }

            CurLvl = Math.max(1, CurLvl - 1);   //giam level khi sang chapter moi

            if(Cur_Map >= 5){
                Cur_Map = 1;
                Cur_Chapter += 1;
            }else {
                Cur_Map += 1;
            }

            for (let key in SaveMap) {
                delete SaveMap[key];
            }
            fr.view_with_args(GameLayer, true);
        }else{
            //sang map moi

            let curMapKey = CurMap[0]+"-"+CurMap[1];
            let mapStatus = null;
            if(SaveMap.hasOwnProperty(curMapKey)) {
                mapStatus = SaveMap[curMapKey];
            }else{
                mapStatus = new MapStatus();
            }

            let mapW = MAP_WIDTH;
            let mapH = MAP_HEIGHT;

            BackgroundLayerInstance.objectView.saveObject()
            mapStatus.updateStatus2(BackgroundLayerInstance.mapView, BackgroundLayerInstance.objectView,
                mapW, mapH);
            SaveMap[curMapKey] = mapStatus;

            CurDx = CurMap[0] - gateId[0];
            CurDy = CurMap[1] - gateId[1];
            CurMap = gateId;
            fr.view(GameLayer);
        }
    }
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer);
    return scene;
};