const util = require('./utils/util');
let isUpdate = true;
App({
    util,
    onLaunch: function (options) {
        console.log('App Launch', options)
    },
    onShow: function (options) {
        console.log('App Show', options);
        if (isUpdate) {
            new util.updateManager().onALL();
            isUpdate = false;
        }
    },
    onHide: function () {
        isUpdate = true;
        console.log('App Hide')
    },
    globalData: {
        hasLogin: false,
        openid: null,
        userInfo: {
            bname: null,
            create_time: null,
            grandpa_id: null,
            headimg: null,
            id: null,
            level: null,
            parent_id: null,
            telephone: null,
            username: null,
        },
        startDate: '2017-01-01',
        currentDate: util.dateCalendar.format(new Date(), 'YYYY-MM-DD'),
        queryType: 2,
        queryTime: util.dateCalendar.format(new Date(), 'YYYY-MM-DD'),
        events: {},
        services: {},
        productManage: {},
        $$pages: []
    },
    // lazy loading openid
    getUserOpenId: function (callback) {
        var self = this

        if (self.globalData.openid) {
            callback(null, self.globalData.openid)
        } else {
            wx.login({
                success: function (data) {

                },
                fail: function (err) {
                    callback(err)
                }
            })
        }
    }
})
