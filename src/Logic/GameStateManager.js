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
        FrameDelayPosible = 15;
        PreDate = Date.now();
        this.spellConfigA = {}
        this.spellConfigB = {}
        this.init();

        this.playerA = new PlayerState(1, this)
        this.playerB = new PlayerState(2, this)
        this.orderedPlayerA = null
        this.orderedPlayerB = null

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
        this.tes = 0
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
                this.addSpellConfigA(deck[i].type);
                cc.log("deck[1].type + "+deck[i].type)
            }
        }

        let deck2 = shareOpponentInfo.deck;
        cc.log('deack2 = '+deck2.length)
        /*
        lấy stat cho các card spell trong deck
         */
        for (let i = 0; i < 8; i++) {
            if(deck2[i].concept == 'potion'){
                this.addSpellConfigB(deck2[i].type);
                cc.log("deck[2].type+ "+deck2[i].type)
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

            this.orderedPlayerA = this.playerA
            this.orderedPlayerB = this.playerB
        }else{
            this.playerB.readFrom(pkg);
            var userId2 = pkg.getInt();
            this.playerA.readFrom(pkg);

            this.orderedPlayerA = this.playerB
            this.orderedPlayerB = this.playerA
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
            cc.log('=============================================================');
            cc.log("Tong vi tri monster = "+this.playerB.getCountPosition().x+ " "+ this.playerB.getCountPosition().y);
            cc.log("Tong HP monster = "+this.playerB.getCountHP());
            cc.log("Tong Frame destroy monster = "+this.playerB.getCountDestroyFrame());
            cc.log('KET THUC TAI FRAME = '+this.frameCount);
            cc.log('====== = '+this.tes);
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
            cc.log('tuaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa so frame = ' +(FrameMaxForUpdate-FrameDelayPosible - this.frameCount));
            for(var i= this.frameCount; i<=FrameMaxForUpdate-FrameDelayPosible; i++){
                this.frameUpdateNormal();

            }
        }

        this.frameUpdateNormal();



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

        this.orderedPlayerA.update(this.dt);
        this.orderedPlayerB.update(this.dt);
        this._timer.updateRealTime(this.dt);

        this.frameCount++;


        if(this.frameCount % 300 == 0){
            this.tes ++;
            this.playerA.countAllMonster();
            this.playerB.countAllMonster();
        }
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

    activateNextWaveForPlayer: function (ui, userId, monstersId) {
        const playerState = (userId === gv.gameClient._userId) ? this.playerA : this.playerB;
        playerState.activateNextWave(ui, this.monsterFactory, monstersId)

        if (this.curWave >= GAME_CONFIG.MAX_WAVE) {
            this.isLastWave = true
        }
    },

    getCurWave: function () {
        return this.curWave;
    },

    addSpellConfigA: function (typeCard) {
        const cardInfor = sharePlayerInfo.collection.find(element => element.type === typeCard);
        const lvl =cardInfor.level;
        const bac = Math.floor((lvl-1)/5 +1);
        const radius = cf.POTION2.radius[bac];
        let value = 0;
        switch (typeCard) {
            case 0:
                value = cf.POTION2.potion[SPELL_ID.FIREBALL].statPerLevel.damage[lvl];
                this.spellConfigA[0] = [radius, value];
                break;
            case 1:
                value = cf.POTION2.potion[SPELL_ID.FROZEN].statPerLevel.damage[lvl];
                this.spellConfigA[1] = [radius, value];
                break;
            case 2:
                value = cf.POTION2.potion[SPELL_ID.HEAL].statPerLevel.healthUp[lvl];
                this.spellConfigA[2] = [radius, value];
                break;
            case 3:
                value = cf.POTION2.potion[SPELL_ID.SPEED_UP].statPerLevel.duration[lvl];
                this.spellConfigA[3] = [radius, value];
                break;
            default:
                cc.log('Card typeCard \"' + typeCard + '\" not found in config.')
                break;
        }
        cc.log('add spell = '+ radius+ ' ' + value)
    },

    addSpellConfigB: function (typeCard) {
        const cardInfor = shareOpponentInfo.collection.find(element => element.type === typeCard);
        const lvl =cardInfor.level;
        const bac = Math.floor((lvl-1)/5 +1);
        const radius = cf.POTION2.radius[bac];
        let value = 0;
        switch (typeCard) {
            case 0:
                value = cf.POTION2.potion[SPELL_ID.FIREBALL].statPerLevel.damage[lvl];
                this.spellConfigB[0] = [radius, value];
                break;
            case 1:
                value = cf.POTION2.potion[SPELL_ID.FROZEN].statPerLevel.damage[lvl];
                this.spellConfigB[1] = [radius, value];
                break;
            case 2:
                value = cf.POTION2.potion[SPELL_ID.HEAL].statPerLevel.healthUp[lvl];
                this.spellConfigB[2] = [radius, value];
                break;
            case 3:
                value = cf.POTION2.potion[SPELL_ID.SPEED_UP].statPerLevel.duration[lvl];
                this.spellConfigB[3] = [radius, value];
                break;
            default:
                cc.log('Card typeCard \"' + typeCard + '\" not found in config.')
                break;
        }
        cc.log('add spell = '+ radius+ ' ' + value)
    },
    getSpellConfig: function (typeCard, rule) {
        if(rule === 1) {
            return this.spellConfigA[typeCard];
        }else{
            return this.spellConfigB[typeCard];
        }

    },
    /*
       sort cac action theo frame trigger
    */
    addActionBySort:function (frameTrigger, actionArray){
        if(ActionListInstance.length>0) {
            let check1 = false;
            for (let i = ActionListInstance.length-1; i >= 0; i--) {
                if (ActionListInstance[i][0] <= frameTrigger) {
                    ActionListInstance.splice(i + 1, 0, actionArray);
                    check1 = true;
                    break;
                }
            }
            /*
            Nếu duyệt về đầu mà ko tìm thấy frame bé hơn => add vào đầu
             */
            if(!check1){
                ActionListInstance.unshift(actionArray);
            }
        }else {
            ActionListInstance.push(actionArray)
        }
    },
});
