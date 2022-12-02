const Heal = Spell.extend({
    ctor: function (playerState, position) {
        this._super(playerState, position, 'effect_buff_heal', 'animation_top');
        const config = cf.POTION.potion[SPELL_ID.FIREBALL]
        this.initOpponentUI(position)
        // this.initFromConfig(playerState, config)
        this.render(playerState);
        return true;
    },

    initOpponentUI: function (position) {
        this.position= new Vec2(position.x, position.y)
    },

    logicUpdate: function (playerState, dt){
        if(this.isDestroy == false) {
            this.cast(4)
        }
        //this.debug(map)
    },


});