module.exports = {
    status:{
        login:true,
        main:false,
        over:false
    },

    playerDir:-1,

    tapStatus:true,

    player:{
        dir:-1,
        leftPos:null,
        rightPos:null
    },

    tree:{
        width:null,
        height:null
    },

    score:0,
    bestScore:0,
    treeNum:7,
    time:5,
    totalTime:10,
    level:0,

    bgAudioId: null,

    resetTime(){
        this.time = 5;
        return this.time;
    },

    resetLevel(){
        this.level = 0;
    },

};