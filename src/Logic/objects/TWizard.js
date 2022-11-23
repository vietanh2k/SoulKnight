// var _TOWER_CONFIG;
var TWizard = Tower.extend({
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
            this.instance = "1";
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
            this.resetPending();

            return true;
        },
        AnimationSetUp: function (card) {
            this.initTextures = [];
            this.idlePrefixNames = [];
            this.attackPrefixNames = [];
            if (!cc.spriteFrameCache.isSpriteFramesWithFileLoaded(res.TWizard_plit)) {
                cc.spriteFrameCache.addSpriteFrames(res.TWizard_plit)
            }
            for (let i = 0; i < 3; i++) {
                this.initTextures[i] = 'res/tower/frame/wizard_1_2/tower_wizard_idle_' + i + '_0000.png';
                this.idlePrefixNames[i] = 'wizard/tower_wizard_idle_' + i + '_';
                this.attackPrefixNames[i] = 'wizard/tower_wizard_attack_' + i + '_';
            }
            this.initTextures[3] = 'res/tower/frame/wizard_3/tower_wizard_idle_3_0000.png';
            this.idlePrefixNames[3] = 'wizard/tower_wizard_idle_3_';
            this.attackPrefixNames[3] = 'wizard/tower_wizard_attack_3_';
            this.idleIDP = 15;
            this.attackIDP = 9;
        },
        getNewBullet: function (object) {
            var speed = this.getConfig()['stat'][this.getLevel()]['bulletSpeed'],
                damage = this.getConfig()['stat'][this.getLevel()]['damage'],
                radius = this.getConfig()['stat'][this.getLevel()]['bulletRadius'],
                position = new Vec2(this.position.x, this.position.y);
            return new TWizardBullet(new Vec2(object.position.x, object.position.y), speed, damage, radius, new Vec2(position.x, position.y));
        },




    }
)
