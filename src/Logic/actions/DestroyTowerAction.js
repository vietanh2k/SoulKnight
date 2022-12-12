const DestroyTowerAction = cc.Class.extend({
    ctor: function (x, y, uid) {
        this.x = x;
        this.y = y;
        this.uid = uid;
    },

    writeTo: function (pkg) {
        pkg.putInt(this.x);
        pkg.putInt(this.y);
        pkg.putInt(this.uid);
        cc.log("DestroyTowerAction " + this.uid);
    },

    getActionCode: function () {
        return ACTION_CODE.DESTROY_TOWER_ACTION;
    },

    getActionDataSize: function () {
        return 4 + 4 + 4;
    },

    activate: function (gameStateManager) {
        if (this.uid === gv.gameClient._userId ) {
            let tower = GameStateManagerInstance.playerA.getMap().getTowerAtPosition(new cc.p(this.x, this.y));
            if (tower === undefined) {
                return false;
            }
            tower.destroy();
            GameUI.instance.removeCurrentTowerActionsUI();
        } else {
            let tower = GameStateManagerInstance.playerB.getMap().getTowerAtPosition(new cc.p(this.x, this.y));
            if (tower === undefined) {
                return false;
            }
            tower.destroy();
        }
    }
});

DestroyTowerAction.deserializer = function (pkg) {
    let tmp = []
    const x = pkg.getInt(), y = pkg.getInt(), uid = pkg.getInt();
    tmp.push(x)
    tmp.push(y)
    tmp.push(uid)
    return tmp
};

DestroyTowerAction.deserializerArr = function (pkgArr) {
    const x = pkgArr[0], y = pkgArr[1], uid = pkgArr[2];
    return new DestroyTowerAction( x, y, uid);
}