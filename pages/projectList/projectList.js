// pages/projectList/projectList.js
import util from '../../utils/util.js';
import api from '../../api/api.js';
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		deviceWidth: 0,
		deviceHeight: 0,
		firstCategoryList: [], //一级分类
		secondCateGoryList: [], //二级
		leftOtherArray: [], //每个一级分类下面的二级分类
		categoryType: 0,
		dataAll: {},
		sName: "",
		page_size: 10,
		page_current: 1,
		page_total: 0,
		dataLeft: [],
		isEnd: true,
    itemStatus:""
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var that = this;
		//页面初始化options为页面跳转所带来的参数 res.windowHeight
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
		if(!wx.getStorageSync("userOpenid")) return;
		this.initialization("加载中");
	},
	initialization: function(msg) {
		this.getData(msg).then(data => {
			var arrary1 = this.getLeftArrary(data);
			var carrary = [];
			for(var k = 0; k < this.data.page_current * this.data.page_size; k++) {
				arrary1[k] && carrary.push(arrary1[k]);
			}
			var isUp = this.data.page_total <= this.data.page_current;
			this.setData({
				sName: carrary[0],
				page_total: Math.ceil(arrary1.length / this.data.page_size),
				isEnd: isUp,
				dataLeft: arrary1
			});
			var arrary2 = this.getRightArry(this.data.sName);
			this.setData({
				firstCategoryList: carrary,
				secondCateGoryList: arrary2
			});
		});
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
	getRightArry: function(name) {
		return this.data.dataAll[name];
	},
	updateCategoryListData: function(categoryListArray) {

		//		var leftArray =this.firstCategoryList;
		//		var rightArray = this.secondCateGoryList;
		//		for(let i in categoryListArray) {
		//			var object = categoryListArray[i];
		//			leftArray = leftArray.concat(i);
		//			for(let j = 0; j < object.length; j++) {
		//				rightArray = rightArray.concat(object[j]);
		//			}
		//		}
		//		
		//		return;
		var that = this;
		var leftArray = [];
		var rightArray = [];

		// var leftOtherlist = this.data.leftOtherArray;
		for(let i in categoryListArray) {
			var object = categoryListArray[i];
			leftArray = leftArray.concat(i);
			for(let j = 0; j < object.length; j++) {
				rightArray = rightArray.concat(object[j]);
			}
		}
		// for(let i = 0; i < categoryListArray.length; i++) {
		// 	var object = categoryListArray[i];
		// 	if(object.menu == '1') {
		// 		leftArray.push(object);
		// 	} else if(object.menu == '2') {
		// 		rightArray.push(object);
		// 	}
		// }

		if(that.data.page == 1) {
			rightArray = []
		}

		if(rightArray.length > that.select.size) {
			that.select.page++
				that.select.isEnd = false;
		} else {
			that.select.isEnd = true;
		}
		that.setData({
			firstCategoryList: leftArray,
			secondCateGoryList: rightArray,
			// leftOtherArray: leftOtherlist
		})
	},
	getData: function(massege) {
		var _this = this;
		if(!_this.data.isEnd) return;
		return new Promise((resolve, reject) => {
			api.getAppSubjectLst({
				success: (res) => {
          var itemstatus = res.data.data.status
          if(itemstatus=="2"){
            itemstatus="可编辑"
          }else{
            itemstatus="已关闭"
          }
					_this.setData({
						dataAll: res.data.data,
            itemStatus: itemstatus
					});
					resolve(res.data.data);
				},
				fail: res => {
					reject(res);
				}
			}, massege);
		});
	},
	getLeftArrary: function(dataAll) {
		var leftArrary = [];
		for(var keyName in dataAll) {
			leftArrary.push(keyName);
		}
		return leftArrary;
	},
	tapCategory: function(event) {
		var that = this;
		that.setData({
			categoryType: event.target.dataset.id,
			sName: event.target.dataset.name,
		});
		var mutableTemArray = this.getRightArry(this.data.sName);
		that.setData({
			secondCateGoryList: mutableTemArray
		});
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {
		this.setData({
			dataAll: {},
			sName: "",
			page_size: 10,
			page_current: 1,
			page_total: 0,
			isEnd: true
		});
		this.initialization("正在刷新数据");
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		if(!this.data.isEnd) {
			return wx.showToast({
				title: '没有更多数据'
			});
		}
		wx.showLoading({
			title: '加载更多数据'
		});
		var isUp = this.data.page_total <= this.data.page_current++;
		this.setData({
			page_current: this.data.page_current++,
			isEnd: isUp
		});
		var carrary = [];
		for(var k = 0; k < this.data.page_current * this.data.page_size; k++) {
			this.data.dataLeft[k] && carrary.push(this.data.dataLeft[k]);
		}
		setTimeout(() => {
			this.setData({
				firstCategoryList: carrary,
			});
			wx.hideLoading();
		}, 2000);
	},
tapName:function(){
	wx.navigateTo({
  url: '../question/question'
})
},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})