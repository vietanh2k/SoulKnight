var MW = MW || {};

//game state
MW.GAME_STATE = {
    HOME: 0,
    PLAY: 1,
    OVER: 2
};

//keys
MW.KEYS = [];

//mouse position
MW.MOUSE = cc.p(240, 0);
MW.TOUCH = false
MW.DELAY_TOUCH = false
//number shield
MW.SHIELD = 0;

//level
MW.LEVEL = {
    STAGE1: 1,
    STAGE2: 2,
    STAGE3: 3
};

//life
MW.LIFE = 4;

//score
MW.SCORE = 0;

//sound
MW.SOUND = true;

//enemy move type
MW.ENEMY_MOVE_TYPE = {
    ATTACK: 0,
    VERTICAL: 1,
    HORIZONTAL: 2,
    OVERLAP: 3
};

//delta x
MW.DELTA_X = -100;

//offset x
MW.OFFSET_X = -24;

//rot
MW.ROT = -5.625;

//bullet type
MW.BULLET_TYPE = {
    PLAYER: 1,
    ENEMY: 2
};

//weapon type
MW.WEAPON_TYPE = {
    ONE: 1
};

//unit tag
MW.UNIT_TAG = {
    ENMEY_BULLET: 900,
    PLAYER_BULLET: 901,
    ENEMY: 1000,
    PLAYER: 1000
};

//attack mode
MW.ENEMY_ATTACK_MODE = {
    NORMAL: 1,
    TSUIHIKIDAN: 2
};

//life up sorce
MW.LIFEUP_SORCE = [50000, 100000, 150000, 200000, 250000, 300000];

//container
MW.CONTAINER = {
    ENEMIES: [],
    ENEMY_BULLETS: [],
    PLAYER_BULLETS: [],
    EXPLOSIONS: [],
    SPARKS: [],
    HITS: [],
    BACKSKYS: [],
    BACKTILEMAPS: []
};

// the counter of active enemies
MW.ACTIVE_ENEMIES = 0;

MW.LOGOY = 350;
MW.FLAREY = 445;
MW.SCALE = 1.5;
MW.WIDTH = 480;
MW.HEIGHT = 720;
MW.FONTCOLOR = "#1f2d96";
MW.menuHeight = 36;
MW.menuWidth = 123;


var cf = cf || {};

// cf.WIDTH = WIDTHSIZE;
// cf.HEIGHT = HEIGHTSIZE;
cf.MAP_LEVEL = [
    {
        level: 10,
        enemy: [1,1,1,1,1],
        // enemy: [1],
        rareEnemy: 0,
    },
    {
        level: 15,
        enemy: [1,1,1,1,1,1],
        // enemy: [1],
        rareEnemy: 0,
    },
    {
        level: 20,
        enemy: [1,1,1,1,2,2],
        // enemy: [1],
        rareEnemy: 0,
    },
    {
        level: 25,
        // enemy: [1,1,1,2,2,2],
        enemy: [1],
        rareEnemy: 0,
    },
    {
        level: 30,
        // enemy: [1,1,2,2,2,2],
        enemy: [1,1],
        rareEnemy: 0,
    },
    {
        level: 35,
        // enemy: [1,1,2,2,2,3],
        enemy: [1,1],
        rareEnemy: 0,
    },
    {
        level: 40,
        // enemy: [1,1,1,1,1,1],
        enemy: [1,1],
        rareEnemy: 0,
    },
    {
        level: 45,
        enemy: [1,1,1,1,1,1],
        rareEnemy: 0,
    },
    {
        level: 50,
        enemy: [1,1,1,1,1,1],
        rareEnemy: 0,
    },
    {
        level: 55,
        enemy: [1,1,1,1,1,1],
        rareEnemy: 0,
    },
    {
        level: 65,
        enemy: [1,1,1,1,1,1],
        rareEnemy: 0,
    },
    {
        level: 75,
        enemy: [1,1,1,1,1,1],
        rareEnemy: 0,
    },
    {
        level: 85,
        enemy: [1,1,1,1,1,1],
        rareEnemy: 0,
    },
    {
        level: 95,
        enemy: [1,1,1,1,1,1],
        rareEnemy: 0,
    },
];

cf.CHAR_TYPE = {
    KNIGHT: 1,
    HEALER: 2
};

cf.WP_TYPE = {
    DOUBLE_GUN: 1,
    SHORT_GUN: 2,
    WATER_GUN:3,
    DOUBLE_WATER_GUN:4,
    TRIPLE_WATER_GUN:5,
    NORMAL_GUN:6,
    BAZOKA_GUN:7,
    KATANA:8,
};

