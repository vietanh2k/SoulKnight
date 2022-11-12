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
    },
    {
        id: 102,
        energy: 12,
        texture: asset.cardTowerWizard_png,
    },
    {
        id: 103,
        energy: 10,
        texture: asset.cardTowerBoomerang_png,
    },
    {
        id: 104,
        energy: 12,
        texture: asset.cardTowerOilGun_png,
    },
    {
        id: 105,
        energy: 10,
        texture: asset.cardTowerIceGun_png,
    },
    {
        id: 106,
        energy: 12,
        texture: asset.cardTowerAttackSpeed_png,
    },
    {
        id: 107,
        energy: 12,
        texture: asset.cardTowerDamage_png,
    },

    // monsters
    {
        id: 201,
        energy: 1,
        texture: asset.cardMonsterSwordsman_png,
    },
    {
        id: 202,
        energy: 1,
        texture: asset.cardMonsterAssassin_png,
    },
    {
        id: 203,
        energy: 3,
        texture: asset.cardMonsterGiant_png,
    },
    {
        id: 204,
        energy: 2,
        texture: asset.cardMonsterBat_png,
    },
    {
        id: 205,
        energy: 1,
        texture: asset.cardMonsterNinja_png,
    },

    // spells
    {
        id: 301,
        energy: 8,
        texture: asset.cardPotionFireball_png,
    },
    {
        id: 302,
        energy: 8,
        texture: asset.cardPotionFrozen_png,
    },
    {
        id: 303,
        energy: 12,
        texture: asset.cardPotionHeal_png,
    },
    {
        id: 304,
        energy: 12,
        texture: asset.cardPotionSpeedUp_png,
    },
    {
        id: 305,
        energy: 10,
        texture: asset.cardPotionTrap_png,
    },
    {
        id: 306,
        energy: 10,
        texture: asset.cardPotionPower_png,
    },
];
