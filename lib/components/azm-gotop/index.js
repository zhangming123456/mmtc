const app = getApp(),
    map = require("../../../utils/map/index"),
    util = require("../../../utils/util"),
    config = require("../../../utils/config"),
    utilEvents = require("../utilEvents"),
    authorize = require("../../../utils/authorize");
Component({
    externalClasses: ['azm-gotop'],

    data: {
        name: 'goTop',
        imageUrl: config.imageUrl
    },
    properties: {
        scrollTop: {
            type: Number,
            value: 0,
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        class: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        duration: {
            type: Number,
            value: 300,
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        definedScrollTop: {
            type: Number,
            value: 200,
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        isShow: {
            type: Boolean,
            value: false,
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        }
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
     */
    created(){
        console.log(`组件生命周期函数created`);
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached(){
        console.log(`组件生命周期函数attached`);
    },
    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
     */
    ready(){
        console.log(`组件生命周期函数ready`);
        let that = this;
        utilEvents.setPageUtil(that);
    },
    /**
     * 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
     */
    moved(){
        console.log(`组件生命周期函数moved`);
    },
    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached(){
        console.log(`组件生命周期函数detached`);
    },
    methods: {
        _bindAzmGotopTap(e) {
            let that = this;
            wx.pageScrollTo({
                scrollTop: that.data.scrollTop,
                duration: that.data.duration
            });
            that.triggerEvent('azmtap', {dataset: e.detail}, {bubbles: true, composed: true});
        },
        _azmOnPageScroll(options){
            let data = this.data;
            if (options.scrollTop > data.definedScrollTop && !data.isShow) {
                this.setData({
                    isShow: true
                })
            } else if (options.scrollTop < data.definedScrollTop) {
                this.setData({
                    isShow: false
                })
            }
        },
        _azmOnReachBottom(options){
        },
        _azmOnShareAppMessage(options){
        },
    }
})
