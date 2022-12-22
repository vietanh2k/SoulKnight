COUNT_DELAY_RESET = 12
COUNT_CORRECT_RESET = 20;
MAX_DELAY = 5;
// MAX_CORRECT =

var gv = gv || {};
var testnetwork = testnetwork || {};

testnetwork.Connector = cc.Class.extend({
    ctor: function (gameClient) {
        this.gameClient = gameClient;
        this.checkDelay = 0;
        this.countDelay = 12;
        this.countCorrect = 20;
        gameClient.packetFactory.addPacketMap(testnetwork.packetMap);
        gameClient.receivePacketSignal.add(this.onReceivedPacket, this);
        this._userName = "username";
    },

    onReceivedPacket: function (cmd, packet) {
        // cc.log("onReceivedPacket:", cmd);

        switch (cmd) {
            case gv.CMD.HAND_SHAKE:
                this.sendLoginRequest();
                break;
            case gv.CMD.USER_LOGIN:
                this.sendGetUserInfo();
                if(fr.getCurrentScreen()!=null){
                    // if current screen is opening (login)
                    fr.getCurrentScreen().onFinishLogin();
                }

                break;
            case gv.CMD.USER_INFO:
                if(fr.getCurrentScreen()!=null){
                    // if current screen is opening (lobby)
                    fr.getCurrentScreen().onUserInfo(packet.name, packet.x, packet.y);
                }
                break;
            case gv.CMD.MOVE:
                cc.log("MOVE:", packet.x, packet.y);
                fr.getCurrentScreen().updateMove(packet.x, packet.y);
                break;

            case gv.CMD.OPEN_CHEST:
                cc.log('receive open chest now response')
                break;
            case gv.CMD.START_COOLDOWN:
                // fr.getCurrentScreen().onReceivedServerResponse(packet.status);
                break;
            case gv.CMD.MATCH_REPONSE:
                cc.log('matching succeededddddddddddd')
                cc.log(packet.x)
                this.getOpponentInfor(packet.x)
                try{
                    fr.getCurrentScreen().requestConfirmMatch()
                } catch (e){
                    cc.log(e);
                    cc.log(e.stack)
                    cc.log('outtttttttttttttt')
                }
                break;
            case gv.CMD.BATTLE_START:
                cc.log('battle start succeededddddddddddd')
                try{
                    fr.getCurrentScreen().updateJoinUI()
                } catch (e){
                    cc.log('outtttttttttttttt')
                }
                break;
            case gv.CMD.OFFER_RESPONSE:
                LobbyInstant.tabUIs[cf.LOBBY_TAB_SHOP].updateShop(packet);
                cc.log('offer reponse succeededddddddddddd')
                break;
            case gv.CMD.BATTLE_SYNC_START:
                //cc.log("=========================gv.CMD.BATTLE_SYNC_START================================")
                this.sendSyncStartConfirm(packet.syncN)
                break
            case gv.CMD.BATTLE_SYNC_CLIENT_UPDATE_TO_FRAME_N:
                //cc.log("=========================gv.CMD.BATTLE_SYNC_CLIENT_UPDATE_TO_FRAME_N================================")
                this.sendSyncUpdateToFrameNConfirm(packet.syncN, packet.frameN)
                break
            case gv.CMD.BATTLE_ACTIONS:
                //cc.log("=========================recv gv.CMD.BATTLE_ACTIONS================================")
                break
            case gv.CMD.BUY_GEM_OR_GOLD:
                if (packet.typee == 0) {
                    sharePlayerInfo.gem += packet.amout
                    LobbyInstant.currencyPanel.updateLabelsGem(10)
                } else {
                    if(packet.amout > 600) {
                        LobbyInstant.tabUIs[cf.LOBBY_TAB_SHOP].updateBuyGold(packet)
                    }else{
                        LobbyInstant.currencyPanel.updateLabelsGold(20)
                        LobbyInstant.tabUIs[cf.LOBBY_TAB_SHOP].updateCanBuyUI()
                    }
                    cc.log("=========================BUY GOLD SUCCEEDED================================")
                }
                break
            case gv.CMD.BUY_CARD:
                LobbyInstant.tabUIs[cf.LOBBY_TAB_SHOP].updateBuyCard(packet)
                cc.log("=========================BUY CARD SUCCEEDED================================")
                break
            case gv.CMD.BUY_CHEST:
                // LobbyInstant.tabUIs[cf.LOBBY_TAB_SHOP].updateBuyChest(packet)
                cc.log("=========================BUY CARD SUCCEEDED================================")
                break

            case gv.CMD.BATTLE_SEND_CUR_FRAME:
                // LobbyInstant.tabUIs[cf.LOBBY_TAB_SHOP].updateBuyChest(packet)
                // cc.log("=========================send frame$$$$$$================================")
                let amount = Date.now() - PreDate
                this.checkDelayWithServer(amount);
                this.checkCorrectWithServer(amount);
                PreDate = Date.now()
                // cc.log('amount = ' +amount+' '+ FrameDelayPosible*GAME_CONFIG.DEFAULT_DELTA_TIME*1000+'  '+FrameDelayPosible)
                break
        }
    },
    sendGetUserInfo: function () {
        cc.log("sendGetUserInfo");
        var pk = this.gameClient.getOutPacket(CmdSendUserInfo);
        pk.pack();
        this.gameClient.sendPacket(pk);
    },
    sendLoginRequest: function () {
        var pk = this.gameClient.getOutPacket(CmdSendLogin);
        pk.pack(this.gameClient._userId);
        this.gameClient.sendPacket(pk);


    },
    sendMove: function (direction) {
        cc.log("SendMove:" + direction);
        var pk = this.gameClient.getOutPacket(CmdSendMove);
        pk.pack(direction);
        this.gameClient.sendPacket(pk);
    },

    sendStartCooldownRequest: function (chest) {
        cc.log("Send start cooldown request for chest ID: " + chest.id);
        let pk = this.gameClient.getOutPacket(CmdSendStartCooldownChest);
        pk.putData(chest);
        this.gameClient.sendPacket(pk);
    },
    /**
     * gửi yêu cầu mở chest
     * */
    sendOpenChestRequest: function (chest, gemSpent) {
        cc.log('Send open chest request for chest ID ' + chest.id + ' by spend ' + gemSpent + ' gem(s).');
        let pk = this.gameClient.getOutPacket(CmdSendOpenChest);
        pk.putData(chest, gemSpent);
        this.gameClient.sendPacket(pk);
    },
    sendMatchRequest: function () {
        cc.log("MatchRequest:");
        var pk = this.gameClient.getOutPacket(CmdMatchRequest);
        cc.log(pk)
        pk.pack(null);
        this.gameClient.sendPacket(pk);
    },
    sendConfirmMatch: function () {
        cc.log("Match Confirm:");
        var pk = this.gameClient.getOutPacket(CmdMatchConfirm);
        pk.pack(null);
        this.gameClient.sendPacket(pk);
    },

    sendSyncStartConfirm: function (syncN) {
        cc.log("sendSyncStartConfirm");
        // GameStateManagerInstance.updateType = GameStateManagerInstance.UPDATE_TYPE_NO_UPDATE
        const pk = this.gameClient.getOutPacket(CmdBattleSyncStartConfirm);
        pk.pack(syncN, GameStateManagerInstance.frameCount);
        this.gameClient.sendPacket(pk);
    },

    sendSyncUpdateToFrameNConfirm: function (syncN, maxFrame) {
        cc.log("sendSyncUpdateToFrameNConfirm");

        const remain = maxFrame - GameStateManagerInstance.frameCount
        for (let i = 0; i < remain; i++) {
            GameStateManagerInstance.frameUpdate()
        }

        // GameStateManagerInstance.updateType = GameStateManagerInstance.UPDATE_TYPE_NO_UPDATE
        const pk = this.gameClient.getOutPacket(CmdBattleSyncClientUpdateToFrameNConfirm);
        pk.pack(syncN);
        this.gameClient.sendPacket(pk);
    },

    sendActions: function (actions) {
        cc.log('send actions: ' + JSON.stringify(actions));
        // send actions: [{"card_type":16,"x":125,"y":175,"uid":2}]
        // GameStateManagerInstance.updateType = GameStateManagerInstance.UPDATE_TYPE_NO_UPDATE
        const pk = this.gameClient.getOutPacket(CmdBattleActions);
        pk.pack(actions);
        this.gameClient.sendPacket(pk);
    },
    sendRequestOffer: function () {
        var pk = this.gameClient.getOutPacket(CmdOfferRequest);
        cc.log(pk)
        pk.pack(null);
        this.gameClient.sendPacket(pk);
    },
    sendBuyGemOrGold: function (typee, amout) {
        var pk = this.gameClient.getOutPacket(CmdBuyGemOrGold);
        pk.pack(typee, amout);
        this.gameClient.sendPacket(pk);
    },
    sendBuyCard: function (leng, buyList, cost) {
        var pk = this.gameClient.getOutPacket(CmdBuyCard);
        cc.log(pk)
        pk.pack(leng, buyList, cost);
        this.gameClient.sendPacket(pk);
    },
    sendBuyChest: function (leng, buyList, cost) {
        var pk = this.gameClient.getOutPacket(CmdBuyChest);
        cc.log(pk)
        pk.pack(leng, buyList, cost);
        this.gameClient.sendPacket(pk);
    },
    sendAddCurrencyRequest: function (isGem, amount) {
        cc.log('Send add currency request: isGem: ' + isGem + ', amount:' + amount + '.');
        let pk = this.gameClient.getOutPacket(CmdSendAddCurrency);
        pk.putData(isGem, amount);
        this.gameClient.sendPacket(pk);
    },

    sendSwapCardIntoDeckRequest: function (typeIn, typeOut) {
        cc.log('Send swap card into deck request: typeIn = ' + typeIn + ', typeOut = ' + typeOut + '.');
        let pk = this.gameClient.getOutPacket(CmdSendSwapCardIntoDeck);
        pk.putData(typeIn, typeOut);
        this.gameClient.sendPacket(pk);
    },

    sendUpgradeCardRequest: function (type, goldSpent) {
        cc.log('Send upgrade card request: type = ' + type + ', gold spent = ' + goldSpent + '.');
        let pk = this.gameClient.getOutPacket(CmdSendUpgradeCard);
        pk.putData(type, goldSpent);
        this.gameClient.sendPacket(pk);
    },
    getOpponentInfor: function (uid) {
        let pk = this.gameClient.getOutPacket(CmdGetInforFromUid);
        pk.putData(uid);
        this.gameClient.sendPacket(pk);
    },

    /*
    check xem client có đang delay liên tục không
    nếu có thì tăng lượng delay tối đa giữa client này với server
    đầu vào là thời gian nhận gói tin Frame từ server
     */
    checkDelayWithServer: function (amount) {

        if(amount>(FrameDelayPosible*GAME_CONFIG.DEFAULT_DELTA_TIME*1000)) {
            this.checkDelay ++;
        }
        if( this.checkDelay >0){
            this.countDelay --;
        }
        if(this.countDelay === 0) {
            this.countDelay = COUNT_DELAY_RESET;
            this.checkDelay = 0;
        }
        if(this.checkDelay === MAX_DELAY) {
            FrameDelayPosible = Math.min(FrameDelayPosible += 5, FrameDelayMax);
            this.checkDelay = 0;
            this.countDelay = COUNT_DELAY_RESET;
            cc.log("Frame Posible================ "+ FrameDelayPosible)
        }
    },

    /*
    check xem client có đang chạy đúng liên tục không
    nếu có thì giảm lượng delay tối đa giữa client này với server
    đầu vào là thời gian nhận gói tin Frame từ server
     */
    checkCorrectWithServer: function (amount) {
        if(amount>=(FrameDelayPosible*GAME_CONFIG.DEFAULT_DELTA_TIME*1000)){
            this.countCorrect = COUNT_CORRECT_RESET;
        }else {
            this.countCorrect --;
        }
        if(this.countCorrect === 0){
            this.countCorrect = COUNT_CORRECT_RESET;
            FrameDelayPosible = Math.max(FrameDelayPosible -= 2, FrameDelayMin);
            cc.log("Frame Posible================ "+ FrameDelayPosible)
        }
    },
});
