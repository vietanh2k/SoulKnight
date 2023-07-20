var SmallMap = cc.Layer.extend({


    ctor: function() {
        this._super();
        this.setCascadeOpacityEnabled(false);
        this.opacity = 80;
        this.curMap = null;
        // this.setAnchorPoint(0,0)
        // this.scale = 7




    },

    updateMap: function() {
        this.removeAllChildren();
        for(var i =0; i< ChapterMap.length; i++){
            for(var j =0; j< ChapterMap.length; j++) {
                let icon = null;
                if(ChapterMap[i][j] === GAME_CONFIG.HOME_STATE){
                    icon = this.getHomeIcon();
                }else if(ChapterMap[i][j] === GAME_CONFIG.DES_STATE){
                    icon = this.getDesIcon();
                }else if(ChapterMap[i][j] === GAME_CONFIG.ENEMY_STATE){
                    icon = this.getEnemyIcon();
                }else if(ChapterMap[i][j] === GAME_CONFIG.CHEST_STATE){
                    icon = this.getChestIcon();
                }
                else if(ChapterMap[i][j] === GAME_CONFIG.SPECIAL_STATE){
                    icon = this.getSpecialIcon();
                }
                if(icon != null){
                    let tag = i+"-"+j;
                    icon.setPosition(icon.width*i*1.1, icon.width*j*1.1);
                    icon.visible = false;
                    icon.retain()
                    this.addChild(icon,-1, tag);
                }
            }
        }


        this.curMap = new cc.Sprite(res.mapPick);
        this.addChild(this.curMap, 2);
        this.curMap.retain();
    },

    getHomeIcon: function() {
        let icon = new cc.Sprite(res.iconMapGrey);
        let icon2 = new cc.Sprite(res.iconHome);
        icon2.setPosition(icon.width/2, icon.height/2*1.05);
        let icon3 = new cc.Sprite(res.iconMap);
        icon3.setPosition(icon.width/2, icon.height/2);
        icon3.visible = false;
        icon.addChild(icon3, 0, 3);
        icon.addChild(icon2);
        return icon;
    },

    getEnemyIcon: function() {
        let icon = new cc.Sprite(res.iconMapGrey);
        let icon3 = new cc.Sprite(res.iconMap);
        icon3.setPosition(icon.width/2, icon.height/2);
        icon3.visible = false;
        icon.addChild(icon3, 1 , 3);
        // let icon2 = new cc.Sprite(res.iconHome);
        // icon2.setPosition(icon.width/2, icon.height/2*1.1);
        // icon.addChild(icon2);
        return icon;
    },

    getSpecialIcon: function() {
        let icon = new cc.Sprite(res.iconMapGrey);
        let icon2 = new cc.Sprite(res.iconSpecial);
        icon2.setPosition(icon.width/2, icon.height/2*1.05);
        let icon3 = new cc.Sprite(res.iconMap);
        icon3.setPosition(icon.width/2, icon.height/2);
        icon3.visible = false;
        icon.addChild(icon3, 0 , 3);
        icon.addChild(icon2);
        return icon;
    },

    getChestIcon: function() {
        let icon = new cc.Sprite(res.iconMapGrey);
        let icon2 = new cc.Sprite(res.iconChest);
        icon2.setPosition(icon.width/2, icon.height/2*1.05);
        let icon3 = new cc.Sprite(res.iconMap);
        icon3.setPosition(icon.width/2, icon.height/2);
        icon3.visible = false;
        icon.addChild(icon3, 0 , 3);
        icon.addChild(icon2);
        return icon;
    },

    getDesIcon: function() {
        let icon = new cc.Sprite(res.iconMapGrey);
        let icon3 = new cc.Sprite(res.iconMap);
        icon3.setPosition(icon.width/2, icon.height/2);
        icon3.visible = false;
        icon.addChild(icon3, 0 , 3);

        let icon2 = new cc.Sprite(res.iconDes);
        icon2.setPosition(icon.width/2, icon.height/2);
        icon.addChild(icon2);
        return icon;
    },

    updatePos: function() {
        let x = CurMap[0];
        let y = CurMap[1];
        let tag = x+"-"+y;
        if(this.getChildByName(tag)) {
            this.getChildByName(tag).visible = true;
            this.getChildByName(tag).getChildByTag(3).visible = true;
            // let pos = this.getChildByName(tag).getPosition();

        }

        this.setPosition(-10-(x-4)*20*1.1,80-20*y*1.1)

        this.curMap.setPosition(this.curMap.width*(x+0.063)*0.83, this.curMap.width*y*0.835);
    },

    showNewMap: function(dx, dy) {
        let tag = dx+"-"+dy;
        if(this.getChildByName(tag)) {
            this.getChildByName(tag).visible = true;
        }

    },


});
