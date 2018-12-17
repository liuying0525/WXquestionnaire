
const app = getApp();
const host = 'https://ffcmc.cn/index.php/';
const wxRequest = (params, url, message) => {
	message = message || '加载中'
	wx.showToast({
		title: message,
		icon: 'loading'
	});
	params.data = params.data || {}
	//	params.data.openid = app.globalData.userOpenid;
  params.data.openid = app.globalData.userOpenid||wx.getStorageSync("userOpenid") || "";
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
      setTimeout(() => {
        wx.hideToast();
      },800);
		
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
const getAppAnswerLst = (params, massege) => wxRequest(params, host + "Api/Answer/lst", massege)
const getAppSubInfo = (params) => wxRequest(params, host + "Api/Subject/getSubInfo")
const getAppAreaInfo = (params) => wxRequest(params, host + "Api/Subject/getAreaInfo")
const getAppAnswerSave = (params) => wxRequest(params, host + "Api/Answer/save")
const uploadImage = (params) => wxRequest(params, host + "Api/Answer/upload")
const getAppEditInfo = (params) => wxRequest(params, host + "Api/User/editInfo")
const getAppIndex = (params) => wxRequest(params, host + "/Api/Company/index")

module.exports = {
	getAppRegister,
	getAppSubjectLst,
	getAppAnswerLst,
	getAppSubInfo,
	getAppAreaInfo,
  getAppAnswerSave,
  uploadImage,
  getAppEditInfo
}