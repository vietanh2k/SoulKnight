
var TWizard = Tower.extend({
    ctor: function (map) {
        this._super(map)
        if(TWizard.CONFIG == undefined){
            TWizard.CONFIG = Tower.readConfig()["1"]
        }

    },
    getConfig: function (){
        return TWizard.CONFIG;
    },
    getNewBullet: function(object) {
    var speed = this.getConfig()["stat"][this.getLevel()]["bulletSpeed"],
        radius = this.getConfig()["stat"][this.getLevel()]["bulletRadius"],
        damage = this.getConfig()["stat"][this.getLevel()]["damage"];
    return new StraightBullet(speed, damage, radius, new Vec2(object.position.x,object.position.y));
}
})