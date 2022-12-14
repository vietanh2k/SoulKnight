let TDamage = Tower.extend({

    ctor: function (card, playerState, position, map) {
        this._super(card, 0);

        this._playerState = playerState;
        this.active = true;
        this.visible = false;

        this.attackCooldown = 0;
        this.instance = "5";
        this.target = [];
        this.position = position;
        this.health = 100;
        this.isDestroy = false;
        this.renderRule = this._playerState.rule;
        this._playerState = playerState;
        this.direction = 0;

        this.status = 'readyToFire';
        this.newDir = 0;
        this.level = 1;
        this.map = map;
        this.isSetPosition = false;
        this.setScale(cf.TOWER_SCALE[5]);
        this.resetPending();

        this.runFireAnimationForever();

        return true;
    },

    runFireAnimationForever: function () {
        this.fireFx = sp.SkeletonAnimation('res/tower/fx/tower_strength_fx.json', 'res/tower/fx/tower_strength_fx.atlas');
        GameUI.instance.addChild(this.fireFx, GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + cf.BULLET_LOCAL_Z_ORDER);
        this.fireFx.setAnimation(0, 'attack_1', true);
    },

    initAnimations: function (card) {
        this.initTextures = [];
        this.idlePrefixNames = [];
        this.attackPrefixNames = [];
        for (let i = 0; i < 3; i++) {
            this.initTextures[i] = 'res/tower/frame/damage_1_2/tower_damage_idle_' + i + '_0000.png';
            this.idlePrefixNames[i] = 'tower_damage_idle_' + i + '_';
            this.attackPrefixNames[i] = 'tower_damage_attack_' + i + '_';
        }
        this.initTextures[3] = 'res/tower/frame/damage_3/tower_damage_idle_3_0000.png';
        this.idlePrefixNames[3] = 'tower_damage_idle_3_';
        this.attackPrefixNames[3] = 'tower_damage_attack_3_';

        this.idleIPD = cf.TOWER_UI[this.card].idleIPD;
        this.attackIPD = cf.TOWER_UI[this.card].attackIPD;
    },

    loadIdleActions: function () {
        this.idleActions = [];
        for (let j = 0; j < 4; j++) {
            this.idleActions[j] = [];
            for (let i = 0; i < 16 /* directions */; i++) {
                let frame = Utils.loadAnimation(0, this.idleIPD, this.idlePrefixNames[j]);
                this.idleActions[j].push(cc.animate(new cc.Animation(frame, 0.6 / this.idleIPD)).repeatForever());
                this.idleActions[j][i].retain();
            }
        }
    },

    loadAttackActions: function () {
        this.attackActions = [];
        for (let j = 0; j < 4; j++) {
            this.attackActions[j] = [];
            for (let i = 0; i < 16 /* directions */; i++) {
                let frame = Utils.loadAnimation(0, this.attackIPD, this.attackPrefixNames[j]);
                this.attackActions[j].push(cc.animate(new cc.Animation(frame, 0.6 / this.attackIPD)));
                this.attackActions[j][i].retain();
            }
        }
    },

    updateDirectionForIdle: function (dir, force = false) {
        if (this.dir === dir && !force) {
            return;
        }
        this.stopActions();
        const actionToRun = this.idleActions;
        try {
            if (actionToRun[0] !== null && actionToRun[0].length > 0) {
                if (dir !== this.DIR.COINCIDE) {
                    this.currentActions[0] = actionToRun[0][dir];
                    this.runAction(this.currentActions[0]);
                    for (let i = 1; i <= this.evolution + 1; i++) {
                        this.currentActions[i] = actionToRun[i][dir];
                        this.part[i].runAction(this.currentActions[i]);
                    }
                }
                this.dir = dir;
            }
        } catch (e) {
            Utils.addToastToRunningScene('Error: cannot update direction!');
        }
    },

    updateDirectionForAttack: function (dir) {
        this.stopActions();
        let sequence, self = this;
        const actionToRun = this.attackActions;
        try {
            if (actionToRun[0] !== null && actionToRun[0].length > 0) {
                if (dir !== this.DIR.COINCIDE) {
                    sequence = cc.sequence(
                        actionToRun[0][dir],
                        cc.callFunc(() => {
                            self.updateDirectionForIdle(dir, true)
                        }));
                    this.runAction(sequence);
                    for (let i = 1; i <= this.evolution + 1; i++) {
                        this.part[i].runAction(actionToRun[i][dir]);
                    }
                }
                if (this.fireFx != null) {
                    this.fireFx.visible = true;
                    let animationName = 'attack_' + (Math.min(dir, 16 - dir) + 1);
                    this.fireFx.setAnimation(0, animationName, false);
                    if ([this.DIR.NNW, this.DIR.NW, this.DIR.WNW, this.DIR.W, this.DIR.WSW, this.DIR.SW, this.DIR.SSW].indexOf(dir) !== -1) {
                        this.fireFx.scaleX = -1;
                    }
                }
            }
        } catch (e) {
            Utils.addToastToRunningScene('Error: cannot play attack!');
        }
    },

    getNewBullet: function (object) {
        return cf.EMPTY_BULLET;
    },
});