cf.POTION_TYPE = {
    SMALL_HEAL: 1,
    SMALL_MANA: 2,
};

cf.GATE_TYPE = {
    NEXT_CHAPTER: 2,
    NEXT_MAP: 1,
};

cf.CHEST_TYPE = {
    ITEM: 1,
    GOLD: 2,
};

cf.TOAST_Z_ORDER = 1000000000;
cf.BULLET_LOCAL_Z_ORDER = 10;
cf.TIMER_LOCAL_Z_ORDER = 20;

cf.AMOUNT_BTN_GOLD = 500;
cf.AMOUNT_BTN_GEM = 100;
cf.LOBBY_MAX_TAB = 5;
cf.LOBBY_MAX_CHEST = 4;

cf.LOBBY_TAB_NAMES = ['Shop', 'Cards', 'Home', 'Social', 'Clan'];
cf.LOBBY_TAB_SHOP = 0;
cf.LOBBY_TAB_CARDS = 1;
cf.LOBBY_TAB_HOME = 2;
cf.LOBBY_TAB_SOCIAL = 3;
cf.LOBBY_TAB_CLAN = 4;

cf.TAG_CARDINFOUI = 100;

cf.SCROLL_SPEED_MULTIPLIER = 0.5;

cf.TIME_DIFF = 0; // thời gian trên server trừ thời gian trên client
cf.UNOPEN_CHEST_TIMESTAMP = -1;
cf.COST_GEMS_PER_HOUR = 6;

cf.CHEAT_AMOUNT = {};
cf.CHEAT_AMOUNT.FRAGMENT = 3000;

cf.MAX_EVOLUTION = 2;

cf.STAT_MULTIPLIER_PER_LEVEL = 1.1;

cf.DROP_TOWER_DELAY = 1;

cf.TOWER_SCALE = [1, 1.4, 1, 1, 1, 1];

cf.PRIORITIZED_TARGET = {};
cf.PRIORITIZED_TARGET.FULL_HP = 0;
cf.PRIORITIZED_TARGET.LOW_HP = 1;
cf.PRIORITIZED_TARGET.FURTHEST = 2;
cf.PRIORITIZED_TARGET.NEAREST = 3;

cf.MAP_BUFF = {};
cf.MAP_BUFF.DAMAGE = 1.25;
cf.MAP_BUFF.ATTACK_SPEED = 1.25;
cf.MAP_BUFF.RANGE = 1.25;

cf.MAP_CELL = {};
cf.MAP_CELL.NORMAL = 0;
cf.MAP_CELL.TREE = 1;
cf.MAP_CELL.HOLE = 2;
cf.MAP_CELL.BUFF_DAMAGE = -1;
cf.MAP_CELL.BUFF_ATTACK_SPEED = -2;
cf.MAP_CELL.BUFF_RANGE = -3;
cf.MAP_CELL.TOWER_ADDITIONAL = 10000;
cf.MAP_CELL.TOWER_CHECK_HIGHER = 9900;
cf.MAP_CELL.BUFF_OR_NORMAL_CHECK_NOT_HIGHER = 0;

cf.SLOW_TYPE = {};
cf.SLOW_TYPE.FLAT = 0;
cf.SLOW_TYPE.RATIO = 1;

cf.SLOW_SOURCE = {};
cf.SLOW_SOURCE.TOILGUN = 0;
cf.SLOW_SOURCE.TDAMAGE = 1;

// Treasure.json
cf.CHEST_REWARD = [
    {
        openTimeRequired: 3 * 60 * 60 * 1000,
        golds: [10, 20],
        fragments: [10, 20],
        cards: 2,
        rarities: [1, 2, 3, 4],
    },
];

cf.TEXT_RARITIES = ['Thường', 'Hiếm', 'Sử Thi', 'Huyền Thoại'];
cf.COLOR_RARITIES = [
    cc.color(134, 204, 100),
    cc.color(83, 178, 244),
    cc.color(242, 160, 62),
    cc.color(237, 103, 253),
];

cf.COLOR_END_BATTLE = [
    cc.color(179, 207, 214),
    cc.color(83, 178, 244),
    cc.color(179, 207, 214),
];

cf.BULLET_TYPES_LOCALIZE = {
    'boomerang': 'Boomerang',
    'straight': 'Lan',
    'chasing': 'Đơn',
}

