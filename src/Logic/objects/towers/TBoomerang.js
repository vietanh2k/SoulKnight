var TBoomerang = Tower.extend({

    ctor: function (card, playerState, position, map) {
        this._super(card, 0);

        this._playerState = playerState;
        this.active = true;
        this.visible = false;

        this.attackCooldown = 0;
        this.instance = "2";
        this.target = [];
        this.position = position;
        this.health = 100;
        this.isDestroy = false;
        this.renderRule = this._playerState.rule;
        this._playerState = playerState;
        this.direction = 0;

        this.status = 'readyToFire';
        this.newDir = 0;
        this.level = 1;
        this.map = map;
        this.isSetPosition = false;
        this.setScale(cf.TOWER_SCALE[2]);
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

        this.idleIPD = cf.TOWER_UI[this.card].idleIPD;
        this.attackIPD = cf.TOWER_UI[this.card].attackIPD;
    },

    getNewBullet: function (object) {
        let speed = cf.TOWER.tower[this.instance].stat[this.level].bulletSpeed;
        let damage = cf.TOWER.tower[this.instance].stat[this.level].damage;
        let radius = cf.TOWER.tower[this.instance].stat[this.level].bulletRadius;
        let position = new Vec2(this.position.x, this.position.y);

        let newBullet = new TBoomerangBullet(object, speed, damage, radius, position, this.level);

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
