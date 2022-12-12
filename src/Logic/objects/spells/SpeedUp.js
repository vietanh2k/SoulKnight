HEAL_WIDTH = 250

const SpeedUp = Spell.extend({
    ctor: function (playerState, position) {
        this._super(playerState, position, 'effect_buff_heal', 'animation_top');
        const config = cf.POTION.potion[SPELL_ID.FIREBALL]
        this.initOpponentUI(position)
        // this.initFromConfig(playerState, config)
        // this.render(playerState);
        this.timeCast = 1.5
        this.radius = 0.8
        this.setScale(2*CELLWIDTH/HEAL_WIDTH*this.radius)
        return true;
    },

    initOpponentUI: function (position) {
        this.position= new Vec2(position.x, position.y)
    },

    logicUpdate: function (playerState, dt){
        if(this.timeCast > 0){
            this.setBuffOnMonster(playerState,dt)
            this.timeCast -= dt
        }else {
            this.destroy()
        }
        //this.debug(map)
    },

    setBuffOnMonster: function (playerState,dt) {
        const map = playerState.getMap();
        const monsters = map.queryEnemiesCircle(this.castPosition,this.radius* MAP_CONFIG.CELL_WIDTH)
        for (let i = 0; i < monsters.length; i++) {
            monsters[i].getSpeedUpState(4, 2);
            // monsters[i].numHealBuff = 2*dt
        }
    }


});