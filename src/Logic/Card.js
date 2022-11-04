var Card = cc.Class.extend({
    ctor: function(byte_buffer) {
        this.id= byte_buffer.getInt();
        this.name= byte_buffer.getString();
        this.type= byte_buffer.getByte();
        this.level= byte_buffer.getInt();
        this.quantity= byte_buffer.getInt();
        this.attackSpeed= byte_buffer.getFloat();
        this.attackRange= byte_buffer.getFloat();
    }
})