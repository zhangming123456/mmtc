/**
 * Created by Aaronzm on 2018/5/3.
 */

/**
 * 设置当前页面公共组件关联生命周期
 * @returns {*}
 */
function setPageUtil (that) {
    let pages = getCurrentPages();
    pages[pages.length - 1].azmOnPageScroll = function (e) {
        that._azmOnPageScroll && that._azmOnPageScroll(e)
    };
    pages[pages.length - 1].azmOnReachBottom = function (options) {
        that._azmOnReachBottom && that._azmOnReachBottom(options)
    };
    pages[pages.length - 1].azmOnShareAppMessage = function (options) {
        that._azmOnShareAppMessage && that._azmOnShareAppMessage(options)
    };
}

module.exports.setPageUtil = setPageUtil;
