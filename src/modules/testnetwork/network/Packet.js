/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD || {};
gv.CMD.HAND_SHAKE = 0;
gv.CMD.USER_LOGIN = 1;

gv.CMD.USER_INFO = 1001;
gv.CMD.MOVE = 2001;
gv.CMD.OPEN_CHEST = 3001;
gv.CMD.START_COOLDOWN = 3002;
gv.CMD.UPDATE_PLAYER_INFO = 3003;
gv.CMD.ADD_CURRENCY = 3004;
gv.CMD.UPGRADE_CARD = 3005;
gv.CMD.SWAP_CARD_INTO_DECK = 3008;
gv.CMD.MATCH_REQUEST = 4001;
gv.CMD.MATCH_REPONSE = 4002;
gv.CMD.MATCH_CONFIRM = 4003;
gv.CMD.BATTLE_START = 5001;

testnetwork = testnetwork || {};
testnetwork.packetMap = {};

// HAND_SHAKE
CmdSendHandshake = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
        this.setCmdId(gv.CMD.HAND_SHAKE);
    },
    putData: function () {
        this.packHeader();
        this.updateSize();
    }
});
testnetwork.packetMap[gv.CMD.HAND_SHAKE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        this.token = this.getString();
    }
});

// USER_LOGIN
CmdSendLogin = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.USER_LOGIN);
    },
    pack: function (userId) {
        this.packHeader();
        this.putString("section");
        this.putInt(userId)
        this.updateSize();
    }
});
testnetwork.packetMap[gv.CMD.USER_LOGIN] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
    }
});

// USER_INFO
CmdSendUserInfo = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.USER_INFO);
        },
        pack: function () {
            this.packHeader();
            this.updateSize();
        }
    }
);
testnetwork.packetMap[gv.CMD.USER_INFO] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },

    readData: function () {
        let id = this.getInt();
        let name = this.getString();
        let gold = this.getInt();
        let gem = this.getInt();
        let trophy = this.getInt();
        let collectionSize = this.getInt();
        let collection = [];
        for (let i = 0; i < collectionSize; i++) {
            collection.push(this.readCardData());
        }
        let chestListSize = this.getInt();
        let chestList = [];
        for (let i = 0; i < chestListSize; i++) {
            chestList.push(this.readChestData());
        }
        let deckSize = this.getInt();
        let deck = [];
        for (let i = 0; i < deckSize; i++) {
            deck.push(this.readCardTypeData(collection));
        }

        let serverNow = this.getLong();
        Utils.updateTimeDiff(serverNow);
        chestList.forEach(chest => chest.updateClientTime());

        sharePlayerInfo = new PlayerInfo(id, name, gold, gem, trophy, collection, chestList, deck);
        cc.log("Received user data from server: " + JSON.stringify(sharePlayerInfo));
    },

    readCardData: function () {
        let type = this.getByte();
        let level = this.getInt();
        let fragment = this.getInt();
        return new Card(type, level, fragment);
    },

    readChestData: function () {
        let id = this.getInt();
        let type = this.getByte();
        let openOnServerTimestamp = this.getLong();
        return new Chest(id, type, openOnServerTimestamp);
    },

    readCardTypeData: function (collection) {
        let type = this.getByte();
        for (let i = 0; i < collection.length; i++) {
            if (collection[i].type === type) {
                return collection[i];
            }
        }
        cc.log('Không tìm thấy card type ' + type + ' trong collection.');
        return null;
    },
});

// OPEN_CHEST
CmdSendOpenChest = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.OPEN_CHEST);
        },
        putData: function (chest, gemSpent) {
            //pack
            this.packHeader();
            this.putInt(chest.id);
            this.putInt(gemSpent);
            //update
            this.updateSize();
        }
    }
);
testnetwork.packetMap[gv.CMD.OPEN_CHEST] = fr.InPacket.extend({
        ctor: function () {
            this._super();
        },

        readData: function () {
            let status = this.getString();
            let chestID = this.getInt();
            let newCardsSize = this.getInt();
            cc.log('Received open chest response from server. Chest ID ' + chestID + ' with status \"' + status + '\" and the amount of new cards is ' + newCardsSize + '.');
            let newCards = [], goldReceived, serverNow;
            if (status === "Success") {
                for (let i = 0; i < newCardsSize; i++) {
                    newCards.push(this.readCardData());
                }
                cc.log('New cards: ' + JSON.stringify(newCards));
                goldReceived = this.getInt();

                serverNow = this.getLong();
                Utils.updateTimeDiff(serverNow);

                cc.director.getRunningScene().runOpenChestAnimation(chestID, newCards, goldReceived);
            } else {
                Utils.addToastToRunningScene(status);
            }
        },

        readCardData: function () {
            let type = this.getByte();
            let level = this.getInt();
            let fragment = this.getInt();
            return new Card(type, level, fragment);
        },
    }
);

