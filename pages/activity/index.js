const app = getApp(),
    util = app.util,
    config = require('../../utils/config'),
    utilPage = require('../../utils/utilPage'),
    authorize = require('../../utils/azm/authorize'),
    ApiService = require('../../utils/azm/ApiService'),
    c = require("../../utils/common");

/**
 * @author zhangxinxu(.com)
 * @licence MIT
 * @description http://www.zhangxinxu.com/wordpress/?p=7362
 */
function drawTextVertical (context, text, x, y) {
    var arrText = text.split('');
    var arrWidth = arrText.map(function (letter) {
        return 26;
        // 这里为了找到那个空格的 bug 做了许多努力，不过似乎是白费力了
        // const metrics = context.measureText(letter);
        // console.log(metrics);
        // const width = metrics.width;
        // return width;
    });

    var align = context.textAlign;
    var baseline = context.textBaseline;

    if (align == 'left') {
        x = x + Math.max.apply(null, arrWidth) / 2;
    } else if (align == 'right') {
        x = x - Math.max.apply(null, arrWidth) / 2;
    }
    if (baseline == 'bottom' || baseline == 'alphabetic' || baseline == 'ideographic') {
        y = y - arrWidth[0] / 2;
    } else if (baseline == 'top' || baseline == 'hanging') {
        y = y + arrWidth[0] / 2;
    }

    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // 开始逐字绘制
    arrText.forEach(function (letter, index) {
        // 确定下一个字符的纵坐标位置
        var letterWidth = arrWidth[index];
        // 是否需要旋转判断
        var code = letter.charCodeAt(0);
        if (code <= 256) {
            context.translate(x, y);
            // 英文字符，旋转90°
            context.rotate(90 * Math.PI / 180);
            context.translate(-x, -y);
        } else if (index > 0 && text.charCodeAt(index - 1) < 256) {
            // y修正
            y = y + arrWidth[index - 1] / 2;
        }
        context.fillText(letter, x, y);
        // 旋转坐标系还原成初始态
        context.setTransform(1, 0, 0, 1, 0, 0);
        // 确定下一个字符的纵坐标位置
        var letterWidth = arrWidth[index];
        y = y + letterWidth;
    });
    // 水平垂直对齐方式还原
    context.textAlign = align;
    context.textBaseline = baseline;
}

// module.exports = {
//     drawTextVertical: drawTextVertical
// }

