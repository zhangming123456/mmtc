const app = getApp(),
    util = app.util,
    c = require("../../utils/common.js"),
    ApiService = require("../../utils/azm/ApiService"),
    utilPage = require("../../utils/utilPage"),
    map = require("../../utils/map.js");

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'page activityWallet',
        bg2img: '/little/bg2.png',
        tipimg: '/little/tipimgs.png',
        userInfo: {}
    },
    onLoad () {
        this.loadCb();
    },
    onShow () {
        if (this.data.isShow) {
            this.loadCb();
        }
    }
};
const methods = {
    loadCb () {
        ApiService.getActivityNotice().then(
            res => {
                if (res.status === 1) {
                    this.setData({
                        records: res.info
                    })
                }
            }
        );
    },
    /**
     * 定位回调
     * @param e
     */
    getLocationCallback (e) {
        let that = this,
            options = that.data.options,
            invite_id = null,
            city = util.getCity();
        if (options.scene) {
            let scene = options.scene;
            if (scene) {
                let kv = scene.split(':');
                if (kv[0] == 'invite_id') {
                    invite_id = kv[1];
                }
            }
        } else if (options.invite_id) {
            invite_id = options.invite_id
        }
        ApiService.wx2CheckSession().then(res => {
            if (res.status === 1) {
                let userInfo = util.getUserInfo();
                that.setData({userInfo, invite_id});
                that.loadUser();
            }
        });
    },
    imageError () {
        this.setData({avatar: ''});
    },
    loadUser () {
        let city = util.getCity(),
            is_from_sz = city.id;
        ApiService.setActivityRegister({is_from_sz}).then(
            res => {
                if (res.status === 1) {
                    this.setData({money: res.info});
                }
            }
        );
    },
    bindShowPopup () {
        this.selectComponent("#azmPopup").toggle(true);
    },
    noop () {

    }
};
Page(new utilPage(appPage, methods));