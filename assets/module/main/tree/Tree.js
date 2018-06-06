let Observer = require('Observer');
let MainSceneModule = require('MainSceneModule');
cc.Class({
    extends: Observer,

    properties: {
        spTree: {displayName: "spTree", default: null, type: cc.Sprite},
        spLeftBranch: {displayName: "spLeftBranch", default: null, type: cc.Sprite},
        spRightBranch: {displayName: "spRightBranch", default: null, type: cc.Sprite},
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

    initTree(dir){
        if(dir === 0){
            this.spLeftBranch.node.active = false;
            this.spRightBranch.node.active = false;
        } else if(dir === -1){
            this.spLeftBranch.node.active = true;
            this.spRightBranch.node.active = false;
        } else if(dir === 1){
            this.spLeftBranch.node.active = false;
            this.spRightBranch.node.active = true;
        }
    },

    flyTree(branchDir, dir){
        this.initTree(branchDir);
        let moveAct = null;
        let rotateAct = null;
        let spawnAct = null;
        let distance = cc.view.getVisibleSize().width/2+MainSceneModule.tree.width;
        if(dir === 1){
            moveAct = cc.moveBy(0.2, cc.p(-distance, 0));
            rotateAct = cc.rotateBy(0.2, -360);
        } else if(dir === -1){
            moveAct = cc.moveBy(0.2, cc.p(distance, 0));
            rotateAct = cc.rotateBy(0.2, 360);
        }
        spawnAct = cc.spawn(moveAct, rotateAct);
        let removeAct = cc.removeSelf(true);
        this.node.runAction(cc.sequence(spawnAct, removeAct));
    }
});
