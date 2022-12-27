

const Spell = cc.Node.extend({
    ctor: function (playerState, position) {
        this._super();
        this._playerState = playerState

        this.renderRule = this._playerState.rule
        this.castPosition = new Vec2(position.x, position.y)

        this.concept="spell"
        this.isDestroy = false
        const totalTowersLv = MonsterWaveHandler.getTotalTowersLv(playerState.getMap());
        this.hpMul = MonsterWaveHandler.getMonsterHpMultiplier(totalTowersLv);

        return true;
    },



    destroy: function () {

        this.isDestroy = true
        this.removeFromParent(true)
    },

});
