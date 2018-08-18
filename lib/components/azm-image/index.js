const app = getApp(),
    util = app.util, regeneratorRuntime = util.regeneratorRuntime,
    config = require("../../../utils/config"),
    authorize = require("../../../utils/authorize");
Component({
    externalClasses: ['azm-image'],

    data: {
        name: 'image',
        newSrc: '',
        isError: false,
        isLoad: false
    },
    properties: {
        src: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数
                // console.log(newVal, oldVal, this.data.isError, `属性值被更改时的响应函数:src`);
                this.setData({
                    isLoad: true,
                    newSrc: config.imageUrl + newVal
                })
            }
        },
        nolClass: {
            type: String,
            value: '',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        mode: {
            type: String,
            value: 'scaleToFill',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        lazyLoad: {
            type: Boolean,
            value: false,
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        },
        defineImage: {
            type: String,
            value: 'imgs/mmtcTabList/banner.png',
            observer (newVal, oldVal) {//属性值被更改时的响应函数

            }
        }
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
     */
    created(){
        // console.log(`组件生命周期函数created`);
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    attached(){
        // console.log(`组件生命周期函数attached`);
    },
    /**
     * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
     */
    ready(){
        // console.log(`组件生命周期函数ready`);
    },
    /**
     * 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
     */
    moved(){
        // console.log(`组件生命周期函数moved`);
    },
    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached(){
        // console.log(`组件生命周期函数detached`);
    },
    methods: {
        _bindAzmImageError(e) {
            // console.log(e, `组件事件函数_bindAzmImageError`);
            let that = this;
            that.setData({
                newSrc: `../../../${that.data.defineImage}`
            });
            that.triggerEvent('error', {dataset: e.detail}, {bubbles: true, composed: true});
        },
        _bindAzmImageLoad(e){
            // console.log(e, `组件事件函数_bindAzmImageLoad`);
            let that = this;
            that.setData({
                isLoad: true
            });
            that.triggerEvent('load', {dataset: e.detail}, {bubbles: true, composed: true});
        }
    }
})
