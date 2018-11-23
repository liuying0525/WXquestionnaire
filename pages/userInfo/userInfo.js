import api from '../../api/api.js';
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
      "mobile": wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo").mobile : "",
      "addr": wx.getStorageSync("userInfo") ? wx.getStorageSync("userInfo").addr : "",
    }, {
      "title": "公司简介",
      "isShow": false,
      "content": "内容内容内容内容内容"
    }]
  },
  onShow: function() {
    // if (!wx.getStorageSync("userInfo")) return;
    var ndata = this.data.uitem;
    ndata[0].level_desc = wx.getStorageSync("userInfo").level_desc;
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
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.login({
      success: (data) => {
        if (data.code) {
          pdata.code = data.code;
          wx.getUserInfo({
            withCredentials: true,
            success: udata => {
              wx.request({
                url: 'https://ffcmc.cn/index.php/Api/User/register',
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: pdata,
                success: function(data) {
                  var ndata = that.data.uitem;
                  app.globalData.userOpenid = data.data.data.openid;
                  wx.setStorageSync("userOpenid", data.data.data.openid);
                  app.globalData.userInfo.level = data.data.data.level;
                  ndata[0].level_desc = data.data.data.level_desc;
                  app.globalData.userInfo.addr = data.data.data.addr;
                  app.globalData.userInfo.level_desc = data.data.data.level_desc;
                  ndata[0].addr = data.data.data.addr;
                  app.globalData.userInfo.mobile = data.data.data.mobile;
                  ndata[0].mobile = data.data.data.mobile;
                  wx.setStorageSync("userInfo", app.globalData.userInfo);
                  that.setData({
                    uitem: ndata
                    
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
    ndata[0].addr = e.detail.value;
    api.getAppEditInfo({
      data: {
        "addr": e.detail.value
      },
      success: res => {
        app.globalData.userInfo.addr = e.detail.value

        _this.setData({
          uitem: ndata
        });
        setTimeout(() => {
          return wx.showToast({
            title: '地址保存成功',
            icon: 'success',
            mask: true,
            duration: 2000
          });
        });
      }
    });
  },
  bindIphoneInput: function(e) {
    var _this = this;
    var ndata = _this.data.uitem;
    ndata[0].mobile = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(e.detail.value))&&e.detail.value!="") {
      wx.showModal({
        title: '提示',
        content: "手机号输入错误请重新输入",
        success: function(res) {
          ndata[0].mobile = ""
          _this.setData({
            uitem: ndata
          });
        }
      })
      return false;
    } else {
      api.getAppEditInfo({
        data: {
          "mobile": e.detail.value
        },
        success: res => {
          app.globalData.userInfo.mobile = e.detail.value
        
          _this.setData({
            uitem: ndata
          });
          setTimeout(() => {
            return wx.showToast({
              title: '电话保存成功',
              icon: 'success',
              mask: true,
              duration: 2000
            });
          });
        }
      });
    }
  }
})