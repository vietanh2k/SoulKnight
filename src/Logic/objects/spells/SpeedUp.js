HEAL_WIDTH = 250

const SpeedUp = Spell.extend({
    ctor: function (playerState, position, stat) {
        this._super(playerState, position);
        const config = cf.POTION.potion[SPELL_ID.FIREBALL]
        this.initOpponentUI(position)
        // this.initFromConfig(playerState, config)
        // this.render(playerState);

        this.radius = stat[0];
        this.timeCast = stat[1]/1000;
        this.tes = 0
        this.tes2 = 0
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
            this.tes2 ++
        }else {
            cc.log('tong = '+this.tes)
            cc.log('tong2 = '+this.tes2)
            cc.log(dt)
            this.destroy()
        }
        //this.debug(map)
    },

    setBuffOnMonster: function (playerState,dt) {
        const map = playerState.getMap();
        const monsters = map.queryEnemiesCircle(this.castPosition,this.radius* MAP_CONFIG.CELL_WIDTH)
        // cc.log('dem = '+this.tes2)
        this.tes+= monsters.length
        // cc.log('tong = '+this.tes)
        // cc.log('castPosition = '+this.castPosition.x+' '+this.castPosition.y +' '+ this.radius* MAP_CONFIG.CELL_WIDTH)
        for (let i = 0; i < monsters.length; i++) {
            // cc.log(i+'  '+monsters[i].position.x+ '  '+monsters[i].position.y)
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