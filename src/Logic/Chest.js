var Chest  = cc.Class.extend({
    ctor: function (byte_buffer) {
        this.id= byte_buffer.getInt();
        this.type= byte_buffer.getByte();
        this.remainingTimeInSecond= byte_buffer.getInt();
        this.openTimeInSecond= byte_buffer.getInt();
        
    }

})