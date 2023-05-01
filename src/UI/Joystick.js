var Joystick = cc.Sprite.extend({
    direction: null,
    radius: 0,
    touchId: null,
    gol: null,

    ctor: function() {
        this._super(res.gold);
        this.setScale(1.7)
        this.radius = this.width / 2;
        this.direction = cc.p(0, 0);
        this.touchId = null;
        this.gol = new cc.Sprite(res.gold);
        this.pos = cc.p(this.width/2, this.height/2)
        this.gol.setPosition(this.pos)
        this.gol.setScale(0.5)
        this.addChild(this.gol);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
            onTouchCancelled: this.onTouchCancelled.bind(this)
        }, this);
    },

    onTouchBegan: function(touch, event) {
        var touchPos = touch.getLocation();
        if (cc.pDistance(touchPos, this.getPosition()) <= this.radius) {
            this.touchId = touch.getID();
            getNumDameUI(5, cc.p(200, 120))
            return true;
        }
        return false;
    },

    onTouchMoved: function(touch, event) {
        if (touch.getID() === this.touchId) {
            var touchPos = touch.getLocation();
            var angle = cc.pToAngle(cc.pSub(touchPos, this.getPosition()));
            var dir = cc.p(Math.cos(angle), Math.sin(angle));
            var mul = Math.min(1, cc.pDistance(touchPos, this.getPosition())/this.radius/1.7)
            this.direction = cc.pMult(dir, mul);
            var a = cc.pMult(this.direction, this.radius);
            this.gol.setPosition(cc.pAdd(this.pos, a))
        }
    },

    onTouchEnded: function(touch, event) {
        if (touch.getID() === this.touchId) {
            this.direction = cc.p(0, 0);
            this.gol.setPosition(this.pos)
            this.touchId = null;
        }
    },

    onTouchCancelled: function(touch, event) {
        this.onTouchEnded(touch, event);
    }
});