const FireBall = Spell.extend({
    ctor: function (playerState, position) {
        this._super(playerState, position, 'effect_atk_fire', 'animation_fireball');
        const config = cf.POTION.potion[SPELL_ID.FIREBALL]

        // this.initFromConfig(playerState, config)
        return true;
    }

});