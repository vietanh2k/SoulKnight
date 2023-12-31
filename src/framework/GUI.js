var fr = fr||{}

fr.view = function(Screen, transitionTime)
{
    var layer = new Screen();
    layer.setName("screen");
    var scene = new cc.Scene();
    scene.addChild(layer);
    if(!transitionTime)
    {
        transitionTime = 1.2;
    }
    cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
};
fr.view_with_args = function(Screen, args, transitionTime)
{
    var layer = new Screen(args);
    layer.setName("screen");
    var scene = new cc.Scene();
    scene.addChild(layer);
    if(!transitionTime)
    {
        transitionTime = 1.2;
    }
    cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
};
fr.getCurrentScreen = function()
{
    return cc.director.getRunningScene().getChildByName("screen");
};
fr.viewSaveScene = function(layer, transitionTime)
{

    layer.setName("screen");
    var scene = new cc.Scene();
    scene.addChild(layer);
    if(!transitionTime)
    {
        transitionTime = 1.2;
    }
    cc.director.runScene(new cc.TransitionFade(transitionTime, scene));
};
