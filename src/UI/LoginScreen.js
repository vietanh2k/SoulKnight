
var SignInScreen = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();

        var mainscene = ccs.load(res.LoginScene_json, "").node;
        this.addChild(mainscene);
        this.login_button = mainscene.getChildByName("LogIn");
        this.textField  = mainscene.getChildByName("IdField");
        this.notification = mainscene.getChildByName("Notification");
        // this.notification.visible = false;
        this.notification.setOpacity(0);
        this.login_button.addClickEventListener(this.onSelectLogin.bind(this));
        return true;
    },
    onSelectLogin:function(sender)
    {
        // this.lblLog.setString("Start Connect!");
        // gv.gameClient._userId = this.textField.getString()
        cc.log("current test is :" + this.textField.getString())
        cc.log("sendLoginRequest");
        try{
            gv.gameClient._userId = parseInt(this.textField.getString());
            if(!isNaN(gv.gameClient._userId)){
                gv.gameClient.connect();
            } else {
                this.OnError("User_ID_must_be_number!");
            }

        } catch (e){
            this.OnError("User_ID_must_be_number!");
        }

    },
    onConnectSuccess: function (){

    },
    onUserInfo: function (){
        cc.log("Loaded user info: " + JSON.stringify(sharePlayerInfo));
        this.notification.setOpacity(255);
        this.notification.setString(JSON.stringify(sharePlayerInfo));
        this.notification.runAction(cc.FadeOut.create(3.0));
    },
    onFinishLogin: function (){

    },
    OnError: function (error){
        this.notification.setOpacity(255);
        this.notification.setString(error);
        this.notification.runAction(cc.FadeOut.create(3.0));
    }
});

var SignInScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SignInScreen();
        this.addChild(layer);
    }
});

