//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    uitem: [{
      "title": "个人资料",
      "isShow": false,
      "userLevel": wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo").level : "",
      "iphone": wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo").mobile : "",
      "address": wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo").addr : "",
    }, {
      "title": "公司简介",
      "isShow": false,
      "content": "内容内容内容内容内容"
    }]
  },
  onShow: function() {
    if (!wx.getStorageSync("userInfo")) return;
    var ndata = this.data.uitem;
    ndata[0].userLevel = wx.getStorageSync("userInfo").level;
    this.setData({
      uitem: ndata
    });
  },
  onLoad: function() {
    wx.getStorageSync("userInfo") && (app.globalData.userInfo = wx.getStorageSync("userInfo"))
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    var pdata = e.detail.userInfo;
    var that = this;
    app.globalData.userInfo = pdata;
    wx.login({
      success: (data) => {
        if (data.code) {
          pdata.code = data.code;
          wx.getUserInfo({
            withCredentials: true,
            success: udata => {
              wx.request({
                url: 'http://114.92.40.170:58080/Api/User/register',
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: pdata,
                success: function(data) {
                  app.globalData.userOpenid = data.data.data.openid;
                  wx.setStorageSync("userOpenid", data.data.data.openid);
                  app.globalData.userInfo.level = data.data.data.level;
                  app.globalData.userInfo.addr = data.data.data.addr;
                  app.globalData.userInfo.mobile = data.data.data.mobile;
                  wx.setStorageSync("userInfo", app.globalData.userInfo);
                  that.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true
                  });
                  //									wx.navigateBack({
                  //										delta: 1
                  //									});
                  // wx.switchTab({
                  //   url: '/pages/projectList/projectList',
                  //   fail: function() {}
                  // });
                }
              });
            }
          });
        }
      }
    });

    //		if(getCurrentPages()[0].route == "pages/userInfo/userInfo") {
    //			wx.switchTab({
    //				url: "/pages/projectList/projectList"
    //			})
    //		} else {
    //
    //		
    //		}

  },
  tagitem: function(e) {
    if (!wx.getStorageSync("userInfo")) return;
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var ndata = _this.data.uitem;
    ndata[index].isShow = !ndata[index].isShow;
    _this.setData({
      uitem: ndata
    });
  },
  bindAddressInput: function(e) {
    var _this = this;
    var ndata = _this.data.uitem;
    ndata[0].address = e.detail.value;
    _this.setData({
      uitem: ndata
    })
  },
  bindIphoneInput: function(e) {
    var _this = this;
    var ndata = _this.data.uitem;
    ndata[0].iphone = e.detail.value;
    _this.setData({
      uitem: ndata
    })
  }
})