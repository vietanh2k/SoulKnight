var CFG = CFG || {};

CFG.WIDTH = 640;
CFG.HEIGHT = 960;

CFG.AMOUNT_BTN_GOLD = 1000;
CFG.AMOUNT_BTN_GEM = 100;
CFG.LOBBY_MAX_TAB = 5;
CFG.LOBBY_MAX_CHEST = 4;
CFG.LOBBY_TAB_NAMES = ['Shop', 'Cards', 'Home', 'Social', 'Clan'];

CFG.TIME_DIFF = 0; // = thời gian trên server trừ thời gian trên client
CFG.UNOPEN_CHEST_TIMESTAMP = '-1';
CFG.COST_GEMS_PER_HOUR = 2;
CFG.CHEST_REWARD = [
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
