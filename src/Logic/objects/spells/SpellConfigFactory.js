const InitializerWithMonsterId = function(initializer, id) {
    this.initializer = initializer;
    this.id = id;
}

const SpellConfigFactory = cc.Class.extend({
    stat: {},
    normalMonsterNames: [],
    bossNames: [],

    getMonster: function (ty) {
        return this.stat[].initializer(playerState);
    },

    addSpellConfigByLevel: function (typeCard) {
        return this.stat[].initializer(playerState);
    }

})

MonsterFactory.prototype.addSpellInitializer = function (typeCard) {
    MonsterFactory.prototype.initializers[typeCard] = new InitializerWithMonsterId(initializer, id);

    //if (isBoss === true) {
    //    MonsterFactory.prototype.bossNames.push(name);
    //} else {
    MonsterFactory.prototype.normalMonsterNames.push(typeCard);
    //}
}