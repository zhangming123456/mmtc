const config = require('./config');
import { HttpRequest } from "./ajax/http";

const $http = new HttpRequest();

class OldApi {
    constructor () {
        this.shopApi = config.shopApi;
        this.bdapi = config.bdApi;
    }

    /**
     * 验证登录信息
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    wx2CheckSession (data = {}, resole, reject) {
        let that = this;
        const api = '/wx2/checkSession';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }


}

class ApiService extends OldApi {
    constructor (...args) {
        super(...args); // 调用父类的constructor(x, y)
        this.api = config.defaultApi;
        this.token = null
    }

    /**
     * 获取订单列表
     * @param p
     * @param kw
     * @param type
     * @param resole
     * @param reject
     * @returns {*}
     */
    getShopSite ({p = 1, kw = null, type = null}, resole, reject) {
        let that = this, data = {p, kw, type};
        const api = '/shop/site';
        const http = $http.post(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 商家登入
     * @param username 用户名
     * @param password 密码
     * @param resole
     * @param reject
     * @returns {*}
     */
    shopLoing ({username = '', password = ''}, resole, reject) {
        let that = this, data = {username, password};
        const api = `/login/login`;
        const http = $http.post(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 消费码输入
     * @param pwd 消费码
     * @param resole
     * @param reject
     * @returns {*}
     */
    verificationSee ({pwd = ''}, resole, reject) {
        let that = this, data = {pwd};
        const api = `/verification/see`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 订单信息 -- 验证
     * @param id 订单ID
     * @param resole
     * @param reject
     * @returns {*}
     */
    verificationOrderInfo ({id = ''}, resole, reject) {
        let that = this, data = {id};
        const api = `/verification/orderInfo`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 订单详情 -- 普通订单
     * @param id 订单ID
     * @param resole
     * @param reject
     * @returns {*}
     */
    getOrderDetail ({id = ''}, resole, reject) {
        let that = this, data = {id};
        const api = `/shop_manager/orderDetail`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 订单详情-- 拼团
     * @param id 订单ID
     * @param resole
     * @param reject
     * @returns {*}
     */
    getOrderGroupDetail ({id = ''}, resole, reject) {
        let that = this, data = {id};
        const api = `/shop_manager/groupDetail`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 消费码验证
     * @param id 订单ID
     * @param resole
     * @param reject
     * @returns {*}
     */
    verification ({id = ''}, resole, reject) {
        let that = this, data = {id};
        const api = `/verification/verification1`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 查看产品详情
     * @param nodes
     * @param id
     * @param resole
     * @param reject
     * @returns {*}
     */
    siteItemInfo ({nodes = 1, id = 0} = {}, resole, reject) {
        let that = this,
            data = {nodes, id};
        const api = `/iteminfo/site`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 拼团订单会员详情
     * @param id
     * @param resole
     * @param reject
     * @returns {*}
     */
    getGroupMemberDetail ({id = 0} = {}, resole, reject) {
        let that = this,
            data = {id};
        const api = `/shop_manager/groupMemberDetail`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取商家信息
     * @param resole
     * @param reject
     * @returns {*}
     */
    getUserInfo ({}, resole, reject) {
        let that = this,
            data = {};
        const api = `/shop/getRegisterInfo`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取客服电话
     * @param resole
     * @param reject
     * @returns {*}
     */
    getIndxSite ({}, resole, reject) {
        let that = this,
            data = {};
        const api = `/indx/site`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 意见反馈
     * @param content 内容
     * @param contact 联系方式
     * @param img_srcs 图片
     * @param resole
     * @param reject
     * @returns {*}
     */
    submitShopFeedback ({content = '', contact, img_srcs}, resole, reject) {
        let that = this,
            data = {content, contact, img_srcs};
        const api = `/shop/feedback`;
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取店铺信息
     * @param resole
     * @param reject
     * @returns {*}
     */
    getShopManagerInfo ({}, resole, reject) {
        let that = this,
            data = {};
        const api = `/shop_manager/index`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取店铺注册信息
     * @param resole
     * @param reject
     * @returns {*}
     */
    getRegisterInfo ({}, resole, reject) {
        let that = this,
            data = {};
        const api = `/shop/getRegisterInfo`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取店铺二维码
     * @param page
     * @param resole
     * @param reject
     * @returns {*}
     */
    showShopQRCode ({page = 'pages/home/index'}, resole, reject) {
        let that = this,
            data = {page};
        const api = `/shop/showQrcode`;
        const http = $http.downImage(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取店铺标签
     * @param page
     * @param resole
     * @param reject
     * @returns {*}
     */
    showGetAllTags ({} = {}, resole, reject) {
        let that = this,
            data = {};
        const api = `/shop/getAllTags`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取店铺图册
     * @param resole
     * @param reject
     * @returns {*}
     */
    showGetPicFigure ({} = {}, resole, reject) {
        let that = this,
            data = {};
        const api = `/shop/picFigure`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 保存店铺标签
     * @param tags
     * @param resole
     * @param reject
     * @returns {*}
     */
    showSetShopTags ({tags = []} = {}, resole, reject) {
        let that = this,
            data = {tags};
        const api = `/shop/setShopTags`;
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 保存头像
     * @param cover
     * @param resole
     * @param reject
     * @returns {*}
     */
    showSetCover ({cover} = {}, resole, reject) {
        let that = this,
            data = {cover};
        const api = `/shop_manager/setCover`;
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 保存店铺gps地址
     * @param address
     * @param latitude
     * @param longitude
     * @param name
     * @param resole
     * @param reject
     * @returns {*}
     */
    saveShopAddress ({address, latitude, longitude, name}, resole, reject) {
        let that = this,
            data = {address, latitude, longitude, name};
        const api = `/shop/saveAddr`;
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 保存店铺服务电话 - 座机
     * @param telephone
     * @param resole
     * @param reject
     * @returns {*}
     */
    shopChangeServicePhone2 ({telephone}, resole, reject) {
        let that = this,
            data = {telephone};
        const api = `/shop/changeServicePhone2`;
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 保存店铺服务电话 - 手机
     * @param telephone
     * @param resole
     * @param reject
     * @returns {*}
     */
    shopChangeServicePhone ({telephone, code}, resole, reject) {
        let that = this,
            data = {telephone, code};
        const api = `/shop/changeServicePhone`;
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 保存详细地址
     * @param address
     * @param resole
     * @param reject
     * @returns {*}
     */
    shopSaveDetailAddr ({address}, resole, reject) {
        let that = this,
            data = {address};
        const api = `/shop_manager/saveDetailAddr`;
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 保存店铺图片
     * @param img_srcs
     * @param resole
     * @param reject
     * @returns {*}
     */
    shopSaveImgSrcs ({img_srcs}, resole, reject) {
        let that = this,
            data = {img_srcs};
        const api = `/shop_manager/saveImgSrcs`;
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 保存店铺相册
     * @param img_srcs
     * @param type_id
     * @param resole
     * @param reject
     * @returns {*}
     */
    shopPicsOfType ({img_srcs, type_id}, resole, reject) {
        let that = this,
            data = {img_srcs, type_id};
        const api = `/shop_manager/setPicsOfType`;
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取验证码
     * @param telephone
     * @param resole
     * @param reject
     * @returns {*}
     */
    myGetCheckCode ({telephone}, resole, reject) {
        let that = this,
            data = {telephone};
        const api = `/my/getCheckCode`;
        const http = $http.post2(that.shopApi + api, data, resole, reject);
        return http;
    }

    /**
     * 获取图册管理图片
     * @param type_id
     * @param resole
     * @param reject
     * @returns {*}
     */
    shopGetPicsOfType ({type_id}, resole, reject) {
        let that = this,
            data = {type_id};
        const api = `/shop_manager/picsOfType`;
        const http = $http.get(that.shopApi + api, data, resole, reject);
        return http;
    }
}


module.exports = new ApiService();