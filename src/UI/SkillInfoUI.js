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

        let lbName = new ccui.Text(card.skill.name, asset.svnSupercellMagic_ttf, 30);
        lbName.attr({
            x: topDescriptionPanel.width / 2,
            y: topDescriptionPanel.height * 0.7,
        });
        lbName.enableOutline(cc.color(0, 0, 0));
        topDescriptionPanel.addChild(lbName);

        let lbDescription = new ccui.Text(card.skill.description, asset.svnAvoBold_ttf, 24);
        lbDescription.attr({
            x: topDescriptionPanel.width / 2,
            y: 0,
        });
        lbDescription.enableOutline(cc.color(0, 0, 0));
        topDescriptionPanel.addChild(lbDescription);

        // top panel
        let topPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 0, 453, 196.5));
        topPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4 + midPanelBackground.height * midPanelBackground.scale,
            scale: cf.WIDTH * 0.9 / topPanelBackground.width,
        });
        this.addChild(topPanelBackground, -1);

        let closeBtn = new ccui.Button(asset.panelBtnClose_png);
        closeBtn.attr({
            x: topPanelBackground.width * 0.935,
            y: topPanelBackground.height * 0.865,
            scale: topPanelBackground.width * 0.07 / closeBtn.width,
        });
        closeBtn.addClickEventListener(() => {
            this.parent.destroy(false);
        });
        topPanelBackground.addChild(closeBtn);

        let backBtn = new ccui.Button(asset.panelBtnBack_png);
        backBtn.attr({
            x: topPanelBackground.width * 0.065,
            y: topPanelBackground.height * 0.865,
            scale: topPanelBackground.width * 0.07 / backBtn.width,
        });
        backBtn.addClickEventListener(() => {
            this.parent.skillInfoUIIsActive = false;
            this.removeFromParent(true);
        });
        topPanelBackground.addChild(backBtn);

        let lbTitle = new ccui.Text('Kỹ Năng', asset.svnSupercellMagic_ttf, 30);
        lbTitle.attr({
            x: topPanelBackground.width / 2,
            y: topPanelBackground.height * 0.8,
        });
        lbTitle.enableOutline(cc.color(0, 0, 0));
        topPanelBackground.addChild(lbTitle);

        let iconSkill = new cc.Sprite(card.skill.texture);
        iconSkill.attr({
            x: topPanelBackground.width / 2,
            y: topPanelBackground.height * 0.4,
            scale: topPanelBackground.width * 0.2 / iconSkill.width,
        });
        topPanelBackground.addChild(iconSkill);

        if (card.evolution < 2) {
            let iconLock = new cc.Sprite(asset.iconSkillLocked_png);
            iconLock.attr({
                x: topPanelBackground.width / 2,
                y: topPanelBackground.height * 0.4,
                scale: topPanelBackground.width * 0.2 / iconLock.width,
            });
            topPanelBackground.addChild(iconLock);
        }

        let lbInstruct =  new ccui.Text('Kích hoạt khi trụ đạt tiến hóa cấp III', asset.svnAvoBold_ttf, 16);
        lbInstruct.attr({
            x: topPanelBackground.width / 2,
            y: topPanelBackground.height * 0.1,
        });
        lbInstruct.enableOutline(cc.color(0, 0, 0));
        topPanelBackground.addChild(lbInstruct);

        // bottom panel
        let botPanelBackground = new cc.Sprite(asset.panelBackground_png, cc.rect(0, 196.5, 453, 196.5));
        botPanelBackground.attr({
            x: cf.WIDTH / 2,
            y: cf.HEIGHT * 0.4 - midPanelBackground.height * midPanelBackground.scale * 0.75,
            scale: cf.WIDTH * 0.9 / botPanelBackground.width,
        });
        this.addChild(botPanelBackground, -1);

        for (let i = 0; i < card.skill.stats.length; i++) {
            let row = Math.floor(i / 2);
            let column = i - row * 2;
            let newStatSlot = new StatSlot(card.skill.stats[i].texture, card.skill.stats[i].textAttribute, card.skill.stats[i].textStat, undefined);
            newStatSlot.attr({
                x: botPanelBackground.width * (0.3 + 0.4 * column),
                y: botPanelBackground.height * (0.6 - 0.4 * row),
                scale: botPanelBackground.width * 0.35 / newStatSlot.width,
            });
            botPanelBackground.addChild(newStatSlot);
        }

        if (card.evolution < 2) {
            let lbUnlockInstruct = new ccui.Text('Kỹ năng mở khóa cấp 7', asset.svnAvoBold_ttf, 16);
            lbUnlockInstruct.attr({
                x: botPanelBackground.width / 2,
                y: botPanelBackground.height * 0.3,
            });
            lbUnlockInstruct.enableOutline(cc.color(0, 0, 0));
            botPanelBackground.addChild(lbUnlockInstruct);
        }
    },
});
