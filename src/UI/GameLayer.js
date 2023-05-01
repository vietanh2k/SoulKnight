var GameLayer = cc.Layer.extend({
    camera: null,
    joystick: null,
    bg: null,
    player: null,
    btnFire: null,

    ctor: function() {
        this._super();
        winSize = cc.director.getWinSize();
        this.bg = new BackgroundLayer();
        this.addChild(this.bg, -1);

        this.joystick = new Joystick();
        this.joystick.setPosition(this.joystick.radius + 70, this.joystick.radius + 70);
        this.paddleHp = null;
        this.addChild(this.joystick);
        this.initFireBtn();
        this.initSwitchWeaponBtn();
        this.initStatPaddle();

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
        this.btnFire = new ccui.Button(res.gold);
        this.btnFire.setPosition(winSize.width - this.btnFire.width - 70, this.joystick.width + 70);
        this.addChild(this.btnFire, 999)
        // this.btnFire.addClickEventListener(() => {
        //     this.fireBullet()
        // });

        this.btnFire.addTouchEventListener(function(sender, eventType) {
            if (eventType == ccui.Widget.TOUCH_BEGAN) {
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
        this.btnSwitch = new ccui.Button(res.gold);
        this.btnSwitch.setPosition(winSize.width - this.btnSwitch.width, this.joystick.width + 140);
        this.addChild(this.btnSwitch, 999)
        // this.btnFire.addClickEventListener(() => {
        //     this.fireBullet()
        // });

        this.btnSwitch.addClickEventListener(() => {
            BackgroundLayerInstance.player.switchWeapon();
        });

    },

    fireBullet: function() {
        var bullet = this.bg.player.createBullet()
        this.bg.objectView.addBullet(bullet)

    },


    update: function(dt) {
        this.bg.player.updateMove(this.joystick.direction, dt)
        this.bg.update(dt);


    }
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer);
    return scene;
};