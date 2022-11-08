var Chest  = cc.Class.extend({
    ctor: function (byte_buffer) {
        this.id= byte_buffer.getInt();
        this.type= byte_buffer.getByte();
        this.remainingTimeInSecond= byte_buffer.getLong();
        this.openTimeInSecond= byte_buffer.getLong();
        this._init_time_stamp = Date.now() / 1000
        
    },
    // todo: thêm các hàm
    onOpenNow: function (){
        testnetwork.connector.sendOpenChestRequest(this);
        // if (Date.now() / 1000 - this._init_time_stamp + 1 > this.remainingTimeInSecond){
        //     testnetwork.sendOpenChestRequest(this);
        // } else {
        //     cc.log("not time!")
        // }
    }
})