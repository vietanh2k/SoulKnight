var SignInScreen = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();

        var mainscene = ccs.load(res.LoginScene_json, "").node;
        this.addChild(mainscene);
        this.login_button = mainscene.getChildByName("LogIn");

        let lbLogIn = ccui.Text('ĐĂNG NHẬP', asset.svnSupercellMagic_ttf, 32);
        lbLogIn.attr({
            x: this.login_button.width / 2,
            y: this.login_button.height * 0.63,
            color: cc.color(152, 58, 12),
        });
        this.login_button.addChild(lbLogIn);

        this.textField = mainscene.getChildByName("IdField");
        this.textField.setString(cc.sys.localStorage.getItem('userID'));
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
    onSelectLogin: function (sender) {
        cc.log("current test is :" + this.textField.getString())
        cc.sys.localStorage.setItem('userID', this.textField.getString());
        cc.log("sendLoginRequest");

        gv.gameClient._userId = parseInt(this.textField.getString());
        if (this.textField.getString() === '') {
            Utils.addToastToRunningScene('ID không được bỏ trống!');
        } else if (!isNaN(gv.gameClient._userId)) {
            gv.gameClient.connect();
        } else {
            Utils.addToastToRunningScene('ID chỉ bao gồm chữ số!');
        }
    },

    onConnectSuccess: function () {

    },
    /**
     * Bắt sự kiện User infor được gửi về (sharePlayerInfo được gán giá trị)
     * Hiện tại mới chỉ hiển thị lên JSON info này
     *
     */
    onUserInfo: function () {
        // gv.gameClient.sendBuyRequest()
        cc.log('on User Info')
        fr.view(LobbyScene)
        // let lobbyScene = new LobbyScene();
        // cc.director.runScene(new cc.TransitionFade(0.5, lobbyScene));
        // cc.log('Current time on client: ' + Date.now());
    },
    onFinishLogin: function () {

    },
});

var SignInScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new SignInScreen();
        this.addChild(layer);
    }
});

