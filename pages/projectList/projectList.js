// pages/projectList/projectList.js
import util from '../../utils/util.js';
import api from '../../api/api.js';
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		deviceWidth: 0,
		deviceHeight: 0,
		firstCategoryList: [], //一级分类
		secondCateGoryList: [], //二级
		leftOtherArray: [], //每个一级分类下面的二级分类
		categoryType: 0,

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var that = this;
		//页面初始化options为页面跳转所带来的参数
		util.getSystemInfo({
			success: (res) => {
				that.setData({
					deviceWidth: res.windowWidth,
					deviceHeight: res.windowHeight
				});
			}
		});
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
    var that=this
		app.globalData.userOpenid && api.getAppSubjectLst({
			success: (res) => {
				console.log(res);
        that.updateCategoryListData(res.data.data);
			}
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},
	updateCategoryListData: function(categoryListArray) {
		var that = this;
		var leftArray = this.data.firstCategoryList;
		var rightArray = this.data.secondCateGoryList;
    for (let i in categoryListArray) {
      var object = categoryListArray[i];
      leftArray.push(i);
      rightArray.push(object);
     }
		// for(let i = 0; i < categoryListArray.length; i++) {
		// 	var object = categoryListArray[i];
		// 	if(object.menu == '1') {
		// 		leftArray.push(object);
		// 	} else if(object.menu == '2') {
		// 		rightArray.push(object);
		// 	}
		// }
		that.setData({
			firstCategoryList: leftArray,
			secondCateGoryList: rightArray
		})
	},
	tapCategory: function(event) {
		var that = this;
		console.log(event);
		if(event.target.id) {
			that.setData({
				categoryType: event.target.id,
			})
		}
		if(evnet.target.dataset.id) {
			var firstCategoryList = that.data.firstCategoryList;
			var secondCategoryArray = that.data.secondCateGoryList;
			var mutableTemArray = that.data.leftOtherArray;
			mutableTemArray.splice(0, mutableTemArray.length);
			for(let i = 0; i < secondCategoryArray.length; i++) {
				var item = secondCategoryArray[i];
				if(item.parentId == event.target.dataset.id) {
					mutableTemArray.push(item);
				}
			}
			that.setData({
				leftOtherArray: mutableTemArray
			})
		}
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})