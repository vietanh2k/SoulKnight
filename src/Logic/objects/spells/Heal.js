
const Heal = Spell.extend({
    ctor: function (playerState, position, stat) {
        this._super(playerState, position);
        /*
        cast trong 4s
         */
        this.timeCast = 4
        this.radius = stat[0];
        this.numEachHeal = stat[1];
        return true;
    },

    logicUpdate: function (playerState, dt){
        if(this.timeCast > 0){
            this.setBuffOnMonster(playerState,dt)
            this.timeCast -= dt
        }else {
            this.destroy()
        }
    },

    setBuffOnMonster: function (playerState,dt) {
        const map = playerState.getMap();
        const monsters = map.queryEnemiesCircle(this.castPosition,this.radius* MAP_CONFIG.CELL_WIDTH)
        for (let i = 0; i < monsters.length; i++) {
            if (monsters[i].___HealEffect) {
                monsters[i].___HealEffect.reset()
            } else {
                /*
                effect trong 5s ko đổi
                 */
                monsters[i].___HealEffect = new HealMaintain(5, this.numEachHeal, monsters[i]);
                playerState.getMap().addEffect(monsters[i].___HealEffect)
            }
        }
    }


});