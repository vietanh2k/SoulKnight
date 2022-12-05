// var _TOWER_CONFIG;
var TCannon = Tower.extend({
    /**
     * Khởi tạo
     * @param {MCard} card:
     * @param {PlayerState} playerState: trạng thái người chơi
     * @param {Vec2} position: vị trí deploy
     * @param {MapView} map: map add */
    ctor: function (card, playerState, position, map) {
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
        this.setScale(1)
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
        let speed = this.getConfig()['stat'][this.getLevel()]['bulletSpeed'];
        let damage = this.getConfig()['stat'][this.getLevel()]['damage'];
        let radius = this.getConfig()['stat'][this.getLevel()]['bulletRadius'];
        let position = new Vec2(this.position.x, this.position.y);

        let newBullet = new TCannonBullet(object, speed, damage, radius, position);

        let enemyPosition = new Vec2(object.position.x, object.position.y);
        let direction = enemyPosition.sub(newBullet.position).l2norm();

        const gunCenterFromCellCenter = new Vec2(0, MAP_CONFIG.CELL_HEIGHT * (-0.3));

        newBullet.position.x += gunCenterFromCellCenter.x + direction.x * MAP_CONFIG.CELL_WIDTH * 0.2;
        newBullet.position.y += gunCenterFromCellCenter.y + direction.y * MAP_CONFIG.CELL_HEIGHT * 0.2;

        return newBullet;
    },
});
