var TowerUI = cc.Sprite.extend({
    card: null,
    evolution: null,
    initTextures: null,
    currentActions: null,
    actions: null,
    idlePrefixNames: null,
    attackPrefixNames: null,
    idleIDP: null,
    attackIDP: null,
    idleActions: null,
    attackActions: null,
    dir: null,
    fireFx: null,
    DIR: {
        COINCIDE: -1,
        S: 0,
        SSE: 1,
        SE: 2,
        ESE: 3,
        E: 4,
        ENE: 5,
        NE: 6,
        NNE: 7,
        N: 8,
        NNW: 9,
        NW: 10,
        WNW: 11,
        W: 12,
        WSW: 13,
        SW: 14,
        SSW: 15,
    },

    ctor: function (mcard, evolution) {
        this.card = mcard;
        this.evolution = evolution;

        this.AnimationSetUp(mcard);
        this._super(this.initTextures[0]);

        this.part = [];
        for (let i = 1; i <= this.evolution + 1; i++) {
            this.part[i] = new cc.Sprite(this.initTextures[i]);
            this.part[i].setPosition(this.width / 2, this.height / 2);
            this.addChild(this.part[i]);
        }

        this.pedestal = new cc.Sprite(asset.battlePedestals_png[this.evolution]);
        this.pedestal.attr({
            x: this.width / 2,
            y: this.height / 2,
            scale: this.width * 0.6 / this.pedestal.width,
        });
        this.addChild(this.pedestal, -1);

        this.currentActions = [];
        this.loadAllActions();

        this.visible = true;
    },

    AnimationSetUp: function (card) {
        this.initTextures = [];
        this.idlePrefixNames = [];
        this.attackPrefixNames = [];
        for (let i = 0; i < 3; i++) {
            this.initTextures[i] = 'res/tower/frame/' + cf.TOWER_UI[card.type].name + '_1_2/tower_' + cf.TOWER_UI[card.type].name + '_idle_' + i + '_0000.png';
            this.idlePrefixNames[i] = 'tower_' + cf.TOWER_UI[card.type].name + '_idle_' + i + '_';
            this.attackPrefixNames[i] = 'tower_' + cf.TOWER_UI[card.type].name + '_attack_' + i + '_';
        }
        this.initTextures[3] = 'res/tower/frame/' + cf.TOWER_UI[card.type].name + '_3/tower_' + cf.TOWER_UI[card.type].name + '_idle_3_0000.png';
        this.idlePrefixNames[3] = 'tower_' + cf.TOWER_UI[card.type].name + '_idle_3_';
        this.attackPrefixNames[3] = 'tower_' + cf.TOWER_UI[card.type].name + '_attack_3_';

        this.idleIDP = cf.TOWER_UI[card.type].idleIDP;
        this.attackIDP = cf.TOWER_UI[card.type].attackIDP;
    },

    evolute: function () {
        if (this.evolution === 2) {
            cc.log('max evolution already');
            return;
        }
        this.stopActions();

        cc.log('evolute!');
        this.evolution++;
        this.pedestal.setTexture(asset.battlePedestals_png[this.evolution]);
        this.part[this.evolution + 1] = new cc.Sprite(this.initTextures[this.evolution + 1]);
        this.part[this.evolution + 1].setPosition(this.width / 2, this.height / 2);
        this.addChild(this.part[this.evolution + 1]);

        this.updateDirection(this.dir, true);
    },

    stopActions: function () {
        try {
            this.stopAllActions();
            this.part.forEach(part => part.stopAllActions());
            this.currentActions.forEach(anim => anim.retain());
        } catch (e) {
            cc.log('No running action!')
        }
    },

    /**
     * Update idle animation by direction
     *
     * @param {number} dir: direction index
     * @param {boolean} force: force to change
     */
    updateDirection: function (dir, force = false) {
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
                let isFlippedX = [this.DIR.NNW, this.DIR.NW, this.DIR.WNW, this.DIR.W, this.DIR.WSW, this.DIR.SW, this.DIR.SSW].indexOf(dir) !== -1;
                this.flippedX = isFlippedX;
                for (let i = 1; i <= this.evolution + 1; i++) {
                    this.part[i].flippedX = isFlippedX;
                }
                this.dir = dir;
            }
        } catch (e) {
            Utils.addToastToRunningScene('Error: cannot update direction!');
        }
    },

    playAttack: function (dir) {
        this.stopActions();
        let sequence, self = this;
        const actionToRun = this.attackActions;
        try {
            if (actionToRun[0] !== null && actionToRun[0].length > 0) {
                if (dir !== this.DIR.COINCIDE) {
                    sequence = cc.sequence(
                        actionToRun[0][dir],
                        cc.callFunc(() => {
                            self.updateDirection(dir, true)
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
                let isFlippedX = [this.DIR.NNW, this.DIR.NW, this.DIR.WNW, this.DIR.W, this.DIR.WSW, this.DIR.SW, this.DIR.SSW].indexOf(dir) !== -1;
                this.flippedX = isFlippedX;
                for (let i = 1; i <= this.evolution + 1; i++) {
                    this.part[i].flippedX = isFlippedX;
                }
            }
        } catch (e) {
            Utils.addToastToRunningScene('Error: cannot play attack!');
        }

    },
    loadAllActions: function () {
        this.loadIdleActions();
        this.loadAttackActions();
    },

    loadIdleActions: function () {
        this.idleActions = [];
        for (let j = 0; j < 4; j++) {
            this.idleActions[j] = [];
            for (let i = 0; i < 16 /* directions */; i++) {
                let frame = this.loadAnimation(Math.min(i, 16 - i) * this.idleIDP, this.idleIDP, this.idlePrefixNames[j]);
                this.idleActions[j].push(cc.animate(new cc.Animation(frame, 0.6 / this.idleIDP)).repeatForever());
                this.idleActions[j][i].retain();
            }
        }
    },

    loadAttackActions: function () {
        this.attackActions = [];
        for (let j = 0; j < 4; j++) {
            this.attackActions[j] = [];
            for (let i = 0; i < 16 /* directions */; i++) {
                let frame = this.loadAnimation(Math.min(i, 16 - i) * this.attackIDP, this.attackIDP, this.attackPrefixNames[j]);
                this.attackActions[j].push(cc.animate(new cc.Animation(frame, 0.6 / this.attackIDP)));
                this.attackActions[j][i].retain();
            }
        }
    },

    loadAnimation: function (from, length, prefixName) {
        let frames = [];
        for (let i = from; i < from + length; i++) {
            let fullName;
            if (i < 10000) {
                fullName = prefixName + '0'.repeat(4 - i.toString().length) + i + '.png';
            } else {
                cc.log('too much frames');
                return [];
            }
            let frame = cc.spriteFrameCache.getSpriteFrame(fullName);
            frames.push(frame);
        }
        return frames;
    },
});
