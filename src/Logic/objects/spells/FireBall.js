const FireBall = Spell.extend({
    ctor: function (playerState, position, stat) {
        this._super(playerState, position);
        const config = cf.POTION.potion[SPELL_ID.FIREBALL]
        // this.initOpponentUI(position)
        // this.initFromConfig(playerState, config)
        this.radius = 1.4
        this.dame = stat[1]
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
            monsters[i].takeDamage(playerState, this.dame)
            let vecPush = monsters[i].position.sub(this.castPosition)
            let timePush = 1/2*(MAP_CONFIG.CELL_WIDTH*this.radius-vecPush.length())/(MAP_CONFIG.CELL_WIDTH*this.radius)
            let vecPush2 = (vecPush.normalize()).mul((MAP_CONFIG.CELL_WIDTH*this.radius-vecPush.length())/(MAP_CONFIG.CELL_WIDTH*this.radius))
            // let distance = (this.radius-vec.length())*1.5;
            // let vecSpeed = vec.normalize()*(2*this.radius-vec.length())/(this.radius)
            monsters[i].___pushEffect = new PushEffect( vecPush2, timePush, monsters[i])
            playerState.getMap().addEffect(monsters[i].___pushEffect)
            cc.log(vecPush.x+ ' '+vecPush.y+ ' {{{{}}}} '+timePush)
            monsters[i].hurtUI()
        }
    }
});