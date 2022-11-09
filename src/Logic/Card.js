var Card = cc.Class.extend({
    ctor: function (id, name, type, level, quantity, attackSpeed, attackRange) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.level = level;
        this.quantity = quantity;
        this.attackSpeed = attackSpeed;
        this.attackRange = attackRange
    },
});
