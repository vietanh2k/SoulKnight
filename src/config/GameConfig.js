

var MW = MW || {};

//game state
MW.GAME_STATE = {
    HOME:0,
    PLAY:1,
    OVER:2
};

//keys
MW.KEYS = [];

//mouse position
MW.MOUSE = cc.p(240,0);
MW.TOUCH = false
//number shield
MW.SHIELD = 0;

//level
MW.LEVEL = {
    STAGE1:1,
    STAGE2:2,
    STAGE3:3
};

//life
MW.LIFE = 4;

//score
MW.SCORE = 0;

//sound
MW.SOUND = true;

//enemy move type
MW.ENEMY_MOVE_TYPE = {
    ATTACK:0,
    VERTICAL:1,
    HORIZONTAL:2,
    OVERLAP:3
};

//delta x
MW.DELTA_X = -100;

//offset x
MW.OFFSET_X = -24;

//rot
MW.ROT = -5.625;

//bullet type
MW.BULLET_TYPE = {
    PLAYER:1,
    ENEMY:2
};

//weapon type
MW.WEAPON_TYPE = {
    ONE:1
};

//unit tag
MW.UNIT_TAG = {
    ENMEY_BULLET:900,
    PLAYER_BULLET:901,
    ENEMY:1000,
    PLAYER:1000
};

//attack mode
MW.ENEMY_ATTACK_MODE = {
    NORMAL:1,
    TSUIHIKIDAN:2
};

//life up sorce
MW.LIFEUP_SORCE = [50000, 100000, 150000, 200000, 250000, 300000];

//container
MW.CONTAINER = {
    ENEMIES:[],
    ENEMY_BULLETS:[],
    PLAYER_BULLETS:[],
    EXPLOSIONS:[],
    SPARKS:[],
    HITS:[],
    BACKSKYS:[],
    BACKTILEMAPS:[]
};

//bullet speed
MW.BULLET_SPEED = {
    ENEMY:-200,
    SHIP:900
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

cf.TOAST_Z_ORDER = 1000;

cf.AMOUNT_BTN_GOLD = 1000;
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

cf.TIME_DIFF = 0; // thời gian trên server trừ thời gian trên client
cf.UNOPEN_CHEST_TIMESTAMP = -1;
cf.COST_GEMS_PER_HOUR = 6;

cf.MAX_EVOLUTION = 2;

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

// id - 1xx: tower, 2xx: monster, 3xx: spell
cf.CARD = [
    // towers
    {
        id: 100,
        energy: 8,
        texture: asset.cardTowerCannon_png,
        miniature: asset.miniaturesTowerCannon_png,
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
        name: 'Kiếm Ma',
        description: 'Máu thường, tốc độ thường',
    },
    {
        id: 201,
        energy: 1,
        texture: asset.cardMonsterAssassin_png,
        miniature: asset.miniatureMonsterAssassin_png,
        name: 'Quạ Xương',
        description: 'Máu thấp, chạy rất nhanh',
    },
    {
        id: 202,
        energy: 3,
        texture: asset.cardMonsterGiant_png,
        miniature: asset.miniatureMonsterGiant_png,
        name: 'Khổng Lồ',
        description: 'Máu cao, đi chậm',
    },
    {
        id: 203,
        energy: 2,
        texture: asset.cardMonsterBat_png,
        miniature: asset.miniatureMonsterBat_png,
        name: 'Dơi Quỷ',
        description: 'Máu thường, tốc độ thường',
    },
    {
        id: 204,
        energy: 1,
        texture: asset.cardMonsterNinja_png,
        miniature: asset.miniatureMonsterNinja_png,
        name: 'Xương Độn Thổ',
        description: 'Máu thường, tốc độ thường',
    },

    // spells
    {
        id: 300,
        energy: 8,
        texture: asset.cardPotionFireball_png,
        name: 'Cầu Lửa',
        description:
            'Thả cầu lửa gây sát thương\n' +
            'một vùng ngay lập tức',
    },
    {
        id: 301,
        energy: 8,
        texture: asset.cardPotionFrozen_png,
        name: 'Đóng Băng',
        description:
            'Thả phép đóng băng gây\n' +
            'sát thương một vùng ngay\n' +
            'lập tức, đồng thời đóng băng\n' +
            'quái tấn công mình hoặc\n' +
            'trụ đối thủ trong vùng đó',
    },
    {
        id: 302,
        energy: 12,
        texture: asset.cardPotionHeal_png,
        name: 'Hồi Máu',
        description:
            'Thả phép tạo vùng hồi máu,\n' +
            'quái đi vào sẽ được\n' +
            'hồi máu một thời gian',
    },
    {
        id: 303,
        energy: 12,
        texture: asset.cardPotionSpeedUp_png,
        name: 'Tăng Tốc',
        description:
            'Thả phép tạo một vùng tăng tốc,\n' +
            'quái đi vào sẽ tăng tốc độ chạy',
    },
    {
        id: 304,
        energy: 10,
        texture: asset.cardPotionTrap_png,
        name: 'Lò Xo',
        description:
            'Đặt lò xo trên bản đồ,\n' +
            'quái di chuyển vào lò xo\n' +
            'sẽ bị bật trở lại cổng ra quái',
    },
    {
        id: 305,
        energy: 10,
        texture: asset.cardPotionPower_png,
        name: 'Tăng Sức Mạnh Trụ',
        description:
            'Tạo một vùng tăng sức mạnh,\n' +
            'trụ nằm trong vùng này\n' +
            'sẽ được tăng sức mạnh',
    },
];
