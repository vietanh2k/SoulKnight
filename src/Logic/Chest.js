var Chest = cc.Class.extend({
    ctor: function (id, type, openOnServerTimestamp) {
        this.id = id;
        this.type = type;
        this.setRemainingTime(openOnServerTimestamp);
        // this.openTimeInSecond= byte_buffer.getLong();
        // thời gian mở rương cố định: ví d: 3600s, 7200s,...
    },

    /**
     * Cài thời gian đếm ngược mở rương
     * Nếu rương chưa start cool down, remaining time phải có giá trị 1000000*/
    setRemainingTime: function (openOnServerTimestamp) {
        // update UI gì đó.... (nếu có)
        this.openOnServerTimestamp = openOnServerTimestamp;
        this._init_time_stamp = Date.now() / 1000;
    },

    onOpenNow: function () {
        // testnetwork.connector.sendOpenChestRequest(this);
        if (Date.now() / 1000 - this._init_time_stamp + 1 > this.remainingTimeInSecond) {
            testnetwork.sendOpenChestRequest(this);
        } else {
            cc.log("not time!")
        }
    },

    /**
     * Gửi yêu cầu bắt đầu cooldown
     * */
    startCoolDown: function () {
        testnetwork.connector.sendStartCoolDownRequest(this);
    },

    /**
     * Xử lý phải hồi yêu cầu bắt đầu cooldown
     * @return{String} status: Phản hồi dạng string từ server
     * */
    onStartCoolDown: function (byte_buffer) {
        // đặt lại mốc remaining time cập nhập từ server
        this.setRemainingTime(byte_buffer.getLong());
        // lấy phản hồi
        res_status = byte_buffer.getString();
        return res_status;
    },

    getGemToOpen: function () {
        return 20;
    },

    getGoldToOpen: function () {
        return 20;
    }
});
