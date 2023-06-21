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

DX = [1, -1, 0, 0]
DY = [0, 0, 1, -1]

var GameLayer = cc.Layer.extend({
    camera: null,
    joystick: null,
    bg: null,
    player: null,
    btnFire: null,

    ctor: function(isResetMap) {
        this._super();
        if(isResetMap){
            this.initNewChapterMap()
        }
        this.paddleHp = null;
        winSize = cc.director.getWinSize();
        this.bg = null;
        this.initFireBtn();
        this.initSwitchWeaponBtn();

        this.initSkillBtn();
        this.isStop = false;
        GamelayerInstance = this
        this.bg = new BackgroundLayer();
        // this.initFireBtn();
        this.addChild(this.bg, -1);
        this.initStatPaddle();
        this.joystick = new Joystick();
        this.joystick.setPosition(this.joystick.radius*1.3, this.joystick.radius*1.2 );
        this.joystick.opacity = 150;
        this.addChild(this.joystick);

        this.scheduleUpdate();
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
            let curMana = this.bg.player.curMana;
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

    fireBullet: function() {
        var bullet = this.bg.player.createBullet()
        this.bg.objectView.addBullet(bullet)

    },

    updateSwitchWp: function(numEnergy, res) {
        this.numEnergyWp.setString(numEnergy);
        this.curWp.setTexture(res)
    },


    update: function(dt) {
            this.bg.player.updateMove(this.joystick.direction, dt)
            this.bg.update(dt);
            this.updateStatPaddle();
            this.updateSkillBtn();
            // this.isStop++;
            if(this.isStop == true){
                this.newLvl()
            }
    },

    initNewChapterMap:function () {
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
        for(var i=0; i<ChapterMap.length; i++){
            for(var j=0; j<ChapterMap[i].length; j++){
                if(ChapterMap[i][j]>=0){
                    cc.log("Map "+i+"-"+j+"= "+ChapterMap[i][j])
                }
            }
        }
        return true;
    },



    viewNewMap: function(gateId) {
        cc.log("size2=="+BackgroundLayerInstance.objectView.items.size())

        this.unscheduleAllCallbacks()
        SavePlayer.removeFromParent(true);
        SavePlayer.removeSkill();
        if(gateId[0] === 0 && gateId[1] === 0){
            for (let key in SaveMap) {
                delete SaveMap[key];
            }
            fr.view_with_args(GameLayer, true);
        }else{
            let curMapKey = CurMap[0]+"-"+CurMap[1];
            let mapStatus = null;
            if(SaveMap.hasOwnProperty(curMapKey)) {
                mapStatus = SaveMap[curMapKey];
            }else{
                mapStatus = new MapStatus();
            }
            let wp1 = BackgroundLayerInstance.player.we.getId();
            let wp2;
            if(BackgroundLayerInstance.player.otherWeapon !== null){
                wp2 = BackgroundLayerInstance.player.otherWeapon.getId();
            }

            let mapW = MAP_WIDTH;
            let mapH = MAP_HEIGHT;

            BackgroundLayerInstance.objectView.saveObject()
            mapStatus.updateStatus2(BackgroundLayerInstance.mapView, BackgroundLayerInstance.objectView,
                mapW, mapH);
            SaveMap[curMapKey] = mapStatus;
            cc.log("size=="+BackgroundLayerInstance.objectView.items.size())



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