App({
	onLaunch: function() {
		wx.checkSession({　　　　
			success: function(chres) {},
			fail: function(chres) {
				wx.getSetting({
					success: (res) => {
						if(res.authSetting["scope.userInfo"]) {
							wx.login({
								success: (data) => {
									if(data.code) {
										wx.getUserInfo({
											withCredentials: true,
											success: udata => {
												console.log("udata=" + udata);
											}
										});
									}
								}
							});
							if(this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res);
							}
						} else {
							wx.switchTab({
								url: '/pages/userInfo/userInfo',
								fail: function() {
									console.info("跳转失败");
								}
							});
						}
					}
				});
			}
		});
	},
	globalData: {
		userInfo: null,
		userOpenid: "",
	}
})　　　　