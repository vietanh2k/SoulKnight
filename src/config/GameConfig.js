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

cf.TIME_DIFF = 0; // = thời gian trên server trừ thời gian trên client
cf.UNOPEN_CHEST_TIMESTAMP = -1;
cf.COST_GEMS_PER_HOUR = 6;
cf.CHEST_REWARD = [
    {
        openTimeRequired: 3 * 60 * 60 * 1000,
        golds: [10, 20],
        cards: [4, 5],
        rarities: [1, 2],
    },
    {
        openTimeRequired: 3 * 60 * 60 * 1000,
        golds: [100, 200],
        cards: [40, 50],
        rarities: [1, 2, 3],
    },
    {
        openTimeRequired: 3 * 60 * 60 * 1000,
        golds: [200, 400],
        cards: [400, 500],
        rarities: [1, 2, 3, 4],
    },
    {
        openTimeRequired: 3 * 60 * 60 * 1000,
        golds: [10, 90],
        cards: [6, 8],
        rarities: [2, 3, 4],
    },
];
