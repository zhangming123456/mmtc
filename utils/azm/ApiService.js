const config = require('../config'),
    utilCommon = require('./utilCommon');
import { HttpRequest } from "./httpRequest";

const $http = new HttpRequest();
class OldApi {
    constructor () {
        this.shopapi = `${this.url}/shopapi`;
    }

    /**
     * category/dataList
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getCategoryDataList (data = {}, resole, reject) {
        let that = this;
        const api = '/category/dataList';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取项目列表数据goodsList
     * category/dataList
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     * lon=114.05454&lat=22.52291&category_id=18&near_type=-1&sort=1&type_id=1&_f=1
     */
    getGroupGoodsList (data = {category_id: 0, near_type: 0, sort: 0, type_id: 0}, resole, reject) {
        let that = this;
        const api = '/group/goodsList';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * /trading/getData
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     * lon=114.05454&lat=22.52291&category_id=18&near_type=-1&sort=1&type_id=1&_f=1
     */
    getTradingGetData (data = {}, resole, reject) {
        let that = this;
        const api = '/trading/getData';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * order/dataList
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getOrderDataList (data = {type: 0, p: 1}, resole, reject) {
        let that = this;
        const api = '/order/dataList';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取附近项目列表
     * /shop/filterData
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getShopFilterData (data = {lan: 0, lat: 0, p: 0}, resole, reject) {
        let that = this;
        const api = '/shop/filterData';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
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

    /**
     * 获取开通城市列表
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getCityData (data = {}, resole, reject) {
        let that = this;
        const api = '/city/getData';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }


}
class ApiService extends OldApi {
    constructor (...args) {
        super(...args); // 调用父类的constructor(x, y)
        this.url = config.host;
        this.api = `${this.url}/api`;
        this.token = null
    }

    getToken () {
        const app = getApp();
        if (this.token && this.token.length > 0) {
            return this.token;
        } else {
            return app.getToken();
        }
    }

    /**
     * 获取首页banner
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getBanners (data = {}, resole, reject) {
        let that = this;
        const api = '/wx_shop/banners';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * banner
     * api/special/banner
     * 品子banner图
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getSpecialBanner (data = {}, resole, reject) {
        let that = this;
        const api = '/special/banner';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取所有专题商品列表分类名
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getSpecialList (data = {}, resole, reject) {
        let that = this;
        const api = '/special/special_list';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取专题商品列表
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getSpecialItem (data = {id: 1, page: 1, limit: 3}, resole, reject) {
        let that = this;
        const api = '/special/special_item';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取附近项目
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getSpecialItemNear (data = {p: 1, lon: 0, lat: 0}, resole, reject) {
        let that = this;
        const api = '/special/item_near';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     *
     * 专题商品列表banner
     * api/special/special_item?id=1
     * @id  get列表ID
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getSpecialItemNear (data = {p: 1, lon: 0, lat: 0}, resole, reject) {
        let that = this;
        const api = '/special/item_near';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 退款列表接口
     * api/refund/refund
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getRefundData (data = {p: 1}, resole, reject) {
        let that = this;
        const api = '/refund/refund';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 退款列表接口
     * refund/refund_info?id=1
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getRefundInfo (data = {id: 1}, resole, reject) {
        let that = this;
        const api = '/refund/refund_info';
        const http = $http.post(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取项目信息
     * group/refund_info?id=1
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getItemBuyInfo ({item_id = 0, item_num = 1, is_group = 1} = {}, resole, reject) {
        let that = this, data = {item_id, item_num, is_group};
        const api = '/group/getItemBuyInfo_1';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 保存form_id
     * /store/saveFormIds
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    saveFormIds ({form_id = 0} = {}, resole, reject) {
        let that = this, data = {form_id};
        const api = '/store/saveFormIds';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 立即购买
     * @param data
     * @param item_id
     * @param item_num
     * @param is_group  大于1 拼团
     * @param group_id
     * @param rmcids 优惠券ID  string  ID1，ID2。。。
     * @param resole
     * @param reject
     * @returns {*}
     */
    getPayInfoOfBuyNow ({item_id = 0, item_num = 1, is_group = 0, group_id = 0, rmcids = ''} = {}, resole, reject) {
        let that = this, data = {item_id, item_num, is_group, group_id, rmcids};
        const api = '/wx2/getPayInfoOfBuyNow';
        const http = $http.post2(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 获取技师接口
     * refund/refund_info?id=1
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getMmgShopIndex (data = {shop_id: 0}, resole, reject) {
        let that = this;
        const api = '/shop/technician';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

    /**
     * 日记banner
     * refund/refund_info?id=1
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getBannerInfo (data = {id: 1}, resole, reject) {
        let that = this;
        const api = '/group/getBanner';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }


    /**
     * 优惠卷
     * refund/refund_info?id=1
     * @param data
     * @param resole
     * @param reject
     * @returns {*}
     */
    getCouponInfo (data = {shop_id: 0}, resole, reject) {
        let that = this;
        const api = '/wx2/coupon';
        const http = $http.get(that.api + api, data, resole, reject);
        return http;
    }

}
module.exports = new ApiService();