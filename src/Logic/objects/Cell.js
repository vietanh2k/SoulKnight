

var Cell = cc.Class.extend({
    hp: null,
    type: null,
    _battle: null,
    _position:null,
    _playerState:null,
    getObjectOn:null,
    ctor:function(arg, pos){
        this.type = arg
        this._position = pos

    },
    init:function () {


        // this.scheduleUpdate();

        return true;
    },
    //
    // addBuffUI:function (res) {
    //     var buff = new cc.Sprite(res)
    //     buff.setScale(1.01*this._battle.cellWidth/buff.getContentSize().height)
    //
    //     buff.setPosition(this._position)
    //     this._battle.addChild(buff)
    // },




    update:function (dt) {


    },






});


