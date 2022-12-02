const FireBall = Spell.extend({
    ctor: function (playerState, position) {
        this._super(playerState, position, 'effect_atk_fire', 'animation_fireball');
        const config = cf.POTION.potion[SPELL_ID.FIREBALL]
        this.initOpponentUI(position)
        // this.initFromConfig(playerState, config)
        return true;
    },

    initOpponentUI: function (position) {
        if (this.renderRule === 1) {
            this.speed2 = 10 * MAP_CONFIG.CELL_WIDTH
            this.position= new Vec2(position.x, position.y-MAP_CONFIG.CELL_WIDTH*4)
        }else{
            this.position= new Vec2(position.x, position.y+MAP_CONFIG.CELL_WIDTH*4)
            this.speed2 = -10 * MAP_CONFIG.CELL_WIDTH
        }
    },

    logicUpdate: function (playerState, dt){
        const distance = this.speed2 * dt
        if(this.isDestroy == false) {
            this.fall(distance)
        }

        //this.debug(map)
    },

    fall: function (distance){
        try{
            cc.log(this.width)
        } catch (e){
            cc.log('abcd')
        }
        this.position.y += distance
        if(this.renderRule == 1) {
            if (this.position.y >= this.castPosition.y) {
                this.cast(5)
                this.explose(this._playerState, null)
            }
        }else{
            if(this.position.y <= this.castPosition.y){
                this.cast(5)
                this.explose(this._playerState, null)
            }
        }



        //this.debug(map)
    },

    explose: function (playerState, pos) {
        const map = playerState.getMap();
        cc.log('66666666666666666666666666')
        const monsters = map.queryEnemiesCircle(this.castPosition, 100*MAP_CONFIG.CELL_WIDTH)
        cc.log('==============31231='+monsters.length)
        for (let i = 0; i < monsters.length; i++) {
            monster.takeDamage(50)
            monster.hurtUI()
            cc.log('66666666666666666666666666')
        }
        // for (let monster of monsters) {
        //     cc.log('66666666666666666666666666')
        //     monster.takeDamage(50)
        //     monster.hurtUI()
        // }
    }
});