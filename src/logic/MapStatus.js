
var MapStatus = cc.Class.extend({
    ctor:function () {
        this._map = null;
        this.ojView = null;
        this.char = null;
        this.wp1 = null;
        this.wp2 = null;
        this.mapW = null;
        this.mapH = null;
    },

    updateStatus: function (_map, wp1, wp2, mapW, mapH) {
        this._map = _map;
        this.wp1 = wp1;
        this.wp2 = wp2;
        this.mapW = mapW;
        this.mapH = mapH;
    },

    updateStatus2: function (_map, object, mapW, mapH) {
        this._map = _map;
        this.ojView = object;
        this.mapW = mapW;
        this.mapH = mapH;
    },

    getEnemyColisionInMap: function (p0, p1) {

    },

    getBlockColisionInMap: function (p00, p11) {

    },

    getBlockInMap: function (p0, p1) {

    },

    getClosestEnemy: function (disLogic) {

    },



    updateMap: function (map) {

    },

    addChar: function (char) {

    },

    addBullet: function (bullet) {

    },

    addItem: function (item) {

    },

    addEnemy: function (enemy) {

    },

    update:function (dt) {

    },

    updateItem:function (dt) {

    },

    updateBullet:function (dt) {

    },

    updateChar:function (dt) {

    },

    updateEnemy:function (dt) {

    },

    renderBullet: function () {

    },

    renderChar: function () {

    },


});
