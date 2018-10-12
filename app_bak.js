//app.js

//wx.getSetting({
//									success: (res) => {
//										if(res.authSetting['scope.userInfo']) {
//											// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框  现在是未授权，怎么可能进这个if呢 。这是已授权才进的
//
//											wx.getUserInfo({
//
//												success: (msg) => {
//													debugger
//													this.globalData.userInfo = msg.userInfo
//													wx.request({
//														url: 'http://218.81.97.41:58080/Api/User/register',
//														method: 'POST',
//														header: {
//															'content-type': 'application/x-www-form-urlencoded'
//														},
//														data: msg.userInfo,
//														success: (res) => {
//															debugger
//															this.globalData.userOpenid = res.data.data.openid;
//															console.log("this.globalData.userOpenid=" + this.globalData.userOpenid);
//
//															if(this.openIdReadyCallback) {
//																this.openIdReadyCallback(res);
//															}
//														}
//													});
//												}
//											});
//											// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//											// 所以此处加入 callback 以防止这种情况
//											if(this.userInfoReadyCallback) {
//												this.userInfoReadyCallback(res)
//											}
//										} else {
//											wx.switchTab({
//												url: '../userInfo/userInfo',
//												fail: function() {
//													console.info("跳转失败")
//												}
//											})
//										}
//									}
//								})
//							}