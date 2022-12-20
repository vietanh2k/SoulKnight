let GameStateManagerInstance = null
/*
lưu list action để chờ activate
 */
let ActionListInstance = []
let indAction = 0
let FrameMaxForUpdate = 15
let PreDate = 0;
/*
frame mà client có thể delay với server
Nếu delay nhiều hơn thì tua
 */
let FrameDelayPosible = 15;
const FrameDelayMax = 45;
const FrameDelayMin = 15;

var GameStateManager = cc.Class.extend({
    playerA: null,
    playerB: null,
    cellWidth: null,
    _timer: null,
    canTouchNewWave: null,
    curWave: null,
    winner: null,


    UPDATE_TYPE_NORMAL: 0,
    UPDATE_TYPE_NO_UPDATE: 1,
    UPDATE_TYPE_UPDATE_TO_FRAME_N: 2,


    ctor:function (pkg) {
        GameStateManagerInstance = this;
        ActionListInstance = [];
        indAction = 0;
        FrameMaxForUpdate = 15;
        PreDate = Date.now();
        this.spellConfig = {}
        this.init();
        this.playerA = new PlayerState(1, this)
        this.playerB = new PlayerState(2, this)
        this.monsterFactory = new MonsterFactory()
        this.xid = 1
        this.readFrom(pkg)
        this._timer = new Timer(this)
        this.canTouchNewWave = false
        this.curWave = 0
        this.winner = null
        this.isLastWave = false
        this.dem = 0
        this.sumDt = 0;
        this.dt =  GAME_CONFIG.DEFAULT_DELTA_TIME
        this.frameCount = 0

        this.updateType = this.UPDATE_TYPE_NORMAL;
        this.updateToFrameN = 0;

        this.waveCount = 0;
        /*
        lay stat card theo lvl tu config
         */


    },
    init:function () {

        winSize = cc.director.getWinSize();
        let deck = sharePlayerInfo.deck;
        /*
        lấy stat cho các card spell trong deck
         */
        for (let i = 0; i < 8; i++) {
            if(deck[i].concept == 'potion'){
                this.addSpellConfig(deck[i].type)
            }
        }



        return true;
    },

    /*
    đọc map từ server gửi về
     */
    readFrom:function (pkg){
        var userId1 = pkg.getInt();
        if(userId1 == gv.gameClient._userId){
            this.playerA.readFrom(pkg);
            var userId2 = pkg.getInt();
            this.playerB.readFrom(pkg);
        }else{
            this.playerB.readFrom(pkg);
            var userId2 = pkg.getInt();
            this.playerA.readFrom(pkg);
        }

        Random.seed(pkg.getInt());
    },
    isClearWave: function () {
        /*if(this.playerA._map.monsters.length == 0){
            this.canTouchNewWave = true
        }*/
        if(this.playerA.isClearWave() && !this.isMaxWave()){
            this.canTouchNewWave = true;
        }
    },
    isMaxWave:function (){
        if(this.curWave < GAME_CONFIG.MAX_WAVE){
            return false;
        }
        return true;
    },
    updateStateNewWave:function (){
        this.curWave += 1;
        this.canTouchNewWave = false;
    },
    checkWinner:function (){
        if(this.curWave >= GAME_CONFIG.MAX_WAVE && this.playerA.isClearWave() && this.playerB.isClearWave()){
            if(this.playerA.health > this.playerB.health){
                this.winner = 1;
            }else if(this.playerB.health > this.playerA.health){
                this.winner = 2;
            }else{
                this.winner = 0;
            }
            return true;
        }

        if (!(this.playerA.health <= 0 || this.playerB.health <= 0)) {
            return false;
        }

        if ((this.playerA.health <= 0 && this.playerB.health <= 0) || this.playerA.health === this.playerB.health) {
            this.winner = 0;
            return true;
        }

        if(this.playerA.health <= 0){
            this.winner = 2;
            return true;
        }

        if(this.playerB.health <= 0){
            this.winner = 1;
            return true;
        }

        return false;
    },

    frameUpdate: function () {
        /*
        check da end game chua
         */
        this.isClearWave();
        let isEnd = this.checkWinner();;
        if(isEnd){
            cc.log('=============================================================');
            cc.log("Tong vi tri monster = "+this.playerA.getCountPosition().x+ " "+ this.playerA.getCountPosition().y);
            cc.log("Tong HP monster = "+this.playerA.getCountHP());
            cc.log("Tong Frame destroy monster = "+this.playerA.getCountDestroyFrame());
            cc.log('KET THUC TAI FRAME = '+this.frameCount);
            cc.log('=============================================================');
            return;
        }

        /*
            Nếu frame hiện tại > MaxFrame SV gửi về thì ko update
        */
        // cc.log(this.frameCount +' fam '+FrameMaxForUpdate)
        if (this.frameCount >= FrameMaxForUpdate) {
            return;
        }




        /*
         Nếu frame hiện tại quá chậm so với SV thi tua nhanh
         */
        if(this.frameCount < FrameMaxForUpdate-FrameDelayPosible-10){
            for(var i= this.frameCount; i<=FrameMaxForUpdate-FrameDelayPosible; i++){
                this.frameUpdateNormal();
                cc.log('tuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
            }
        }

        this.frameUpdateNormal();

        if(this.frameCount % 300 == 0){
            this.playerA.countAllMonster();
        }

    },
    frameUpdateNormal: function () {
        if(indAction < ActionListInstance.length) {
            /*
            khi tới frame trigger action thì trigger
             */
            while (indAction < ActionListInstance.length && this.frameCount >= ActionListInstance[indAction][0] ){
                cc.log('=========TRIGER++++++');
                ACTION_DESERIALIZER_FROM_ARR[ActionListInstance[indAction][1]](ActionListInstance[indAction][2]).activate(GameStateManagerInstance);
                indAction++;
            }

        }

        this.playerA.update(this.dt);
        this.playerB.update(this.dt);
        this._timer.updateRealTime(this.dt);

        this.frameCount++;



        // if(indAction >0) {
        //     cc.log(this.frameCount + '  ' + ActionListInstance[indAction - 1][0] + '  ' + indAction)
        // }
    },

    update:function (ccDt){

        this.sumDt += ccDt;
        while (this.sumDt > this.dt) {
            this.frameUpdate();
            this.sumDt -= this.dt;
        }
    },

    getNextWaveMonstersId: function () {
        const monstersId = [];
        monstersId.push(0);
        monstersId.push(1);
        return monstersId;
    },

    activateNextWave: function (ui, monstersId) {
        for (let i = 0; i < monstersId.length; i++) {
            const m1 = this.monsterFactory.getMonster(this.playerA, monstersId[i]);
            this.playerA.addMonster(m1);
            m1.visible = false;
            ui.addChild(m1);

            const m2 = this.monsterFactory.getMonster(this.playerB, monstersId[i]);
            this.playerB.addMonster(m2);
            m2.visible = false;
            ui.addChild(m2);
        }
    },

    getCurWave: function () {
        return this.curWave;
    },

    addSpellConfig: function (typeCard) {
        const cardInfor = sharePlayerInfo.collection.find(element => element.type === typeCard);
        const lvl =cardInfor.level;
        const bac = Math.floor((lvl-1)/5 +1);
        const radius = cf.POTION2.radius[bac];
        let value = 0;
        switch (typeCard) {
            case 0:
                value = cf.POTION2.potion[SPELL_ID.FIREBALL].statPerLevel.damage[lvl];
                this.spellConfig[0] = [radius, value];
                break;
            case 1:
                value = cf.POTION2.potion[SPELL_ID.FROZEN].statPerLevel.damage[lvl];
                this.spellConfig[1] = [radius, value];
                break;
            case 2:
                value = cf.POTION2.potion[SPELL_ID.HEAL].statPerLevel.healthUp[lvl];
                this.spellConfig[2] = [radius, value];
                break;
            case 3:
                value = cf.POTION2.potion[SPELL_ID.SPEED_UP].statPerLevel.duration[lvl];
                this.spellConfig[3] = [radius, value];
                break;
            default:
                cc.log('Card typeCard \"' + typeCard + '\" not found in config.')
                break;
        }
        cc.log('add spell = '+ radius+ ' ' + value)
    },
    getSpellConfig: function (typeCard) {
        return this.spellConfig[typeCard];

    },
});
