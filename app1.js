//app.js
App({
  onLaunch: function() {
    const APPID = "wxc80a0f494793af50";
    const SECRET = "f34193b1b40a4c54d080a08a501cf661";
    let JSCODE = "";

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          JSCODE = res.code;
          // console.log(APPID + '-' + SECRET + '-' + JSCODE)         
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            data: {
              appid: APPID,
              secret: SECRET,
              js_code: JSCODE,
              grant_type: "authorization_code"
            },
            success: function (data) {
              // console.log(data);
              // 获取用户信息
              wx.getSetting({
                success: des => {
                  // console.log(des.authSetting);
                  if (des.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: msg => {
                        // 可以将 res 发送给后台解码出 unionId
                        // this.globalData.userInfo = res.userInfo
                        // console.log(msg)
                        msg.userInfo.openid = data.data.openid
                        wx.request({
                          url: 'http://218.81.97.41:58080/Api/User/register',
                          method: 'POST',
                          header: {
                            'content-type':'application/x-www-form-urlencoded'
                          },
                          data: msg.userInfo,
                          success: function (data) {
                          },
                          fail: function (res) {
                            // cosole.log(res);
                          }
                        })
                        // console.log(res);
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        // if (this.userInfoReadyCallback) {
                        //   this.userInfoReadyCallback(res)
                        // }
                      }
                    })
                  }
                }
              })
            },
            fail: function (res) {
              cosole.log(res);
            }
          })
        }
      }
    });
  },
  globalData: {
    userInfo: null,

  },
})