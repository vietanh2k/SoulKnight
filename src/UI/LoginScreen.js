
var SignInScreen = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        var mainscene = ccs.load(res.LoginScene_json, "").node;
        this.addChild(mainscene);
        this.login_button = mainscene.getChildByName("LogIn");
        this.textField  = mainscene.getChildByName("IdField");
        this.login_button.addClickEventListener(this.onSelectLogin.bind(this));

        return true;
    },
    onSelectLogin:function(sender)
    {
        // this.lblLog.setString("Start Connect!");
        gv.gameClient._userName = this.textField.getString()
        cc.log("current test is :" + this.textField.getString())
        gv.gameClient.connect();
    },
    onConnectSuccess: function (){

    },
    onUserInfo: function (){
        cc.log("Loaded user info: " + JSON.stringify(sharePlayerInfo));
    },
    onFinishLogin: function (){

    }
});

var SignInScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SignInScreen();
        this.addChild(layer);
    }
});

