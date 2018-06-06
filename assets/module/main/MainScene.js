let Observer = require('Observer');
let MainSceneModule = require('MainSceneModule');

cc.Class({
    extends: Observer,

    properties: {
        treePre: { displayName: "treePre", default: null, type: cc.Prefab },
        treeLayer: { displayName: "treeLayer", default: null, type: cc.Node },
        loginUILayer: { displayName: "loginUILayer", default: null, type: cc.Node },
        mainUILayer: { displayName: "mainUILayer", default: null, type: cc.Node },
        overUILayer: { displayName: "overUILayer", default: null, type: cc.Node },
        spBaseTree: { displayName: "spBaseTree", default: null, type: cc.Sprite },
        spBg: { displayName: "spBg", default: null, type: cc.Sprite },
        spFlyTree: { displayName: "spFlyTree", default: null, type: cc.Sprite },
        spPlayer: { displayName: "spPlayer", default: null, type: cc.Sprite },
        touchLayer: { displayName: "touchLayer", default: null, type: cc.Node },
        tapLayout: { displayName: "tapLayout", default: null, type: cc.Node },
        spDie: { displayName: "spDie", default: null, type: cc.Sprite },
        spOverFrame: { displayName: "spOverFrame", default: null, type: cc.Sprite },
        lblScore: { displayName: "lblScore", default: null, type: cc.Label },
        lblFinalScore: { displayName: "lblFinalScore", default: null, type: cc.Label },
        spBestScore: { displayName: "spBestScore", default: null, type: cc.Sprite },
        spTime: { displayName: "spTime", default: null, type: cc.Sprite },
        spBird0: { displayName: "spBird0", default: null, type: cc.Sprite },
        spBird1: { displayName: "spBird1", default: null, type: cc.Sprite },
        spLevel: { displayName: "spLevel", default: null, type: cc.Sprite },
        lblLevel: { displayName: "lblLevel", default: null, type: cc.Label },
        audioMgr: { displayName: "audioMgr", default: null, type: cc.Node },

        _preDir: 0,

        //微信小程序
        _flag: true,
        display: { displayName: "display", default: null, type: cc.Sprite },
        btnClose: {displayName: 'btnClose', default: null, type: cc.Button},
        
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [

        ];
    },

    _onMsg(msg, data) {

    },

    _onError(msg, code, data) {

    },

    onLoad() {
        // this._initAd();  //广告代码
        this._initMsg();
        this._resetStatus();
        this._playBgAudio();
        if (MainSceneModule.status) {
            this._initUI();
        }
        this._initView();

        //微信小程序
        wx.showShareMenu({withShareTicket: false});//设置分享按钮，方便获取群id展示群排行榜
        this.tex = new cc.Texture2D();

        // wx.onMessage(data=>{
        //     if(data.message === 'close'){
        //         this._flag = false;
        //     }
        // });
    },

    start() {

    },

    update(dt) {
        if (this._flag !== true) {
            this._updateSubDomainCanvas();
        }
        // this._updateSubDomainCanvas();
    },

    _resetStatus() {
        MainSceneModule.status.login = true;
        MainSceneModule.status.main = false;
        MainSceneModule.status.over = false;

        MainSceneModule.score = 0;
        MainSceneModule.bestScore = 0;
    },

    _initUI() {
        this.loginUILayer.active = MainSceneModule.status.login;
        this.mainUILayer.active = MainSceneModule.status.main;
        this.overUILayer.active = MainSceneModule.status.over;

        if (this.loginUILayer.active) {

        }

        if (this.mainUILayer.active) {

            MainSceneModule.tapStatus = true;
            this.tapLayout.active = MainSceneModule.tapStatus;
            this._initTouchLayer();
            // MainSceneModule.time = 5;
            // MainSceneModule.time = MainSceneModule.resetTime();
            MainSceneModule.resetTime();
            MainSceneModule.resetLevel();
            this.spLevel.node.runAction(cc.hide());
            this._initTimer();
            MainSceneModule.score = 0;
            this.spBestScore.node.active = false;
            this._refreshScore();
            this._playBirdFly();
        }

        if (!this.overUILayer.active) {
            this.spOverFrame.node.stopAllActions();
            this.spOverFrame.node.y = cc.view.getVisibleSize().height;
        } else {
            this.lblFinalScore.string = MainSceneModule.score;
            if (MainSceneModule.score > MainSceneModule.bestScore) {
                this.spBestScore.node.active = true;
                MainSceneModule.bestScore = MainSceneModule.score;
                this._submitScore(MainSceneModule.score);
            }
            let distance = cc.view.getVisibleSize().height / 2 - this.spOverFrame.node.height / 2;
            let moveDownAct = cc.moveTo(0.5, cc.p(0, distance));
            // let callFuncAct = cc.callFunc(this._initUI, this);
            this.spOverFrame.node.runAction(moveDownAct);
        }
    },

    _initTree() {
        this._preDir = 0;
        let baseArr = [0, 0, 0];
        let contentArr = [];
        for (let i = 0; i < MainSceneModule.treeNum; ++i) {
            let dir = this._randDir();
            contentArr.push(dir);
        }
        // this._treeArr = _.concat(baseArr, contentArr);
        this._treeArr = baseArr.concat(contentArr);
        for (let i = 0; i < this._treeArr.length; ++i) {
            this._createTree(i, this._treeArr[i]);
        }
        this.spFlyTree.node.y = this.spBaseTree.node.y + this.spBaseTree.node.height / 2 + this.spFlyTree.node.height / 2;
    },

    _initPlayer() {
        this.spPlayer.node.active = true;
        // MainSceneModule.player.leftPos = 0-this.spPlayer.node.width/2-this.spBaseTree.node.width/2-this.spBaseTree.node.width/5;
        // MainSceneModule.player.rightPos = this.spPlayer.node.width/2+this.spBaseTree.node.width/2+this.spBaseTree.node.width/5;
        MainSceneModule.player.leftPos = -this.spPlayer.node.width * 2;
        MainSceneModule.player.rightPos = this.spPlayer.node.width * 2;
        if (MainSceneModule.player.dir === -1) {
            this.spPlayer.node.scaleX = 1;
            this.spPlayer.node.x = MainSceneModule.player.leftPos;
        } else if (MainSceneModule.player.dir === 1) {
            this.spPlayer.node.scaleX = -1;
            this.spPlayer.node.x = MainSceneModule.player.rightPos;
        }
        this.spDie.node.active = false;
    },

    _initView() {
        this._initTree();
        this._initPlayer();
    },

    _randDir() {
        let sel = null;
        if (this._preDir === 0) {
            // sel = _.sample([-1, 0, 1]);
            let arr = [-1, 0, 1];
            let len = arr === null ? 0 : arr.length;
            sel = len ? arr[Math.floor(Math.random() * len)] : undefined
        } else {
            sel = 0;
        }
        this._preDir = sel;
        return sel;
    },

    _createTree(index, dir) {
        let treeNode = cc.instantiate(this.treePre);
        this.treeLayer.addChild(treeNode);
        treeNode.y = this.spBaseTree.node.y + this.spBaseTree.node.height / 2 + treeNode.height / 2 + treeNode.height * index;
        treeNode.getComponent('Tree').initTree(dir);
        MainSceneModule.tree.height = treeNode.height;
        MainSceneModule.tree.width = treeNode.width;
    },

    onBtnClickToStart() {
        MainSceneModule.status.login = false;
        MainSceneModule.status.main = true;
        MainSceneModule.status.over = false;
        this._initUI();
        // this._initView();
    },

    onBtnClickToRestart() {
        this.onBtnClickToStart();
        this.treeLayer.destroyAllChildren();
        this._initView();
        this._playBgAudio();
    },

    _initTouchLayer() {
        if (this.touchLayer.active) {
            this.touchLayer.on('touchstart', function (event) {

            }, this);

            this.touchLayer.on('touchend', this._changePlayerPos, this);
            this.touchLayer.on('touchcancel', this._changePlayerPos, this);
        }
    },

    _movePlayer(key, dir) {
        if (dir === -1) {
            this.spPlayer.node.scaleX = 1;
        } else if (dir === 1) {
            this.spPlayer.node.scaleX = -1;
        }
        this.spPlayer.node.x = MainSceneModule.player[key];
        // let firstItem = _.head(this._treeArr);
        let firstItem = (this._treeArr !== null && this._treeArr.length) ? this._treeArr[0] : undefined;
        if (dir === firstItem) {
            this._showGameOver();
        } else {
            this._addTree(dir);
        }
    },

    _addTree(playerDir) {
        let index = this.treeLayer.children.length;
        let treeDir = this._randDir();
        this._treeArr.push(treeDir);
        this._createTree(index, treeDir);
        this._moveDown();
        this._flyAway(playerDir);//飞走树
        this._checkGameOver(playerDir);
        this._addTime();
        this._playFaMuAudio();
    },

    _moveDown() {
        this.treeLayer.children[0].removeFromParent(true);
        for (let i = 0; i < this.treeLayer.children.length; ++i) {
            let moveAct = cc.moveBy(0.2, cc.p(0, -MainSceneModule.tree.height));
            this.treeLayer.children[i].runAction(moveAct);
        }
    },

    _flyAway(dir) {
        let branchDir = this._treeArr.shift();
        this._createFlyTree(0, branchDir, dir);
    },

    _createFlyTree(index, branchDir, dir) {
        let treeNode = cc.instantiate(this.treePre);
        this.spBg.node.addChild(treeNode);
        treeNode.y = this.spBaseTree.node.y + this.spBaseTree.node.height / 2 + treeNode.height / 2 + treeNode.height * index;
        treeNode.getComponent('Tree').flyTree(branchDir, dir);
    },

    _offTouchLayer() {
        this.touchLayer.off('touchend', this._changePlayerPos, this);
        this.touchLayer.off('touchcancel', this._changePlayerPos, this);
    },

    _showGameOver() {
        this._stopBgAudio();
        this._playDeathAudio();
        this._offTouchLayer();
        this.spDie.node.active = true;
        if (this.spPlayer.node.x < 0) {
            this.spDie.node.x = -this.spBaseTree.node.width;
        } else {
            this.spDie.node.x = this.spBaseTree.node.width;
        }

        this.spPlayer.node.active = false;

        MainSceneModule.status.over = true;
        MainSceneModule.status.main = false;
        MainSceneModule.status.login = false;
        this._initUI();
        this.unschedule(this._countDown);
        // this.showAd36153(); 
    },

    _changePlayerPos(event) {
        if (MainSceneModule.tapStatus) {
            MainSceneModule.tapStatus = false;
            this.tapLayout.active = MainSceneModule.tapStatus;
            this.schedule(this._countDown, 1);
        }
        let w = cc.view.getVisibleSize().width;
        if (event.getLocationX() < w / 2) {
            this._movePlayer('leftPos', -1);
        } else {
            this._movePlayer('rightPos', 1);
        }
        this._playChop('chop');

    },

    _checkGameOver(playerDir) {
        // let firstItem = _.head(this._treeArr);
        let firstItem = (this._treeArr !== null && this._treeArr.length) ? this._treeArr[0] : undefined;
        if (playerDir === firstItem) {
            this._showGameOver();
        } else {
            MainSceneModule.score++;
            this._refreshScore();
        }
    },

    _refreshScore() {
        this.lblScore.string = MainSceneModule.score;
        let level = parseInt(MainSceneModule.score / 20);
        if (MainSceneModule.score % 20 === 0 && MainSceneModule.score !== 0) {
            this.lblLevel.string = level;
            // this.spLevel.node.active = true;
            let showAct = cc.show();
            let hideAct = cc.hide();
            let moveAct = cc.moveBy(0.5, cc.p(0, this.spLevel.node.height * 2));
            let moveBackAct = cc.moveBy(0.01, cc.p(0, -this.spLevel.node.height * 2));
            let delayAct = cc.delayTime(1);
            this.spLevel.node.runAction(cc.sequence(showAct, delayAct, moveAct, hideAct, moveBackAct));
        }
    },

    _playChop(dir) {
        this.spPlayer.node.getComponent(cc.Animation).play(dir);
    },

    _countDown() {
        MainSceneModule.time--;
        if (MainSceneModule.time <= 0) {
            this._showGameOver();
        }
        this._initTimer();
    },

    _addTime() {
        MainSceneModule.time++;
        if (MainSceneModule.time >= 10) {
            MainSceneModule.time = 10;
        }
        this._initTimer();
    },

    _initTimer() {
        let fillStart = this.spTime.fillStart;
        fillStart = MainSceneModule.time / MainSceneModule.totalTime;
        this.spTime.fillStart = fillStart;
    },

    _playBirdFly() {
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height / 2;
        let x0 = -w;
        let x1 = -0.9 * w;

        let y0 = 0.5 * h;
        let y1 = 0.65 * h;

        this.spBird0.node.position = cc.p(x0, y0);
        this.spBird1.node.position = cc.p(x1, y1);

        let moveAct0 = cc.moveBy(20, cc.p(w * 3, 0));
        let moveAct1 = cc.moveBy(20, cc.p(w * 3, 0));
        let placeAct0 = cc.place(cc.p(x0, y0));
        let placeAct1 = cc.place(cc.p(x1, y1));

        this.spBird0.node.runAction(cc.repeatForever(cc.sequence(moveAct0, placeAct0)));
        this.spBird1.node.runAction(cc.repeatForever(cc.sequence(moveAct1, placeAct1)));
    },

    _playBgAudio() {
        this.audioMgr.getComponent('AudioMgr').playBgAudio();
    },

    _playFaMuAudio() {
        this.audioMgr.getComponent('AudioMgr').playFaMuAudio();
    },

    _playDeathAudio() {
        this.audioMgr.getComponent('AudioMgr').playDeathAudio();
    },

    _stopBgAudio() {
        this.audioMgr.getComponent('AudioMgr').stopBgAudio();
    },

    // _initAd() {
    //     if (window.Vijs) {
    //         window.myAd36153 = Vijs.setAD({
    //             unitid: 36153,
    //             loadedCallback: function () {
    //                 console.log('load success')
    //             },
    //             rewardedCallback: function (reward_name, reward_amount) {
    //                 console.log(reward_amount);
    //             }
    //         });
    //     }
    //     function showAd37281() {
    //         window.myAd37281 && window.myAd37281.show();
    //     }
    // },

    // showAd36153() {
    //     window.myAd36153 && window.myAd36153.show();
    // }

    //微信小程序
    _updateSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.display.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    onBtnClickToFriendsRank() {
        this._flag = false;
        this.btnClose.node.active = true;
        wx.postMessage({
            message: 'friendsRank'
        });
    },

    onBtnClickToGroupsRank() {
        this._flag = false;
        wx.shareAppMessage({
            title: '疯狂伐木工2',
            imageUrl: 'res/raw-assets/resources/uiModule/main/role.d6112.png',
            success: (res) => {
                if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                    wx.postMessage({
                        message: "groupsRank",
                        shareTicket: res.shareTickets[0]
                    });
                }
            }
        });
    },

    _submitScore(score) {
        wx.postMessage({
            message: 'submitScore',
            score: score
        });
    },

    onBtnClickToClose() {
        console.log('closeclose');
        this.btnClose.node.active = false;
        this._flag = true;
        wx.postMessage({
            message: 'close'
        });
    }
});