const appPage = {
    /**
     * 页面的初始数据
     */
    data: {
        text: 'page activityIndex',
        imagePath: null,
        qrcodePath: null,
        cookie: util.getSessionId(),
        drawArray: [],
        downAreasStyle: 'color: #feece1;'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadCb();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '美美天成新年红包',
            path: '/pages/activity/wallet'
        };
    }
};
const methods = {
    loadCb(){
        wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#feece1',
            animation: {
                duration: 400,
                timingFunc: 'easeIn'
            }
        });
        this.downImage()
    },
    // 下载图片&二维码
    downImage () {
        util.showLoading();
        let that = this,
            imageUrl = that.data.imageUrl,
            cookie = that.data.cookie,
            pagePath = encodeURIComponent('pages/activity/wallet'),
            imagePath = `${imageUrl}/little/redbag.png`,
            qrcodePath = `${imageUrl}/api/wx_shop/showInviteQrcode?page=${pagePath}`;
        wx.getSystemInfo({
            success: res => {
                console.log(res);
                let winWidth = res.windowWidth,
                    radio = winWidth * 2 / 750,
                    winHeight = 667 * radio;
                this.setData({winWidth, winHeight, radio});
                let p1 = new Promise((resolve, reject) => {
                        wx.downloadFile({
                            url: imagePath,
                            success: function (res) {
                                if (res.statusCode === 200) {
                                    that.data.imagePath = res.tempFilePath;
                                    resolve();
                                } else {
                                    reject()
                                }
                            },
                            fail: () => {
                                reject()
                            }
                        });
                    }).then(result => result).catch(e => e),
                    p2 = new Promise((resolve, reject) => {
                        wx.downloadFile({
                            url: qrcodePath,
                            header: {cookie},
                            success: function (res) {
                                if (res.statusCode === 200) {
                                    that.data.qrcodePath = res.tempFilePath
                                    resolve();
                                } else if (res.status === 202) {

                                } else {
                                    reject()
                                }
                            },
                            fail: () => {
                                reject()
                            }
                        });
                    }).then(result => result).catch(e => e);
                Promise.all([p1, p2])
                    .catch(res => {
                        console.log(res);
                    })
                    .finally(res => {
                        that.drawStart();
                        that.drawStart({id: 'myCanvas', w: winWidth, h: winHeight});
                    });
            },
            complete: res => {
                util.hideLoading();
            }
        });
    },
    /**
     * 开始绘制
     */
    drawStart({id = 'ctx', w = 750, h = 1334, bgColor = '#feece1'} = {}){
        let that = this, data = {w, h};
        that.setData({
            [`${id}Style`]: `width: ${w}px;height: ${h}px`
        });
        // 拿到canvas context
        let ctx = wx.createCanvasContext(id);
        // 为了保证图片比例以及绘制的位置，先要拿到图片的大小
        // 绘制canvas背景，不属于绘制图片部分
        ctx.setFillStyle(bgColor);
        ctx.fillRect(0, 0, w, h);
        // 绘制背景图
        that.drawBgImage(ctx, w, h);
        // 绘制小程序码
        that.drawQrCodeImage(ctx, w, h);
        // // 绘制势力汉字：吴
        // that.drawInfluence(ctx, that.data.hero.HERO.INFLUENCE);
        // // 绘制武将姓名：陆逊
        // that.drawName(ctx, that.data.hero.HERO.NAME);
        // 绘制武将称号：江陵侯
        // that.drawHorner(ctx, that.data.hero.HERO.HORNER);
        // 最终调用draw函数，生成预览图
        // 一个坑点：只能调用一次，否则后面的会覆盖前面的

        Promise.all(that.data.drawArray)
            .catch(res => {
                console.log('绘制出错');
            })
            .finally(res => {

            })
    },
    /**
     * 绘制背景图
     * @param path
     */
    drawBgImage (ctx, w, h) {
        let that = this,
            imagePath = that.data.imagePath;
        let p = new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: imagePath,
                success: function (res) {
                    // 计算图片占比信息
                    let maxWidth = Math.min(res.width, w),
                        radio = maxWidth / res.width,
                        offsetX = (w - res.width * radio) / 2,
                        offsetY = h - res.height * radio;
                    that.setData({
                        bg_image: {
                            radio,
                            width: res.width,
                            height: res.height,
                            w: res.width * radio,
                            h: res.height * radio,
                            y: offsetY,
                            x: offsetX
                        }
                    });
                    // 绘制背景图片，path是本地路径，不可以传网络url，如果是网络图片需要先下载
                    ctx.drawImage(imagePath, offsetX, offsetY, res.width * radio, res.height * radio);
                    ctx.draw(true)
                    resolve();
                },
                fail: function () {
                    reject();
                }
            });
        }).then(result => result).catch(e => e);
        that.data.drawArray.push(p);
    },
    /**
     * 绘制二维码
     * @param ctx
     */
    drawQrCodeImage(ctx, w, h){
        let that = this,
            qrcodePath = that.data.qrcodePath,
            width = w,
            height = h,
            scale = 0.4,
            offset_y = 437;
        let p = new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: qrcodePath,
                success: function (res) {
                    // 计算图片占比信息
                    let maxWidth = Math.min(res.width, width * scale),
                        radio = maxWidth / res.width,
                        radioY = height * 2 / 1334,
                        offsetX = (width - res.width * radio) / 2,
                        offsetY = offset_y * radioY - res.height * radio / 2;
                    that.setData({
                        qrcodeImage: {
                            radioY,
                            width: res.width,
                            height: res.height,
                            w: res.width * radio,
                            h: res.height * radio,
                            y: offsetY,
                            x: offsetX
                        }
                    });
                    ctx.drawImage(qrcodePath, offsetX, offsetY, res.width * radio, res.height * radio);
                    ctx.draw(true);
                    resolve();
                },
                fail: function () {
                    reject()
                }
            })
        }).then(result => result).catch(e => e);
        that.data.drawArray.push(p);
    },

    // 绘制文字
    drawText (ctx, text) {
        ctx.setFillStyle('#db3033');
        ctx.fillRect();
        // 设置字号
        ctx.setFontSize(26);
        // 设置字体颜色
        ctx.setFillStyle("#000000");
        // 计算绘制起点
        let x = this.data.offsetX + 35;
        let y = this.data.offsetY + 10;
        console.log('drawHorner' + text);
        console.log(x);
        console.log(y);

        // 绘制竖排文字，这里是个Util函数，具体实现请继续看
        // drawTextVertical(ctx, text, x, y);
    },
    // 获取canvas图片
    downPage() {
        let that = this;
        console.log('长按事件');
        if (that.data.tempFilePath) {
            that.saveImage();
            return;
        }
        util.showLoading();
        wx.canvasToTempFilePath({
            canvasId: 'ctx',
            success: function (res) {
                that.setData({
                    tempFilePath: res.tempFilePath
                });
                util.hideLoading();
                that.saveImage();
            }
        })
    },
    // 保存海报
    saveImage(){
        let that = this;
        wx.saveImageToPhotosAlbum({
            filePath: that.data.tempFilePath,
            success(rt) {
                that.azmShowToast({
                    text: '该海报已保存到您的手机相册，可以直接去分享啦~',
                    success(){
                        console.log(3);
                    }
                });
            },
            fail(){
                authorize.writePhotosAlbum(true)
                    .then(
                        res => {
                            console.log(res);
                        },
                        (res) => {
                            wx.showModal({
                                title: '',
                                content: '该海报保存到您的手机相册失败，可以预览海报，长按图片保存或发送朋友哦~',
                                confirmText: '预览',
                                cancelText: '取消',
                                success: function (res) {
                                    if (res.confirm) {
                                        that.openImage();
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })
                        }
                    );
            },
        })
    },
    openImage(){
        let that = this;
        wx.previewImage({
            current: that.data.tempFilePath, // 当前显示图片的http链接
            urls: [that.data.tempFilePath], // 需要预览的图片http链接列表
            complete(){
            }
        });
    }
};
Page(new utilPage(appPage, methods));