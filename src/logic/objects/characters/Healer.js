var Healer = Character.extend({

    ctor: function(map) {
        this._super(res.celll, map);
        this.timeSkillDuration = 4;

        this.cdSkill = 0;
        this.cdSkillMax = 10;
        this.maxHp = 5;
        this.maxMana = 180;
        this.maxS = 7;
        // GamelayerInstance.updateSwitchWp(this.we.energy, this.we.getTexture())
    },

    initAnimation: function () {
        const duration = 0.6
        const moveDownAnimId = this.load(res.healer_plist, 'idlex%01d.png', 0, 3, duration)
        const moveDownAnimId2 = this.load(res.healer_plist, 'runx%01d.png', 0, 3, duration)

        this.play(0)
    },

    switchWeapon: function () {
        if(this.otherWeapon === null) return;

        let tmp = this.we;
        this.we = this.otherWeapon;
        this.otherWeapon = tmp;
        this.we.updatePosLogic(this.posLogic);
        this.we.updateCurDir(this.direction);
        this.we.updateDir(this.direction);
        this.we.visible = true;
        this.energyWp = this.we.energy;
        this.otherWeapon.visible = false

        this.removeSkill();

        GamelayerInstance.updateSwitchWp(this.we.energy, this.we.getTexture())
    },

    removeSkill: function () {

    },

    updateActivateWp: function (dt) {
        this.we.logicUpdate(dt);
        this.we.updateActivate();
    },

    updateMoveWp: function () {
        this.we.updatePosLogic(this.posLogic)
        this.we.updateDir(this.direction);
    },

    activeSkill: function () {
        let pos = new cc.p(this.posLogic.x, this.posLogic.y)
        let heal = new HealEffect(pos, this.timeSkillDuration, 1, 1.5);
        BackgroundLayerInstance.objectView.addEffect(heal)
    },

    updateTimeLogic: function (dt) {
        if(this.cdSkill > 0){
            this.cdSkill -= dt;
        }
    },

});