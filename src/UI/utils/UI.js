const getNumDameUI = function (dame, posUI) {
    var dameUI = new ccui.Text(dame, res.font_normal, 20)
    dameUI.setColor(cc.color(255,0,0,0));
    dameUI.setPosition(posUI)
    dameUI.opacity = 50;
    // cc.MoveTo(0.35, p), cc.delayTime(0.45+r2), cc.MoveTo(0.45,des),cc.fadeOut(0),cc.callFunc(()=> this.updateLabel(goldForOne)))
    // cc.sequence(cc.scaleBy(0.15, 5), cc.scaleBy(0.10,0.94),cc.scaleBy(0.08,1.06), cc.scaleBy(0.07,0.96),cc.scaleBy(0.05,1.04)))
    let seq = cc.sequence(cc.MoveTo(0.15, new cc.p(posUI.x, posUI.y+30)),cc.delayTime(0.1), cc.scaleBy(0.25, 1.05))
    let seq2 = cc.sequence(cc.fadeIn(0.15),cc.delayTime(0.1), cc.fadeOut(0.25))
    let seq3 = cc.sequence(cc.delayTime(0.25), cc.MoveTo(0.25, new cc.p(posUI.x, posUI.y+55)), cc.callFunc(()=> dameUI.removeFromParent(true)))
    dameUI.runAction(seq)
    dameUI.runAction(seq2)
    dameUI.runAction(seq3)
    BackgroundLayerInstance.addChild(dameUI, 99999,999)
        return true;
};