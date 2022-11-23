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
        var ratio = frameSize.height/frameSize.width;
        if(ratio < 1.875){
            HEIGHTSIZE = DESIGN_RESOLUTION_HEIGHT
            WIDTHSIZE = HEIGHTSIZE/1.875
        }else{
            WIDTHSIZE = DESIGN_RESOLUTION_WIDTH*0.95
            HEIGHTSIZE = WIDTHSIZE*1.875
        }
        cc.log(frameSize.height)

        CELLWIDTH = WIDTHSIZE/8
        if(ratio < 1136/640){
            // DESIGN_RESOLUTION_HEIGHT = frameSize.height
            // DESIGN_RESOLUTION_WIDTH = DESIGN_RESOLUTION_HEIGHT/(1136/640)
            cc.view.setDesignResolutionSize(DESIGN_RESOLUTION_WIDTH,DESIGN_RESOLUTION_HEIGHT, cc.ResolutionPolicy.SHOW_ALL);
        }else {
            // DESIGN_RESOLUTION_WIDTH = frameSize.width
            // DESIGN_RESOLUTION_HEIGHT = DESIGN_RESOLUTION_WIDTH * (1136/640)
            cc.view.setDesignResolutionSize(DESIGN_RESOLUTION_WIDTH,DESIGN_RESOLUTION_HEIGHT, cc.ResolutionPolicy.SHOW_ALL);
        }
        cf.WIDTH = DESIGN_RESOLUTION_WIDTH;
        cf.HEIGHT = DESIGN_RESOLUTION_HEIGHT;

        Utils.loadCardConfig();


        // The game will be resized when browser size change
        cc.view.resizeWithBrowserSize(true);
        //socket
        gv.gameClient = new GameClient();
        gv.poolObjects = new PoolObject();
        //modules
        testnetwork.connector = new testnetwork.Connector(gv.gameClient);
        //SignInScreen
        fr.view(SignInScreen);
    }, this);
};
cc.game.run();