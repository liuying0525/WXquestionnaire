import Handwriting from '../../component/handwriting/handwriting.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectColor: 'black',
    slideValue: 50,
    itemId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      itemId: options.itemId || 0
    });
    this.handwriting = new Handwriting(this, {
      lineColor: this.data.lineColor,
      slideValue: this.data.slideValue, // 0, 25, 50, 75, 100
    });
  },

  // 选择画笔颜色
  selectColorEvent(event) {
    var color = event.currentTarget.dataset.colorValue;
    var colorSelected = event.currentTarget.dataset.color;
    this.setData({
      selectColor: colorSelected
    })
    this.handwriting.selectColorEvent(color)
  },
  retDraw() {
    this.handwriting.retDraw()
  },
  // 笔迹粗细滑块
  onTouchStart(event) {
    this.startY = event.touches[0].clientY;
    this.startValue = this.format(this.data.slideValue)
  },
  onTouchMove(event) {
    const touch = event.touches[0];
    this.deltaY = touch.clientY - this.startY;
    this.updateValue(this.startValue + this.deltaY);
  },
  onTouchEnd() {
    this.updateValue(this.data.slideValue, true);
  },
  updateValue(slideValue, end) {
    slideValue = this.format(slideValue);
    this.setData({
      slideValue,
    });
    this.handwriting.selectSlideValue(this.data.slideValue)
  },
  format(value) {
    return Math.round(Math.max(0, Math.min(value, 100)) / 25) * 25;
  },
  subCanvas() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    var _this = this;
    wx.canvasToTempFilePath({
      canvasId: 'handWriting',
      fileType: 'jpg',
      success: function (res) {
        // wx.saveImageToPhotosAlbum({
        //   filePath: res.tempFilePath,
        //   success(res) {
        //     console.log(res)
        //     wx.hideLoading();
        //     wx.showToast({
        //       title: '保存成功',
        //     });
        //   },
        //   fail() {
        //     wx.hideLoading()
        //   }
        // })
        wx.uploadFile({
          url: "https://ffcmc.cn/index.php/Api/Answer/upload",
          filePath: res.tempFilePath,
          name: "file",
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
          },
          formData: {
            'openid': wx.getStorageSync("userOpenid")
          },
          success(res) {
            var resultUrl = "";
            try {
              resultUrl = "https://ffcmc.cn" + res.data.data.uploadPath;
            } catch (error) { } finally {
              resultUrl = "https://ffcmc.cn" + JSON.parse(res.data).data.uploadPath;
            }
            var upLoadUrlInfo = wx.getStorageSync("upLoadUrlInfo") || {};
            upLoadUrlInfo[_this.data.itemId] = resultUrl;
            wx.setStorageSync("upLoadUrlInfo", upLoadUrlInfo);
            wx.navigateBack();
          },
          fail: function () {
            wx.hideLoading()
          }
        })
      }
    })
  }
})