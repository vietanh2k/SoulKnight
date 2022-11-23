var _TW_BULLET = _TW_BULLET||[]
var TWizardBullet = Bullet.extend({
    name:'wizard',
    concept:"bullet",
    ctor: function (target, speed, damage, radius, position) {
        this._super(res.Wizard_Bullet);
        this.reset(target, speed, damage, radius, position)
        this.fx = new sp.SkeletonAnimation('res/tower/fx/tower_'+this.name+ '_fx.json',
            'res/tower/fx/tower_'+this.name+ '_fx.atlas', true, 0.1);

        this.fx.setAnimation(0, 'attack_1', true);

        this.addChild(this.fx);
        // this.fx.visible = false;


    },
    reset: function (target, speed, damage, radius, position){
        this.target = target
        this.speed = speed
        this.damage = damage
        this.radius = radius
        this.isDestroy = false;
        this.position = position
        this.active = true
        this._lastLoc = null
        this.activate=true
    },


    explose: function (playerState, pos) {
        const map = playerState.getMap();
        let objectList = map.getObjectInRange(pos, this.getRadius());
        for (let object of objectList) {
            if (this.canAttack(object)) {
                object.health -= this.getDamage();
            }
        }
        this.isDestroy = true;

        this.fx.setAnimation(0, 'hit_target_eff', false);
        this.active = false;
        this.visible = false;
    }
})

TWizardBullet.prototype.getOrCreate = function (target, speed, damage, radius, position){
    var free_bullet = null;
    _TW_BULLET.forEach(e=> {
        if(e.active=false){
            free_bullet = e;
            free_bullet.reset(target, speed, damage, radius, position);
        }
    })
    if(free_bullet==null){
        free_bullet = new TWizardBullet(target, speed, damage, radius, position)
        _TW_BULLET.push(free_bullet)
    }
    return free_bullet
}



