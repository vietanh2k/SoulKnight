
var gv = gv || {};

var WIDTHSIZE = 640;
var HEIGHTSIZE = 1136;
var CELLWIDTH = 80;
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
        var ratio = frameSize.height/frameSize.width;
        if(ratio < 1.875){
            HEIGHTSIZE = frameSize.height
            WIDTHSIZE = HEIGHTSIZE/1.875
        }else{
            WIDTHSIZE = frameSize.width
            HEIGHTSIZE = WIDTHSIZE*1.875

        }
        CELLWIDTH = WIDTHSIZE/8
        cc.view.setDesignResolutionSize(WIDTHSIZE,HEIGHTSIZE, cc.ResolutionPolicy.FIXED_HEIGHT);

        // The game will be resized when browser size change
        cc.view.resizeWithBrowserSize(true);
        //socket
        gv.gameClient = new GameClient();
        gv.poolObjects = new PoolObject();
        //modules
        testnetwork.connector = new testnetwork.Connector(gv.gameClient);

        fr.view(SignInScreen);
    }, this);
};
cc.game.run();