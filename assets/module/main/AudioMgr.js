// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
let Observer = require('Observer');
cc.Class({
    extends: Observer,

    properties: {
        bgAudio: {displayName: "bgAudio", default: null, url: cc.AudioClip},
        famuAudio: {displayName: "famuAudio", default: null, url: cc.AudioClip},
        deathAudio: {displayName: "deathAudio", default: null, url: cc.AudioClip},
        _bgAudioId:null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList(){
        return [];
    },

    _onMsg(msg, data){

    },
    onLoad () {
        this._initMsg();
    },

    start () {

    },

    // update (dt) {},
    playBgAudio(){
        if(this._bgAudioId!==null){
            cc.audioEngine.stop(this._bgAudioId);
            this._bgAudioId = null;
        }
        this._bgAudioId = cc.audioEngine.play(this.bgAudio, true, 0.5);
        return this._bgAudioId;
    },

    playFaMuAudio(){
        return cc.audioEngine.play(this.famuAudio, false, 1);
    },

    playDeathAudio(){
        return cc.audioEngine.play(this.deathAudio, false, 1);
    },

    stopBgAudio(){
        if(this._bgAudioId!==null){
            cc.audioEngine.stop(this._bgAudioId);
            this._bgAudioId = null;
        }
        cc.audioEngine.stopAll();
    }
});
