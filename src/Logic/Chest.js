var Chest  = cc.Class.extend({
    ctor: function (byte_buffer) {
        this.id= byte_buffer.getInt();
        this.type= byte_buffer.getByte();
        this.remainingTimeInSecond= this.setRemainingTime(byte_buffer.getLong());
        this.openTimeInSecond= byte_buffer.getLong(); //thời gian mở rương cố định: ví d: 3600s, 7200s,...

    },
    /**
     * Cài thời gian đếm ngược mở rương
     * Nếu rương chưa start cool down, remaining time phải có giá trị 1000000*/
    setRemainingTime:function (time_in_second){
        // update UI gì đó.... (nếu có)
        this.remainingTimeInSecond = time_in_second;
        this._init_time_stamp = Date.now() / 1000
    },
    // todo: thêm các hàm
    onOpenNow: function (){
        // testnetwork.connector.sendOpenChestRequest(this);
        if (Date.now() / 1000 - this._init_time_stamp + 1 > this.remainingTimeInSecond){
            testnetwork.sendOpenChestRequest(this);
        } else {
            cc.log("not time!")
        }
    },
    /**
     * Gửi yêu cầu bắt đầu cooldown
     * */
    startCoolDown: function (){
        testnetwork.connector.sendStartCoolDownRequest(this);
    },
    /**
     * Xử lý phải hồi yêu cầu bắt đầu cooldown
     * @return{String} status: Phản hồi dạng string từ server
     * */
    onStartCoolDown: function (byte_buffer){
        // đặt lại mốc remaining time cập nhập từ server
        this.setRemainingTime(byte_buffer.getLong());
        // lấy phản hồi
        let res_status = byte_buffer.getString();
        return res_status


    }
})