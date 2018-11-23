//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    ratio: 102/152,
    originUrl: '',
    cropperResult: ''
  },
  uploadTap() {
    let _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log("1");
        console.log("res="+JSON.stringify(res));
        _this.setData({
          originUrl: res.tempFilePaths[0],
          cropperResult: ''
        })
      }
    })
  },
  getCropperImg(e) {
    console.log("2");
    console.log("e=" + JSON.stringify(e));
    this.setData({
      originUrl: '',
      cropperResult: e.detail.url
    })
  }
})