// START_COOLDOWN
CmdSendStartCooldownChest = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.START_COOLDOWN);
    },

    putData: function (chest) {
        this.packHeader();
        this.putInt(chest.id);
        this.updateSize();
    }
});
testnetwork.packetMap[gv.CMD.START_COOLDOWN] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },

    readData: function () {
        let chestID = this.getInt();
        let openOnServerTimestamp = this.getLong();
        cc.log('Received start cooldown response from server. Chest ID: ' + chestID + ', open on server timestamp: ' + openOnServerTimestamp + '.');

        let serverNow = this.getLong();
        Utils.updateTimeDiff(serverNow);

        if (openOnServerTimestamp === cf.UNOPEN_CHEST_TIMESTAMP ||
            openOnServerTimestamp === cf.UNOPEN_CHEST_TIMESTAMP.toString()) {
            Utils.addToastToRunningScene('Rương chưa được bắt đầu mở!');
            return;
        }
        if (chestID === -1 || chestID === '-1') {
            Utils.addToastToRunningScene('Server không tìm được chest hay user');
            return;
        }
        this.chest = sharePlayerInfo.getChestById(chestID);
        if (this.chest == null) {
            Utils.addToastToRunningScene('Client không tìm thấy rương');
            return;
        }

        cc.director.getRunningScene().tabUIs[cf.LOBBY_TAB_HOME].startCooldownChestSlot(chestID, openOnServerTimestamp);
    }
});

// ADD_CURRENCY
CmdSendAddCurrency = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.ADD_CURRENCY);
    },

    putData: function (isGem, amount) {
        this.packHeader();
        this.putInt(0 + isGem);
        this.putInt(amount);
        this.updateSize();
    },
});
testnetwork.packetMap[gv.CMD.ADD_CURRENCY] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },

    readData: function () {
        let type = this.getByte();
        let amount = this.getInt();
        let status = this.getString();
        cc.log('Get add currency response from server. type: ' + type + ', amount: ' + amount + ', status: ' + status + '.');

        let serverNow = this.getLong();
        Utils.updateTimeDiff(serverNow);

        if (status === "Success") {
            this.updatePlayerResource(type, amount);
            cc.director.getRunningScene().currencyPanel.updateLabels();
        } else {
            Utils.addToastToRunningScene(status);
        }
    },

    updatePlayerResource: function (type, amount) {
        if (type === 0) sharePlayerInfo.gem += amount;
        else sharePlayerInfo.gold += amount;
    },
});

// SWAP_CARD_INTO_DECK
CmdSendAddSwapCardIntoDeck = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.SWAP_CARD_INTO_DECK);
    },

    putData: function (typeIn, typeOut) {
        this.packHeader();
        this.putByte(typeIn);
        this.putByte(typeOut);
        this.updateSize();
    },
});
testnetwork.packetMap[gv.CMD.SWAP_CARD_INTO_DECK] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },

    readData: function () {
        let status = this.getString();
        let typeIn = this.getByte();
        let typeOut = this.getByte();
        cc.log('Get swap card into deck response from server. Status: ' + status + ', typeIn: ' + typeIn + ', typeOut: ' + typeOut + '.');

        let serverNow = this.getLong();
        Utils.updateTimeDiff(serverNow);

        if (status === "Success") {
            cc.director.getRunningScene().tabUIs[cf.LOBBY_TAB_CARDS].updateDeckSlot();
        } else {
            Utils.addToastToRunningScene(status);
            cc.director.getRunningScene().tabUIs[cf.LOBBY_TAB_CARDS].swapInCardSlot.removeFromParent(true);
            cc.director.getRunningScene().tabUIs[cf.LOBBY_TAB_CARDS].quitAddCardToDeck();
        }
    },
});

// UPGRADE_CARD
CmdSendUpgradeCard = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.UPGRADE_CARD);
    },

    putData: function (type, goldSpent) {
        this.packHeader();
        this.putByte(type);
        this.putInt(goldSpent);
        this.updateSize();
    },
});
testnetwork.packetMap[gv.CMD.UPGRADE_CARD] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },

    readData: function () {
        let type = this.getByte();
        let status = this.getString();
        let card = this.readCardData();

        cc.log('Get upgrade card response from server. Status: ' + status + ', type: ' + type + ', card: ' + JSON.stringify(card) + '.');

        let serverNow = this.getLong();
        Utils.updateTimeDiff(serverNow);

        if (status === "Success") {
            // todo upgrade card
        } else {
            Utils.addToastToRunningScene(status);
            // todo dọn UI
        }
    },

    readCardData: function () {
        let type = this.getByte();
        let level = this.getInt();
        let fragment = this.getInt();
        return new Card(type, level, fragment);
    },
});

// MOVE
CmdSendMove = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.MOVE);
    },
    pack: function (direction) {
        this.packHeader();
        this.putShort(direction);
        this.updateSize();
    }
});
testnetwork.packetMap[gv.CMD.MOVE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        this.x = this.getInt();
        this.y = this.getInt();
    }
});

// MATCH_REQUEST
CmdMatchRequest = fr.OutPacket.extend({
    ctor: function () {
        this._super();
        this.initData(100);
        this.setCmdId(gv.CMD.MATCH_REQUEST);
    },
    pack: function () {
        this.packHeader();
        this.updateSize();
    }
});

// MATCH_CONFIRM
CmdMatchConfirm = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.MATCH_CONFIRM);
        },
        pack: function () {
            this.packHeader();
            this.updateSize();
        }
    });


testnetwork.packetMap[gv.CMD.MATCH_REPONSE] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        this.x = this.getInt();
    }
});


testnetwork.packetMap[gv.CMD.BATTLE_START] = fr.InPacket.extend({
    ctor: function () {
        this._super();
    },
    readData: function () {
        var scene = new cc.Scene();
        scene.addChild(new GameUI(this));
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
        cc.log('=================')
    }
});





