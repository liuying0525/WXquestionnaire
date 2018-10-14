//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	onLoad: function() {
		if(app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if(this.data.canIUse) {
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
				if(data.code) {
					pdata.code = data.code;
					wx.getUserInfo({
						withCredentials: true,
						success: udata => {
							wx.request({
								url: 'http://218.81.97.41:58080/Api/User/register',
								method: 'POST',
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								data: pdata,
								success: function(data) {
									app.globalData.userOpenid = data.data.data.openid;
									wx.setStorageSync("userOpenid", data.data.data.openid);
									that.setData({
										userInfo: app.globalData.userInfo,
										hasUserInfo: true
									});
									//									wx.navigateBack({
									//										delta: 1
									//									});
									wx.switchTab({
										url: '/pages/projectList/projectList',
										fail: function() {
										}
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

	}
})