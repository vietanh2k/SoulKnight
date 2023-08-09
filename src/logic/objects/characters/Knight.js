var Knight = Character.extend({

    ctor: function(map) {
        this._super(res.celll, map);
        this.skillWp = null;
        this.timeSkillDuration = 0;
        this.timeSkillDurationMax = 6;
        this.maxHp = 7;
        this.maxMana = 200;
        this.maxS = 6;
        // GamelayerInstance.updateSwitchWp(this.we.energy, this.we.getTexture())
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
        this.fakeWP.setTexture(this.we.resFakeWP);
        this.fakeWP.visible = this.we.isMelee;
        this.we.initSwitch();

        this.removeSkill();

        GamelayerInstance.updateSwitchWp(this.we.energy, this.we.getTexture())
    },

    removeSkill: function () {
        if(this.skillWp != null){
            this.skillWp.removeFromParent(true);
            this.skillWp = null;
            this.timeSkillDuration = 0;
        }
    },

    updateActivateWp: function (dt) {
        this.we.logicUpdate(dt);
        this.we.updateActivate();
        if(this.skillWp != null){
            this.skillWp.logicUpdate(dt);
            this.skillWp.updateActivate();
        }
    },

    updateMoveWp: function () {
        this.we.updatePosLogic(this.posLogic)
        this.we.updateDir(this.direction);
        if(this.skillWp != null){
            let pos = null;
            if(this.isLeft) {
                pos = new cc.p(this.posLogic.x + 30, this.posLogic.y)
            }else{
                pos = new cc.p(this.posLogic.x - 30, this.posLogic.y)
            }
            this.skillWp.updatePosLogic(pos)
            this.skillWp.updateDir(this.direction);
        }
    },

    activeSkill: function () {
        let pos = new cc.p(this.posLogic.x+30, this.posLogic.y)
        this.skillWp = this.we.getClone(pos);
        this.skillWp.setPosition(this.width/1, this.height/4)

        this.addChild(this.skillWp, -1)
        this.timeSkillDuration = this.timeSkillDurationMax;
        this.energyWp = this.energyWp*2;
    },

    updateTimeLogic: function (dt) {
        if(this.cdSkill > 0 && this.timeSkillDuration <= 0){
            this.cdSkill -= dt;
        }

        if(this.timeSkillDuration >0){
            this.timeSkillDuration -= dt;
            if(this.timeSkillDuration <= 0){
                this.skillWp.removeFromParent(true);
                this.skillWp = null;
                this.energyWp = this.we.energy;
            }
        }
    },

});