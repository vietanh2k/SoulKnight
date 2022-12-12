var TBoomerang = Tower.extend({
    /**
     * Khởi tạo
     * @param {MCard} card:
     * @param {PlayerState} playerState: trạng thái người chơi
     * @param {Vec2} position: vị trí deploy
     * @param {MapView} map: map add */
    ctor: function (card, playerState, position, map) {
        this._super(card, 0);

        this._playerState = playerState
        this.active = true
        this.visible = false

        this.attackCoolDown = 0;
        this.instance = "2";
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
        this.setScale(cf.TOWER_SCALE[2])
        this.resetPending();

        return true;
    },

    AnimationSetUp: function (card) {
        this.initTextures = [];
        this.idlePrefixNames = [];
        this.attackPrefixNames = [];
        for (let i = 0; i < 3; i++) {
            this.initTextures[i] = 'res/tower/frame/boomerang_1_2/tower_boomerang_idle_' + i + '_0000.png';
            this.idlePrefixNames[i] = 'tower_boomerang_idle_' + i + '_';
            this.attackPrefixNames[i] = 'tower_boomerang_attack_' + i + '_';
        }
        this.initTextures[3] = 'res/tower/frame/boomerang_3/tower_boomerang_idle_3_0000.png';
        this.idlePrefixNames[3] = 'tower_boomerang_idle_3_';
        this.attackPrefixNames[3] = 'tower_boomerang_attack_3_';
        this.idleIDP = 14;
        this.attackIDP = 11;
        // this.fire_fx = sp.SkeletonAnimation('res/tower/fx/tower_cannon_fx.json', 'res/tower/fx/tower_cannon_fx.atlas');
        // GameUI.instance.addChild(this.fire_fx, GAME_CONFIG.RENDER_START_Z_ORDER_VALUE + cf.BULLET_LOCAL_Z_ORDER);
        // this.fire_fx.visible = false;
    },

    getNewBullet: function (object) {
        let speed = this.getConfig()['stat'][this.getLevel()]['bulletSpeed'];
        let damage = this.getConfig()['stat'][this.getLevel()]['damage'];
        let radius = this.getConfig()['stat'][this.getLevel()]['bulletRadius'];
        let position = new Vec2(this.position.x, this.position.y);

        let newBullet = new TCannonBullet(object, speed, damage, radius, position, this);

        const gunCenterFromCellCenter = new Vec2(0, MAP_CONFIG.CELL_HEIGHT * 0.3 * Math.pow(-1, this.renderRule));
        newBullet.position.x += gunCenterFromCellCenter.x;
        newBullet.position.y += gunCenterFromCellCenter.y;

        let enemyPosition = new Vec2(object.position.x, object.position.y);
        let direction = enemyPosition.sub(newBullet.position).l2norm();
        newBullet.position.x += direction.x * MAP_CONFIG.CELL_WIDTH * 0.3;
        newBullet.position.y += direction.y * MAP_CONFIG.CELL_HEIGHT * 0.3;

        return newBullet;
    },
});
