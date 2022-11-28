// var _TOWER_CONFIG;
var TCanon = Tower.extend({
    /**
     * Khởi tạo
     * @param {MCard} card:
     * @param {PlayerState} playerState: trạng thái người chơi
     * @param {Vec2} position: vị trí deploy
     * @param {MapView} map: map add */
    ctor: function (card, playerState, position, map) {
        cc.log('init canon')
        this._super(card, 0);
        // cc.log("Create new Tower: Type=" + type + "player state" + playerState + "position" + position)

        this._playerState = playerState
        this.active = true
        this.visible = false

        this.attackCoolDown = 0;
        this.instance = "0";
        this.target = [];
        this.position = position;
        this.health = 100
        this.physicbox = null;
        this.isDestroy = false
        this.renderRule = this._playerState.rule
        this._playerState = playerState
        this.new_direction = null
        this.direction = 0;

        this.status = 'idle'
        this.level = 1
        this.map = map
        this._is_set_pos = false
        this.setScale(1.1)
        this.resetPending();

        return true;
    },
    AnimationSetUp: function (card) {
        this.initTextures = [];
        this.idlePrefixNames = [];
        this.attackPrefixNames = [];
        for (let i = 0; i < 3; i++) {
            this.initTextures[i] = 'res/tower/frame/cannon_1_2/tower_cannon_idle_' + i + '_0000.png';
            this.idlePrefixNames[i] = 'tower_cannon_idle_' + i + '_';
            this.attackPrefixNames[i] = 'tower_cannon_attack_' + i + '_';
        }
        this.initTextures[3] = 'res/tower/frame/cannon_3/tower_cannon_idle_3_0000.png';
        this.idlePrefixNames[3] = 'tower_cannon_idle_3_';
        this.attackPrefixNames[3] = 'tower_cannon_attack_3_';
        this.idleIDP = 15;
        this.attackIDP = 9;
        this.fire_fx = sp.SkeletonAnimation('res/tower/fx/tower_cannon_fx.json', 'res/tower/fx/tower_cannon_fx.atlas');
        GameUI.instance.addChild(this.fire_fx, 900);
        this.fire_fx.visible = false;
    },
    getNewBullet: function (object) {
        var speed = this.getConfig()['stat'][this.getLevel()]['bulletSpeed'],
            damage = this.getConfig()['stat'][this.getLevel()]['damage'],
            radius = this.getConfig()['stat'][this.getLevel()]['bulletRadius'],
            position = new Vec2(this.position.x, this.position.y);
        return new TCannonBullet(object, speed, damage, radius, position);
    },

})
