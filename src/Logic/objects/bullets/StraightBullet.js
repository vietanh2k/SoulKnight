var _TW_BULLET = _TW_BULLET||[]
var TWizardBullet = Bullet.extend({
    name:'wizard',
    concept:"bullet",
    ctor: function (target, speed, damage, radius, position, explosion_fx, fromTower) {

        this._super(res.Wizard_Bullet, target, speed, damage, radius, position, fromTower);
        this.fx = explosion_fx;


    },

    playExplosionFx: function (){
        cc.log('playExplosionFx')
        if(this.fx !=null && this.fx!=undefined){
            cc.log('this.fx')
            this.fx.setPosition(this.x, this.y);
            var seq = cc.sequence(
                cc.callFunc(() => {this.fx.visible = true;}),
                cc.callFunc(() => this.fx.setAnimation(0, 'hit_target_eff', false))
                // cc.callFunc(() => GameUI.instance.removeChild(this))
            );
            this.runAction(seq);
        }
    },


    explose: function (playerState, pos) {
        const map = playerState.getMap();

        let objectList = map.getObjectInRange(pos, this.radius);
        for (let object of objectList) {
            if (this.canAttack(object)) {
                //object.health -= this.damage;
                object.takeDamage(playerState, this.damage, this.fromTower)
                object.hurtUI()
            }
        }
        this.isDestroy = true;
        this.active = false;
        this.visible = false;
        this.playExplosionFx();
        if (this.target && this.target.release) this.target.release()
    }
})


