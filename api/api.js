const app = getApp();
const host = 'http://218.81.97.41:58080/';
const wxRequest = (params, url, message) => {
	message = message || '加载中'
	wx.showToast({
		title: message,
		icon: 'loading'
	})

	params.data = params.data || {}
	//	params.data.openid = app.globalData.userOpenid;
	params.data.openid = wx.getStorageSync("userOpenid") || "";
	wx.request({
		url: url,
		data: params.data || {},
		method: params.method || 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
		header: params.header || {
			'Content-Type': 'application/x-www-form-urlencoded'
		}, // 设置请求的 header
		success: function(res) {
			// success
			params.success && params.success(res)
			wx.hideToast();
		},
		fail: function() {
			// fail
			params.fail && params.fail(res)
		},
		complete: function() {
			// complete
			params.complete && params.complete(res)
		}
	})

	//return new Promise(res,rej)
}

//我的项目 myproject
// const getAppLayoutamend = (params) => wxRequest(params, host + "Api/User/register")
// const getActsamend = (params) => wxRequest(params, host + "actsamend")

//项目列表 projectList
// const getGetCategoryRecommendList = (params) => wxRequest(params, host + "goods/GetCategoryRecommendList")
// const getCategoryListByMenuId = (params) => wxRequest(params, host + 'Goods/GetCategoryListByMenuId')

const getAppRegister = (params) => wxRequest(params, host + "Api/User/register")
const getAppSubjectLst = (params, message) => wxRequest(params, host + "Api/Subject/lst", message)

module.exports = {
	getAppRegister,
	getAppSubjectLst
}