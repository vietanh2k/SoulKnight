var PlayerInfo = cc.Class.extend({

    ctor: function (id, name, gold, gem, trophy, collection, chestList, deck) {
        this.id = id;
        this.name = name;
        this.gold = gold;
        this.gem = gem;
        this.trophy = trophy;
        this.collection = collection;
        this.chestList = chestList;
        this.deck = deck;

        // fake data
        // this.name = FAKE.name;
        // this.gold = FAKE.gold;
        // this.gem = FAKE.gem;
        // this.trophy = FAKE.trophy;
        // this.collection = fake.collection;
        // this.chestList = FAKE.chests;
        // this.deck = fake.deck;
    },

    getChestById: function (chestId) {
        let rs = null;
        if (this.chestList != null) {
            this.chestList.map(function (chest) {
                if (chest.id === chestId) {
                    rs = chest;
                }
            })
        }
        return rs;
    },

    addNewCards: function (newCards) {
        // TODO add new cards after open a chest
        for (let i = 0; i < newCards.length; i++) {
            let j = 0;
            for (j = 0; j < sharePlayerInfo.collection.length; j++) {
                if (newCards[i].type === sharePlayerInfo.collection[j].type) {
                    sharePlayerInfo.collection[j] = newCards[i];
                    break;
                }
            }
            if (j === sharePlayerInfo.collection.length) {
                sharePlayerInfo.collection.push(newCards[i]);
            }
        }
        LobbyInstant.tabUIs[cf.LOBBY_TAB_CARDS].updateAllCardSlots();
    },

    /**
     * Sort collection by energy, ascending or descending order.
     *
     * @param {boolean} isAscOrder sort by ascending order?
     * @return {void}
     */
    sortCollectionByEnergy: function (isAscOrder) {
        this.collection.sort((a, b) => (a.energy - b.energy) * (2 * isAscOrder - 1));
    },
})

var sharePlayerInfo;
