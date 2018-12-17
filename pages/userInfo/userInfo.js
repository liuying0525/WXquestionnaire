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
      "level_desc": "",
      "mobile": "",
      "addr": "",
    }, {
      "title": "公司简介",
      "isShow": false,
      "content": ""
    }]
  },
  onShow: function() {

  },

  onLoad: function() {
    var level_desc = (app.globalData && app.globalData.userInfo) ? app.globalData.userInfo.level_desc : "";
    var mobile = (app.globalData && app.globalData.userInfo) ? app.globalData.userInfo.mobile : "";
    var addr = (app.globalData && app.globalData.userInfo) ? app.globalData.userInfo.addr : "";
    var level = (app.globalData && app.globalData.userInfo) ? app.globalData.userInfo.level : "";
    if (wx.getStorageSync("userInfo")) {
      app.globalData.userInfo = wx.getStorageSync("userInfo");
      app.globalData.userInfo.level_desc = level_desc;
      app.globalData.userInfo.mobile = mobile;
      app.globalData.userInfo.addr = addr;
      app.globalData.userInfo.level = level;
      wx.setStorageSync("userInfo", app.globalData.userInfo);

    }
    //就是本地缓存
    if (app.globalData.userInfo) {
      var ndata = this.data.uitem;
      ndata[0].level_desc = app.globalData.userInfo.level_desc;
      ndata[0].mobile = app.globalData.userInfo.mobile;
      ndata[0].addr = app.globalData.userInfo.addr;
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        uitem: ndata
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
    var content = ndata[1].content;
    if (e.currentTarget.dataset.index == 1) {
      wx.request({
        url: 'https://ffcmc.cn/index.php/Api/Company/index',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          "openid": wx.getStorageSync("userOpenid")
        },
        success: function(res) {
          var content = res.data.data.introduction;
          var ndata = _this.data.uitem;
          ndata[1].content = content;
          _this.setData({
            uitem: ndata
          });
        }
      })
    }
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
    if (!(/^1[34578]\d{9}$/.test(e.detail.value)) && e.detail.value != "") {
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
  },
  onPullDownRefresh: function() {
    var that = this;
    wx.login({
      success: (tdata) => {
        if (tdata.code) {
          wx.request({
            url: 'https://ffcmc.cn/index.php/Api/User/register',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: tdata.code
            },
            success: function(data) {
              //app.globalData.userInfo = data.data.data;
              var ndata = that.data.uitem;
              var storageModel = wx.getStorageSync("userInfo");
              ndata[0].level_desc = data.data.data.level_desc;
              ndata[0].mobile = data.data.data.mobile;
              ndata[0].addr = data.data.data.addr;

              storageModel.level_desc = data.data.data.level_desc;
              storageModel.mobile = data.data.data.mobile;
              storageModel.addr = data.data.data.addr;
              storageModel.level = data.data.data.level;

              that.setData({
                uitem: ndata
              });
              wx.setStorageSync("userInfo", storageModel);
            }
          })
        }
      }
    })
    wx.stopPullDownRefresh(); //  下拉关闭 
  }
})