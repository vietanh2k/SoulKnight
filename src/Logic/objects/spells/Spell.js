const Spell = cc.Node.extend({
    ctor: function (playerState, position,spellString, aniString) {
        this._super();
        this._playerState = playerState

        this.renderRule = this._playerState.rule
        this.castPosition = new Vec2(position.x, position.y)

        this.initOpponentUI(position)
        this.initAnimation(spellString, aniString)
        this.concept="spell"
        this.isDestroy = false
        // this.initConfig(playerState)

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


    initAnimation: function (spellString, aniString) {

        this.anim = new sp.SkeletonAnimation("res/potion/"+spellString+".json",
            "res/potion/"+spellString+".atlas")
        if(aniString != null) {
            this.anim.setAnimation(0, aniString, true);
        }
        this.addChild(this.anim)
    },

    initFromConfig: function (playerState, config) {
        this.energyCost = config.energy
        this.mapCast = config.map
        this.radius = config.radius * MAP_CONFIG.CELL_WIDTH
    },

    initConfig: function (playerState) {
        this.initFromConfig(null)
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
                this.cast()
            }
        }else{
            if(this.position.y <= this.castPosition.y){
                this.cast()
            }
        }



        //this.debug(map)
    },

    cast: function (){
        if(this.isDestroy == false) {
            this.isDestroy = true
            this.anim.setAnimation(0, "animation_full", false);
            cc.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbb')
        }
    },

    render: function (playerState) {


        if (this.renderRule === 1) {
            let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
            let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
            let height = dy + CELLWIDTH * 5
            let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
            let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH

            this.x = dx + x
            this.y = height - y
        } else {
            let dx = winSize.width / 2 - WIDTHSIZE / 2 + CELLWIDTH / 2
            let dy = winSize.height / 2 - HEIGHTSIZE / 2 + CELLWIDTH * 3
            let height = dy + CELLWIDTH * 6
            let width = dx + CELLWIDTH * 7

            let x = this.position.x / MAP_CONFIG.CELL_WIDTH * CELLWIDTH
            let y = this.position.y / MAP_CONFIG.CELL_HEIGHT * CELLWIDTH

            this.setPosition(width - x, height + y)
            // this.setRotation(180)
        }

    },




});