// MCard.xlsx
cf.CARD_LEVEL = [
    {
        level: 1,
        gold: 0,
        fragment: 0,
        rarity: 0,
    },
    {
        level: 2,
        gold: 5,
        fragment: 5,
        rarity: 1,
    },
    {
        level: 3,
        gold: 10,
        fragment: 10,
        rarity: 1,
    },
    {
        level: 4,
        gold: 20,
        fragment: 20,
        rarity: 2,
    },
    {
        level: 5,
        gold: 50,
        fragment: 50,
        rarity: 2,
    },
    {
        level: 6,
        gold: 100,
        fragment: 100,
        rarity: 2,
    },
    {
        level: 7,
        gold: 200,
        fragment: 200,
        rarity: 3,
    },
    {
        level: 8,
        gold: 300,
        fragment: 300,
        rarity: 3,
    },
    {
        level: 9,
        gold: 400,
        fragment: 400,
        rarity: 3,
    },
    {
        level: 10,
        gold: 500,
        fragment: 500,
        rarity: 3,
    },
];

cf.TOWER_UI = [];
cf.TOWER_UI[16] = {
    name: 'cannon',
    idleIPD: 15,
    attackIPD: 9,
};
cf.TOWER_UI[17] = {
    name: 'wizard',
    idleIPD: 15,
    attackIPD: 9,
};
cf.TOWER_UI[18] = {
    name: 'boomerang',
    idleIPD: 14,
    attackIPD: 11,
    bulletIPD: 10,
};
cf.TOWER_UI[19] = {
    name: 'oil_gun',
    idleIPD: 14,
    attackIPD: 11,
    bulletIPD: 7,
};
cf.TOWER_UI[20] = {
    name: 'ice_gun',
    idleIPD: 14,
    attackIPD: 10,
};
cf.TOWER_UI[21] = {
    name: 'damage',
    idleIPD: 17,
    attackIPD: 15,
};

cf.EMPTY_BULLET = -11;

