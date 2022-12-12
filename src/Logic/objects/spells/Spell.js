

const Spell = cc.Node.extend({
    ctor: function (playerState, position,spellString, aniString) {
        this._super();
        this._playerState = playerState

        this.renderRule = this._playerState.rule
        this.castPosition = new Vec2(position.x, position.y)

        // this.initOpponentUI(position)
        // this.initAnimation(spellString, aniString)
        this.concept="spell"
        this.isDestroy = false

        // this.initConfig(playerState)

        return true;
    },
    // initOpponentUI: function (position) {
    //     if (this.renderRule === 1) {
    //         this.speed2 = 10 * MAP_CONFIG.CELL_WIDTH
    //         this.position= new Vec2(position.x, position.y-MAP_CONFIG.CELL_WIDTH*4)
    //     }else{
    //         this.position= new Vec2(position.x, position.y+MAP_CONFIG.CELL_WIDTH*4)
    //         this.speed2 = -10 * MAP_CONFIG.CELL_WIDTH
    //     }
    // },


    destroy: function () {

        this.isDestroy = true
        this.removeFromParent(true)
    },

    initFromConfig: function (playerState, config) {
        this.energyCost = config.energy
        this.mapCast = config.map
        this.radius = config.radius * MAP_CONFIG.CELL_WIDTH
    },

    initConfig: function (playerState) {
        this.initFromConfig(null)
    },

    // cast: function (time){
    //     if(this.isCast == false) {
    //         this.isCast = true;
    //         this.anim.setAnimation(0, "animation_full", true);
    //         cc.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbb');
    //     }
    //     this.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(()=>{
    //         this.removeFromParent(true);
    //         this.isDestroy = true;
    //     })))
    // },

    // render: function (playerState) {
    //     if(!this.isDestroy) {
    //         if (this.renderRule === 1) {
    //             let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
    //             let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
    //             let height = dy + CELLWIDTH * 5
    //             let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
    //             let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH
    //
    //             this.x = dx + x
    //             this.y = height - y
    //         } else {
    //             let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
    //             let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
    //             let height = dy + CELLWIDTH * 6
    //             let width = dx + CELLWIDTH * 7
    //
    //             let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
    //             let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH
    //
    //             this.setPosition(width - x, height + y)
    //             // this.setRotation(180)
    //         }
    //     }
    //
    // },




});
