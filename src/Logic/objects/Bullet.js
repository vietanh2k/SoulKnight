var Bullet = ActiveGameObject.extend({

    abstract float getSpeed();
    abstract float getDamage();
    abstract float getRadius();
    abstract Vec2 getTargetPosition();
    abstract boolean canAttack(ActiveGameObject object);

    @Override
    public void update(PlayerState playerState, float dt) {
    if(this.active){
    if(euclid_distance(position, getTargetPosition())> getSpeed()){
    Vec2 direction = getTargetPosition().sub(position).l2norm();
    this.position.x += direction.x * getSpeed();
    this.position.y += direction.y * getSpeed();
}
else {
    explose(playerState);
    active = false;
}
}
// TODO Auto-generated method stub

}

explose(PlayerState playerState){
    Map map = playerState.getMap();
    List<ActiveGameObject> objectList = map.getObjectInRange(getTargetPosition(), getRadius());
    for (ActiveGameObject object: objectList ) {
        if(canAttack(object)){
            object.health -= getDamage();
        }
    }
}


})
