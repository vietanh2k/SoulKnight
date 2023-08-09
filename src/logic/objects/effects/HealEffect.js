TIME_PER_HEAL = 0.5;
/*
duy trì hồi máu mỗi 0.5s
 */
const HealEffect = Effect.extend({
    ctor: function (posLogic, time , numheal, radius) {
        this._super(time)
        this.posLogic = posLogic;
        this.radius = radius;
        this.sumHealDt = 0;
        this.numHealBuff = numheal;
        var posUI = cc.pMult(posLogic, (CELL_SIZE_UI/GAME_CONFIG.CELLSIZE));

        let healUI = new HealSkillUI(posUI, time , 1.5);
        BackgroundLayerInstance.addChild(healUI);
    },

    update: function (dt) {
        this.sumHealDt += dt;
        while (this.sumHealDt > TIME_PER_HEAL) {
            this.sumHealDt -= TIME_PER_HEAL;
            let listChar = BackgroundLayerInstance.objectView.getAllCharInCircle(this.posLogic , this.radius*GAME_CONFIG.CELLSIZE);

            for (let i = 0; i < listChar.length; i++) {
                if(!listChar[i].isDestroy) {
                    listChar[i].recoverHp(this.numHealBuff);
                }
            }
        }
    },

    destroy: function () {

    }
})