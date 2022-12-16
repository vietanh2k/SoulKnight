const InitializerWithMonsterId = function(initializer, id) {
    this.initializer = initializer;
    this.id = id;
}

const MonsterFactory = cc.Class.extend({
    initializers: {},
    normalMonsterNames: [],
    bossNames: [],

    getMonster: function (playerState, id) {
        return this.initializers[this.normalMonsterNames[id]].initializer(playerState);
    }
})

MonsterFactory.prototype.addMonsterInitializer = function (id, name, isBoss, initializer) {
    MonsterFactory.prototype.initializers[name] = new InitializerWithMonsterId(initializer, id);

    //if (isBoss === true) {
    //    MonsterFactory.prototype.bossNames.push(name);
    //} else {
        MonsterFactory.prototype.normalMonsterNames.push(name);
    //}
}