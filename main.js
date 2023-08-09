var gv = gv || {};

var WIDTHSIZE = 640;
var HEIGHTSIZE = 1136;
var CELLWIDTH = 80;
var DESIGN_RESOLUTION_WIDTH = 640;
var DESIGN_RESOLUTION_HEIGHT = 1136;
cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));
    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(true);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    jsb.fileUtils.addSearchPath(fr.NativeService.getFolderUpdateAssets(), true);
    jsb.fileUtils.addSearchPath(fr.NativeService.getFolderUpdateAssets() + "/res", true);
    cc.loader.resPath = "res";
    cc.LoaderScene.preload(g_resources, function () {
        //hide fps
        cc.director.setDisplayStats(true);
        // Setup the resolution policy and design resolution size
        var frameSize = cc.view.getFrameSize();
        cc.director.setDisplayStats(true);
        // Setup the resolution policy and design resolution size
        var designSize = cc.size(1136, 640); // Kích thước màn hình thiết kế của game
        var screenSize = cc.view.getFrameSize(); // Kích thước thực tế của màn hình

        if (screenSize.width / screenSize.height > designSize.width / designSize.height) {
            var ratio = screenSize.height / designSize.height;
            cc.view.setDesignResolutionSize(screenSize.width / ratio, designSize.height, cc.ResolutionPolicy.SHOW_ALL);
        } else {
            var ratio = screenSize.width / designSize.width;
            cc.view.setDesignResolutionSize(designSize.width, screenSize.height / ratio, cc.ResolutionPolicy.SHOW_ALL);
        }
        winSize = cc.director.getWinSize();
        CELL_SIZE_UI = Math.round(winSize.height/12);
        Utils.loadMapConfig();
        // cc.director.setDisplayStats(false);

        // The game will be resized when browser size change
        cc.view.resizeWithBrowserSize(true);
        //socket
        // gv.gameClient = new GameClient();
        // gv.poolObjects = new PoolObject();
        // //modules
        // testnetwork.connector = new testnetwork.Connector(gv.gameClient);
        //SignInScreen
        fr.view_with_args(LobbyUI, true);
    }, this);
};
cc.game.run();