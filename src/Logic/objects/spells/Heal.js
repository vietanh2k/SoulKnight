HEAL_WIDTH = 250

const Heal = Spell.extend({
    ctor: function (playerState, position, stat) {
        this._super(playerState, position);
        const config = cf.POTION.potion[SPELL_ID.FIREBALL]
        this.initOpponentUI(position)
        // this.initFromConfig(playerState, config)
        // this.render(playerState);
        /*
        cast trong 4s
         */
        this.timeCast = 4
        this.radius = stat[0];
        this.numEachHeal = stat[1];
        this.setScale(2*CELLWIDTH/HEAL_WIDTH*this.radius)
        return true;
    },

    initOpponentUI: function (position) {
        this.position= new Vec2(position.x, position.y)
    },

    logicUpdate: function (playerState, dt){
        // if(this.canCast == true) {
        //     this.canCast = false
        //     this.explose(this._playerState, null)
        //     this.destroy()
        // }
        // if(this.isDestroy == false) {
        //     this.cast(4)
        //     this.timeCast = 4
        // }
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
            if (monsters[i].___HealEffect) {
                monsters[i].___HealEffect.reset()
            } else {
                /*
                effect trong 5s
                 */
                monsters[i].___HealEffect = new HealMaintain(5, this.numEachHeal, monsters[i]);
                playerState.getMap().addEffect(monsters[i].___HealEffect)
            }
        }
    }


});