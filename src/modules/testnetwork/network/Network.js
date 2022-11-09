/**
 * Created by KienVN on 10/2/2017.
 */

var gv = gv || {};
var testnetwork = testnetwork || {};

testnetwork.Connector = cc.Class.extend({
    ctor: function (gameClient) {
        this.gameClient = gameClient;
        gameClient.packetFactory.addPacketMap(testnetwork.packetMap);
        gameClient.receivePacketSignal.add(this.onReceivedPacket, this);
        this._userName = "username";
    },

    onReceivedPacket: function (cmd, packet) {
        cc.log("onReceivedPacket:", cmd);

        switch (cmd) {
            case gv.CMD.HAND_SHAKE:
                this.sendLoginRequest();
                break;
            case gv.CMD.USER_LOGIN:
                this.sendGetUserInfo();
                fr.getCurrentScreen().onFinishLogin();
                break;
            case gv.CMD.USER_INFO:
                fr.getCurrentScreen().onUserInfo(packet.name, packet.x, packet.y);
                break;
            case gv.CMD.MOVE:
                cc.log("MOVE:", packet.x, packet.y);
                fr.getCurrentScreen().updateMove(packet.x, packet.y);
                break;
            case gv.CMD.OPEN_CHEST_NOW:
                fr.getCurrentScreen().onReceivedServerResponse(packet.status);
                break;
            case gv.CMD.START_COOL_DOWN:

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
    /**
     * gửi yêu cầu mở chest
     * */
    sendOpenChestRequest: function (chest) {
        cc.log("SendOpenChest:" + chest.id);
        var pk = this.gameClient.getOutPacket(CmdSendOpenChest);
        pk.putData(chest);
        this.gameClient.sendPacket(pk);
    },
    sendStartCoolDownRequest: function (chest) {
        cc.log("SendStartCoolDownChest:" + chest.id);
        var pk = this.gameClient.getOutPacket(CmdSendStartCoolDownChest);
        pk.putData(chest);
        this.gameClient.sendPacket(pk);
    },
});



