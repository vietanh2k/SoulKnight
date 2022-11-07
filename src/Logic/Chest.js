var Chest  = cc.Class.extend({
    ctor: function (byte_buffer) {
        this.id= byte_buffer.getInt();
        this.type= byte_buffer.getByte();
        this.remainingTimeInSecond= byte_buffer.getLong();
        this.openTimeInSecond= byte_buffer.getLong();
        
    }
    // todo: thêm các hàm

})