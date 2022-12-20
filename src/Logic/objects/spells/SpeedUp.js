
const SpeedUp = Spell.extend({
    ctor: function (playerState, position, stat) {
        this._super(playerState, position);

        this.radius = stat[0];
        this.timeCast = stat[1]/1000;
        this.setScale(2*CELLWIDTH/HEAL_WIDTH*this.radius)
        return true;
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
            if (monsters[i].___SpeedEffect) {
                monsters[i].___SpeedEffect.reset()
            } else {
                /*
                tang toc trong 4s, tang 1.5 lan
                 */
                monsters[i].___SpeedEffect = new SpeedEffect(4, 1.5, monsters[i]);
                playerState.getMap().addEffect(monsters[i].___SpeedEffect)
            }
        }
    }


});