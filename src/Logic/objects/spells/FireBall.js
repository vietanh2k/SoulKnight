FIREBALL_WIDTH = 180

const FireBall = Spell.extend({
    ctor: function (playerState, position) {
        this._super(playerState, position);
        const config = cf.POTION.potion[SPELL_ID.FIREBALL]
        // this.initOpponentUI(position)
        // this.initFromConfig(playerState, config)
        this.radius = 0.8
        this.canCast = true
        return true;
    },

    //
    // initOpponentUI: function (position) {
    //     if (this.renderRule === 1) {
    //         this.speed2 = 10 * MAP_CONFIG.CELL_WIDTH
    //         this.position= new Vec2(position.x, position.y-MAP_CONFIG.CELL_WIDTH*4)
    //     }else{
    //         this.position= new Vec2(position.x, position.y+MAP_CONFIG.CELL_WIDTH*4)
    //         this.speed2 = -10 * MAP_CONFIG.CELL_WIDTH
    //     }
    // },

    logicUpdate: function (playerState, dt){
        if(this.canCast == true) {
            this.canCast = false
            this.explose(this._playerState, null)
            this.destroy()
        }

    },


    /*
    Nổ dame cho tất cả monster trong phạm vị bán kính nổ
     */
    explose: function (playerState, pos) {
        const map = playerState.getMap();
        const monsters = map.queryEnemiesCircle(this.castPosition,MAP_CONFIG.CELL_WIDTH*this.radius)
        cc.log('dem = '+monsters.length)
        for (let i = 0; i < monsters.length; i++) {
            // monsters[i].takeDamage(playerState, 50)
            monsters[i].position.x += 70
            monsters[i].hurtUI()
        }
    }
});