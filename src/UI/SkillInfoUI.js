// this.parent: CardInfoUI
var SkillInfoUI = cc.Layer.extend({

    ctor: function (card) {
        this._super();

        this.card = card;

        Utils.addScaleAnimation(this);

        // middle panel
        let midPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 98.25, 453, 196.5));
        midPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4,
            scale: cf.WIDTH * 0.9 / midPanelBackground.width,
        });
        this.addChild(midPanelBackground);

        // top panel
        let topPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 0, 453, 196.5));
        topPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4 + midPanelBackground.height * midPanelBackground.scale,
            scale: cf.WIDTH * 0.9 / topPanelBackground.width,
        });
        this.addChild(topPanelBackground);

        let closeBtn = new ccui.Button(asset.panelBtnClose_png);
        closeBtn.attr({
            x: topPanelBackground.width * 0.935,
            y: topPanelBackground.height * 0.865,
            scale: topPanelBackground.width * 0.07 / closeBtn.width,
        });
        closeBtn.addClickEventListener(() => {
            this.parent.destroy(false);
        });
        topPanelBackground.addChild(closeBtn, 0);

        let undoBtn = new ccui.Button(asset.panelBtnClose_png);
        undoBtn.attr({
            x: topPanelBackground.width * 0.065,
            y: topPanelBackground.height * 0.865,
            scale: topPanelBackground.width * 0.07 / undoBtn.width,
        });
        undoBtn.addClickEventListener(() => {
            this.parent.skillInfoUIIsActive = false;
            this.removeFromParent(true);
        });
        topPanelBackground.addChild(undoBtn, 0);

        let lbTitle = new ccui.Text('Kỹ Năng', asset.svnSupercellMagic_ttf, 30);
        lbTitle.attr({
            x: topPanelBackground.width / 2,
            y: topPanelBackground.height * 0.8,
        });
        lbTitle.enableOutline(cc.color(0, 0, 0));
        topPanelBackground.addChild(lbTitle);

        // bottom panel
        let botPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 196.5, 453, 196.5));
        botPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4 - midPanelBackground.height * midPanelBackground.scale * 0.75,
            scale: cf.WIDTH * 0.9 / botPanelBackground.width,
        });
        this.addChild(botPanelBackground);

        let topDescriptionPanel = cc.Sprite(asset.panelFront_png, cc.rect(0, 0, 424, 114));
        topDescriptionPanel.attr({
            anchorY: 0,
            x: midPanelBackground.width / 2,
            y: midPanelBackground.height / 2,
            scale: midPanelBackground.height * 0.5 / topDescriptionPanel.height,
        });
        midPanelBackground.addChild(topDescriptionPanel, 1);

        let botDescriptionPanel = cc.Sprite(asset.panelFront_png, cc.rect(0, 228, 424, 114));
        botDescriptionPanel.attr({
            anchorY: 1,
            x: midPanelBackground.width / 2,
            y: midPanelBackground.height / 2,
            scale: midPanelBackground.height * 0.5 / botDescriptionPanel.height,
        });
        midPanelBackground.addChild(botDescriptionPanel);
    },
});