// id - 1xx: tower, 2xx: monster, 3xx: spell
cf.CARD = [
    // towers
    {
        id: 100,
        energy: 8,
        texture: asset.cardTowerCannon_png,
        miniature: asset.miniaturesTowerCannon_png,
        statTypes: ['damage', 'attackSpeed', 'range', 'bulletType'],
        skill: {
            texture: asset.iconSkillStun_png,
            name: 'Đạn Choáng',
            description: 'Gây mini choáng cho quái.',
            stats: [
                {
                    texture: asset.statIcons_png['time'],
                    textAttribute: 'Thời gian:',
                    textStat: '0.2s',
                },
            ],
        },
        name: 'Pháo Cú',
        description:
            'Bắn đơn một mục tiêu,\n' +
            'đạn sẽ bay theo mục tiêu,\n' +
            'tốc độ đạn nhanh',
    },
    {
        id: 101,
        energy: 12,
        texture: asset.cardTowerWizard_png,
        miniature: asset.miniaturesTowerWizard_png,
        statTypes: ['damage', 'attackSpeed', 'range', 'bulletType'],
        skill: {
            texture: asset.iconSkillResonance_png,
            name: 'Cộng Hưởng',
            description:
                'Cộng thêm sát thương khi trong\n' +
                'vùng nổ đạn có trên 5 quái.',
            stats: [
                {
                    texture: asset.statIcons_png['damageUp'],
                    textAttribute: 'S. thương tăng:',
                    textStat: '10',
                },
            ],
        },
        name: 'Quạ Pháp Sư',
        description:
            'Bắn cầu lửa vào vị trí xác định\n' +
            'mục tiêu, gây sát thương lan,\n' +
            'tốc độ đạn chậm',
    },
    {
        id: 102,
        energy: 10,
        texture: asset.cardTowerBoomerang_png,
        miniature: asset.miniaturesTowerBoomerang_png,
        statTypes: ['damage', 'attackSpeed', 'range', 'bulletType'],
        skill: {
            texture: asset.iconSkillIncrease_png,
            name: 'Tăng Sát',
            description:
                'Tăng thêm sát thương cho lần\n' +
                'gây sát thương tiếp theo của đạn.',
            stats: [
                {
                    texture: asset.statIcons_png['damageUp'],
                    textAttribute: 'S. thương tăng:',
                    textStat: '50%',
                },
            ],
        },
        name: 'Ếch Đồ Tể',
        description:
            'Bắn dao phay vào vị trí xác định\n' +
            'của mục tiêu, dao phay sẽ bay\n' +
            'một đoạn gây sát thương trên\n' +
            'đường bay rồi bay ngược trở lại\n' +
            'gây tiếp sát thương',
    },
    {
        id: 103,
        energy: 12,
        texture: asset.cardTowerOilGun_png,
        miniature: asset.miniaturesTowerOilGun_png,
        statTypes: ['bulletTargetBuffType', 'attackSpeed', 'range', 'bulletType'],
        skill: {
            texture: asset.iconSkillPoison_png,
            name: 'Nhớt Độc',
            description: 'Gây độc cho quái bị dính đạn.',
            stats: [
                {
                    texture: asset.statIcons_png['damage'],
                    textAttribute: 'Sát thương:',
                    textStat: '2',
                },
                {
                    texture: asset.statIcons_png['time'],
                    textAttribute: 'Thời gian:',
                    textStat: '3s',
                },
            ],
        },
        name: 'Thỏ Xả Nhớt',
        description:
            'Bắn đạn nhớt của sên\n' +
            'vào vị trí xác định,\n' +
            'nhớt sẽ bung ra làm chậm\n' +
            'quái trong vùng ảnh hưởng',
    },
    {
        id: 104,
        energy: 10,
        texture: asset.cardTowerIceGun_png,
        miniature: asset.miniaturesTowerIceGun_png,
        statTypes: ['bulletTargetBuffType', 'attackSpeed', 'range', 'bulletType'],
        skill: {
            texture: asset.iconSkillArmorBreak_png,
            name: 'Băng Sát',
            description:
                'Quái nhận thêm sát thương\n' +
                'khi đang bị đóng băng.',
            stats: [
                {
                    texture: asset.statIcons_png['damageUp'],
                    textAttribute: 'S. thương tăng:',
                    textStat: '50%',
                },
            ],
        },
        name: 'Gấu Bắc Cực',
        description:
            'Bắn đạn băng vào một mục tiêu,\n' +
            'mục tiêu trúng sẽ bị đóng băng\n' +
            'trong một khoảng thời gian',
    },
    {
        id: 105,
        energy: 12,
        texture: asset.cardTowerDamage_png,
        miniature: asset.miniaturesTowerDamage_png,
        statTypes: ['auraTowerBuffType'],
        skill: {
            texture: asset.iconSkillSlow_png,
            name: 'Làm Chậm',
            description:
                'Quái đi vào vùng trụ\n' +
                'sẽ bị làm chậm.',
            stats: [
                {
                    texture: asset.statIcons_png['immobilize'],
                    textAttribute: 'Làm chậm:',
                    textStat: '80%',
                },
            ],
        },
        name: 'Dê Phát Động',
        description:
            'Tăng Sát thương cho các Tháp\n' +
            'nằm trong vùng Tháp',
    },
    {
        id: 106,
        energy: 12,
        texture: asset.cardTowerAttackSpeed_png,
        miniature: asset.miniaturesTowerAttackSpeed_png,
        statTypes: ['auraTowerBuffType'],
        skill: {
            texture: asset.iconSkillBurn_png,
            name: 'Đốt Máu',
            description:
                'Đốt máu quái khi đi\n' +
                'vào vùng ảnh hưởng.',
            stats: [
                {
                    texture: asset.statIcons_png['damage'],
                    textAttribute: 'Sát thương:',
                    textStat: '1%, tối đa 5',
                },
            ],
        },
        name: 'Rắn Tóc Đỏ',
        description:
            'Tăng Tốc bắn cho các Tháp\n' +
            'nằm trong vùng Tháp',
    },

    // monsters
    {
        id: 200,
        energy: 1,
        texture: asset.cardMonsterSwordsman_png,
        miniature: asset.miniatureMonsterSwordsman_png,
        statTypes: ['hp', 'speed', 'numberMonsters'],
        name: 'Kiếm Ma',
        description: 'Máu thường, tốc độ thường',
        maxNumberMonsters: [5, 8, 12, 12],
        hp: 18,
        speed: 0.8,
    },
    {
        id: 201,
        energy: 1,
        texture: asset.cardMonsterAssassin_png,
        miniature: asset.miniatureMonsterAssassin_png,
        statTypes: ['hp', 'speed', 'numberMonsters'],
        name: 'Quạ Xương',
        description: 'Máu thấp, chạy rất nhanh',
        maxNumberMonsters: [3, 5, 8, 8],
        hp: 12,
        speed: 1.4,
    },
    {
        id: 202,
        energy: 3,
        texture: asset.cardMonsterGiant_png,
        miniature: asset.miniatureMonsterGiant_png,
        statTypes: ['hp', 'speed', 'numberMonsters'],
        name: 'Khổng Lồ',
        description: 'Máu cao, đi chậm',
        maxNumberMonsters: [2, 3, 4, 4],
        hp: 82,
        speed: 0.5,
    },
    {
        id: 203,
        energy: 2,
        texture: asset.cardMonsterBat_png,
        miniature: asset.miniatureMonsterBat_png,
        statTypes: ['hp', 'speed', 'numberMonsters'],
        name: 'Dơi Quỷ',
        description: 'Máu thường, tốc độ thường',
        maxNumberMonsters: [5, 8, 12, 12],
        hp: 14,
        speed: 1,
    },
    {
        id: 204,
        energy: 1,
        texture: asset.cardMonsterNinja_png,
        miniature: asset.miniatureMonsterNinja_png,
        statTypes: ['hp', 'speed', 'numberMonsters'],
        name: 'Xương Độn Thổ',
        description: 'Máu thường, tốc độ thường',
        maxNumberMonsters: [3, 4, 5, 5],
        hp: 24,
        speed: 0.8,
    },

    // spells
    {
        id: 300,
        energy: 8,
        texture: asset.cardPotionFireball_png,
        statTypes: ['damage', 'potionRange'],
        name: 'Cầu Lửa',
        description:
            'Thả cầu lửa gây sát thương\n' +
            'một vùng ngay lập tức',
        potionRange: [0.8, 1, 1.2, 1.4],
        damage: [50, 55, 61, 67, 73, 81, 90, 101, 113, 127],
    },
    {
        id: 301,
        energy: 8,
        texture: asset.cardPotionFrozen_png,
        statTypes: ['duration', 'potionRange'],
        name: 'Đóng Băng',
        description:
            'Thả phép đóng băng gây\n' +
            'sát thương một vùng ngay\n' +
            'lập tức, đồng thời đóng băng\n' +
            'quái tấn công mình hoặc\n' +
            'trụ đối thủ trong vùng đó',
        potionRange: [0.8, 1, 1.2, 1.4],
        damage: [10, 11, 12, 13, 15, 16, 18, 20, 23, 25],
        duration: 5,
    },
    {
        id: 302,
        energy: 12,
        texture: asset.cardPotionHeal_png,
        statTypes: ['heal', 'potionRange', 'duration'],
        name: 'Hồi Máu',
        description:
            'Thả phép tạo vùng hồi máu,\n' +
            'quái đi vào sẽ được\n' +
            'hồi máu một thời gian',
        potionRange: [0.8, 1, 1.2, 1.4],
        heal: 20,
        duration: 3,
    },
    {
        id: 303,
        energy: 12,
        texture: asset.cardPotionSpeedUp_png,
        statTypes: ['duration', 'potionRange'],
        name: 'Tăng Tốc',
        description:
            'Thả phép tạo một vùng tăng tốc,\n' +
            'quái đi vào sẽ tăng tốc độ chạy',
        potionRange: [0.8, 1, 1.2, 1.4],
        speedIncrease: 1.5,
        duration: [1.5, 1.8, 2.1, 2.4, 2.7, 3, 3.3, 3.6, 3.9, 4.2],
    },
    {
        id: 304,
        energy: 10,
        texture: asset.cardPotionTrap_png,
        statTypes: ['potionRange'],
        name: 'Lò Xo',
        description:
            'Đặt lò xo trên bản đồ,\n' +
            'quái di chuyển vào lò xo\n' +
            'sẽ bị bật trở lại cổng ra quái',
        potionRange: [0.2, 0.25, 0.3, 0.35],
        damage: [20, 22, 24, 27, 29, 32, 36, 40, 45, 51],
    },
    {
        id: 305,
        energy: 10,
        texture: asset.cardPotionPower_png,
        statTypes: ['strengthIncrease', 'duration'],
        name: 'Tăng Sức Mạnh Trụ',
        description:
            'Tạo một vùng tăng sức mạnh,\n' +
            'trụ nằm trong vùng này\n' +
            'sẽ được tăng sức mạnh',
        potionRange: [0.6, 1, 1.4, 1.8],
        strengthIncrease: 1.5,
        duration: [1.5, 1.8, 2.1, 2.4, 2.7, 3, 3.3, 3.6, 3.9, 4.2],
    },
];
