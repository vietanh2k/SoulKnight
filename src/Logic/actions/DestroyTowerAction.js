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
    const x = pkg.getInt(), y = pkg.getInt(), uid = pkg.getInt();
    return new DestroyTowerAction(x, y, uid);
};
