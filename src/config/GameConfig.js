var cf = cf || {};

cf.WIDTH = 640;
cf.HEIGHT = 960;

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

cf.TIME_DIFF = 0; // thời gian trên server trừ thời gian trên client
cf.UNOPEN_CHEST_TIMESTAMP = -1;
cf.COST_GEMS_PER_HOUR = 6;

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

// Card.xlsx
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
        id: 101,
        energy: 8,
        texture: asset.cardTowerCannon_png,
        description:
            'Bắn đơn một mục tiêu,\n' +
            'đạn sẽ bay theo mục tiêu,\n' +
            'tốc độ đạn nhanh',
    },
    {
        id: 102,
        energy: 12,
        texture: asset.cardTowerWizard_png,
        description:
            'Bắn cầu lửa vào vị trí xác định\n' +
            'mục tiêu, gây sát thương lan,\n' +
            'tốc độ đạn chậm',
    },
    {
        id: 103,
        energy: 10,
        texture: asset.cardTowerBoomerang_png,
        description:
            'Bắn dao phay vào vị trí xác định\n' +
            'của mục tiêu, dao phay sẽ bay\n' +
            'một đoạn gây sát thương trên\n' +
            'đường bay rồi bay ngược trở lại\n' +
            'gây tiếp sát thương',
    },
    {
        id: 104,
        energy: 12,
        texture: asset.cardTowerOilGun_png,
        description:
            'Bắn đạn nhớt của sên\n' +
            'vào vị trí xác định,\n' +
            'nhớt sẽ bung ra làm chậm\n' +
            'quái trong vùng ảnh hưởng',
    },
    {
        id: 105,
        energy: 10,
        texture: asset.cardTowerIceGun_png,
        description:
            'Bắn đạn băng vào một mục tiêu,\n' +
            'mục tiêu trúng sẽ bị đóng băng\n' +
            'trong một khoảng thời gian',
    },
    {
        id: 106,
        energy: 12,
        texture: asset.cardTowerAttackSpeed_png,
        description:
            'Tăng Tốc bắn cho các Tháp\n' +
            'nằm trong vùng Tháp',
    },
    {
        id: 107,
        energy: 12,
        texture: asset.cardTowerDamage_png,
        description:
            'Tăng Sát thương cho các Tháp\n' +
            'nằm trong vùng Tháp',
    },

    // monsters
    {
        id: 201,
        energy: 1,
        texture: asset.cardMonsterSwordsman_png,
        description: 'Máu thường, tốc độ thường',
    },
    {
        id: 202,
        energy: 1,
        texture: asset.cardMonsterAssassin_png,
        description: 'Máu thấp, chạy rất nhanh',
    },
    {
        id: 203,
        energy: 3,
        texture: asset.cardMonsterGiant_png,
        description: 'Máu cao, đi chậm',
    },
    {
        id: 204,
        energy: 2,
        texture: asset.cardMonsterBat_png,
        description: 'Máu thường, tốc độ thường',
    },
    {
        id: 205,
        energy: 1,
        texture: asset.cardMonsterNinja_png,
        description: 'Máu thường, tốc độ thường',
    },

    // spells
    {
        id: 301,
        energy: 8,
        texture: asset.cardPotionFireball_png,
        description:
            'Thả cầu lửa gây sát thương\n' +
            'một vùng ngay lập tức',
    },
    {
        id: 302,
        energy: 8,
        texture: asset.cardPotionFrozen_png,
        description:
            'Thả phép đóng băng gây\n' +
            'sát thương một vùng ngay\n' +
            'lập tức, đồng thời đóng băng\n' +
            'quái tấn công mình hoặc\n' +
            'trụ đối thủ trong vùng đó',
    },
    {
        id: 303,
        energy: 12,
        texture: asset.cardPotionHeal_png,
        description:
            'Thả phép tạo vùng hồi máu,\n' +
            'quái đi vào sẽ được\n' +
            'hồi máu một thời gian',
    },
    {
        id: 304,
        energy: 12,
        texture: asset.cardPotionSpeedUp_png,
        description:
            'Thả phép tạo một vùng tăng tốc,\n' +
            'quái đi vào sẽ tăng tốc độ chạy',
    },
    {
        id: 305,
        energy: 10,
        texture: asset.cardPotionTrap_png,
        description:
            'Đặt lò xo trên bản đồ,\n' +
            'quái di chuyển vào lò xo\n' +
            'sẽ bị bật trở lại cổng ra quái',
    },
    {
        id: 306,
        energy: 10,
        texture: asset.cardPotionPower_png,
        description:
            'Tạo một vùng tăng sức mạnh,\n' +
            'trụ nằm trong vùng này\n' +
            'sẽ được tăng sức mạnh',
    },
];
