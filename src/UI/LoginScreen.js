
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
    /**
     * Bắt sự kiện nút login được nhấn
     * Nếu ID là số hợp lệ sẽ tiến hành connect và biến toàn cục sharePlayerInfo sẽ được gán giá trị
     * Ngược lại sẽ thông báo lỗi và không connect nào được thiết lập (kể cả hand shake)
     *
     */
    onSelectLogin:function(sender)
    {
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
    /**
     * Bắt sự kiện User infor được gửi về (sharePlayerInfo được gán giá trị)
     * Hiện tại mới chỉ hiển thị lên JSON info này
     *
     */
    onUserInfo: function (){
        // todo: direct to mainGUI
        cc.log("Loaded user info: " + JSON.stringify(sharePlayerInfo));
        this.notification.setOpacity(255);
        this.notification.setString(JSON.stringify(sharePlayerInfo));
        this.notification.runAction(cc.FadeOut.create(3.0));
    },
    onFinishLogin: function (){

    },
    /**
     * Thông báo lỗi lên màn hình bằng 1 dòng animation kéo dài 3 giây
     * @param {string}  error: nội dung thông báo
     * */
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

