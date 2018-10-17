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
    dataRight:[],
		isEnd: false//false是有更多数据，true是没有更多数据
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
  onPageScroll:function(e){
    console.log(e.scrollTop);
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
      //var arrary2=[];
			for(var k = 0; k < this.data.page_current * this.data.page_size; k++) {
				arrary1[k] && carrary.push(arrary1[k]);
			}
			var isUp = this.data.page_total> this.data.page_current;
      // debugger
			this.setData({
				sName: carrary[0],
				page_total: Math.ceil(arrary1.length / this.data.page_size),
				isEnd: isUp,
				dataLeft: arrary1
			});
			var arrary2=this.getRightArry(this.data.sName);
   
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
    // var getrightarry = [];
    // for (let i in this.data.dataAll) {
    //   for (let j = 0; j < this.data.dataAll[i].length; j++) {
    //     getrightarry.push(this.data.dataAll[i][j]);
    //   }

    // }
    // return getrightarry;
   
	 return this.data.dataAll[name];
	},
	// updateCategoryListData: function(categoryListArray) {
	// 	var that = this;
	// 	var leftArray = [];
	// 	var rightArray = [];
	// 	for(let i in categoryListArray) {
	// 		var object = categoryListArray[i];
	// 		leftArray = leftArray.concat(i);
	// 		for(let j = 0; j < object.length; j++) {
	// 			rightArray = rightArray.concat(object[j]);
	// 		}
	// 	}

	// 	if(that.data.page == 1) {
	// 		rightArray = []
	// 	}

	// 	if(rightArray.length > that.select.size) {
	// 		that.select.page++
	// 			that.select.isEnd = false;
	// 	} else {
	// 		that.select.isEnd = true;
	// 	}
	// 	that.setData({
	// 		firstCategoryList: leftArray,
	// 		secondCateGoryList: rightArray,
	// 	})
	// },
	getData: function(massege) {
		var _this = this;
    // debugger
		// if(!_this.data.isEnd) return;
 
		return new Promise((resolve, reject) => {
			api.getAppSubjectLst({
        data: { p: _this.data.page_current,pageSize:6},
				success: (res) => {
					_this.setData({
						dataAll: res.data.data,
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

    for (var i=0;i<30;i++){
      mutableTemArray.push(this.getRightArry(this.data.sName)[i])
    }
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
			isEnd: false
		});
		this.initialization("正在刷新数据");
    wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
    debugger
		if(this.data.isEnd) {
			return wx.showToast({
				title: '没有更多数据'
			});
		}
		wx.showLoading({
			title: '加载更多数据'
		});
    // this.getData("加载更多数据");
		var isUp = this.data.page_total > this.data.page_current++;
		this.setData({
			page_current: this.data.page_current,
			isEnd: isUp
		});
    this.getData("加载更多数据")
		var carrary = [];
		// for(var k = 0; k < this.data.page_current * this.data.page_size; k++) {
		// 	// this.data.dataLeft[k] && carrary.push(this.data.dataLeft[k]);
    //   var dataleftitem = this.data.dataLeft[k];
    //   dataleftitem && carrary.push(this.getRightArry(this.data.sName));
		// }
    carrary.push(this.getRightArry(this.data.sName))
		// setTimeout(() => {
		// 	this.setData({
		// 		firstCategoryList: carrary,
		// 	});
		// 	wx.hideLoading();
		// }, 1000);
    setTimeout(() => {
      this.setData({
        secondCateGoryList: carrary,
      });
      wx.hideLoading();
    }, 1000);
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