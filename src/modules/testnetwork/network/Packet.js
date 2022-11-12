/**
 * Created by KienVN on 10/2/2017.
 */

gv.CMD = gv.CMD || {};
gv.CMD.HANDSHAKE = 0;
gv.CMD.USER_LOGIN = 1;

gv.CMD.USER_INFO = 1001;
gv.CMD.MOVE = 2001;
gv.CMD.OPEN_CHEST = 3001;
gv.CMD.START_COOLDOWN = 3002;
gv.CMD.UPDATE_PLAYER_INFO = 3003;

testnetwork = testnetwork || {};
testnetwork.packetMap = {};


/** Outpacket */

//Handshake
CmdSendHandshake = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setControllerId(gv.CONTROLLER_ID.SPECIAL_CONTROLLER);
            this.setCmdId(gv.CMD.HANDSHAKE);
        },
        putData: function () {
            //pack
            this.packHeader();
            //update
            this.updateSize();
        }
    }
)
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
)

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
            // this.putInt(sharePlayerInfo.id);
            //update
            this.updateSize();
        }
    }
)

CmdSendStartCooldownChest = fr.OutPacket.extend(
    {
        ctor: function () {
            this._super();
            this.initData(100);
            this.setCmdId(gv.CMD.START_COOLDOWN);
        },
        /**
         * send open START COOL DOWN request
         * sử dụng biến sharePlayerInfo.id
         * @param {Chest} chest: the chest to START OPENING*/
        putData: function (chest) {
            //pack
            this.packHeader();
            this.putInt(chest.id);
            // this.putInt(sharePlayerInfo.id);
            //update
            this.updateSize();
        }
    }
)

CmdSendLogin = fr.OutPacket.extend(
    {
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
    }
)

CmdSendMove = fr.OutPacket.extend(
    {
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
    }
)

/**
 * InPacket
 */

//Handshake
testnetwork.packetMap[gv.CMD.HANDSHAKE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.token = this.getString();
        }
    }
);

testnetwork.packetMap[gv.CMD.USER_LOGIN] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
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
        let id = this.getInt();
        let name = this.getString();
        let type = this.getByte();
        let level = this.getInt();
        let quantity = this.getInt();
        let attackSpeed = this.getDouble();
        let attackRange = this.getDouble();
        return new Card(id, name, type, level, quantity, attackSpeed, attackRange);
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
        return null;
    },
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

        if (openOnServerTimestamp === CFG.UNOPEN_CHEST_TIMESTAMP ||
            openOnServerTimestamp === CFG.UNOPEN_CHEST_TIMESTAMP.toString()) {
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

        cc.director.getRunningScene().tabUIs[CFG.LOBBY_TAB_HOME].startCooldownChestSlot(chestID, openOnServerTimestamp);
    }
});

testnetwork.packetMap[gv.CMD.OPEN_CHEST] = fr.InPacket.extend(
    {
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
                goldReceived = this.getInt();
                serverNow = this.getLong();
                Utils.updateTimeDiff(serverNow);
                cc.director.getRunningScene().tabUIs[CFG.LOBBY_TAB_HOME].openChestSlot(chestID, newCards, goldReceived);
            }
        },

        readCardData: function () {
            let id = this.getInt();
            let name = this.getString();
            let type = this.getByte();
            let level = this.getInt();
            let quantity = this.getInt();
            let attackSpeed = this.getDouble();
            let attackRange = this.getDouble();
            return new Card(id, name, type, level, quantity, attackSpeed, attackRange);
        },
    }
);

testnetwork.packetMap[gv.CMD.MOVE] = fr.InPacket.extend(
    {
        ctor: function () {
            this._super();
        },
        readData: function () {
            this.x = this.getInt();
            this.y = this.getInt();
        }
    }
);




