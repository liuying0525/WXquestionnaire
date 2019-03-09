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
    sName: "", //选中区域
    page_size: 6, //每页显示条数
    page_current: 1, //当前页
    page_count: 1, //总页数
    dataLeft: [], //左边区域
    dataRight: [], //右边题列表
    isMore: true, //true是有更多数据，false是没有更多数据,
    inputValue: ''
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
  onPageScroll: function(e) {
    // console.log(e.scrollTop);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!wx.getStorageSync("userOpenid")) return;
    this.initialization("加载中");
  },
  initialization: function(msg) {
    this.getLeftArrary().then((res) => {
      var leftArrary = res || [];
      this.setData({
        firstCategoryList: res,
        sName: this.data.sName || (leftArrary[0] ? leftArrary[0] : "")
      });
      this.getRightArrary(msg).then((data) => {
        this.setData({
          secondCateGoryList: data
        });
      });
    });

    //		this.getData(msg).then(data => {
    //			// var arrary1 = this.getLeftArrary();
    //
    //			var arrary2 = [];
    //			// for (var k = 0; k < this.data.page_current * this.data.page_size; k++) {
    //
    //			var arrary2 = this.getRightArry();
    //			// debugger
    //			this.setData({
    //				// firstCategoryList: carrary,
    //				secondCateGoryList: arrary2
    //			});
    //		});
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      page_current: 1
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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

    // if(!_this.data.isEnd) return;
    this.getLeftArrary().then(data => {

      return new Promise((resolve, reject) => {

        var isUp = _this.data.page_total > _this.data.page_current;

        api.getAppSubjectLst({
          data: {
            area_belong: data[0],
            p: _this.data.page_current,
            pageSize: 6,
            search: _this.data.inputValue || ""
          },
          success: (res) => {

            _this.setData({
              dataAll: res.data.data.data,
            });
            resolve(res.data.data);
          },
          fail: res => {
            reject(res);
          }
        }, massege);
      });

    })

  },
  // getLeftArrary: function(dataAll) {
  //   var leftArrary = [];
  //   for (var keyName in dataAll) {
  //     leftArrary.push(keyName);
  //   }
  //   return leftArrary;
  // },
  getRightArrary: function(msg) {
    var _this = this;
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    return new Promise((resolve, reject) => {
      api.getAppSubjectLst({
        data: {
          area_belong: _this.data.sName || "",
          p: _this.data.page_current,
          pageSize: _this.data.page_size,
          search: _this.data.inputValue || ""
        },
        success: (res) => {
          var pageCount = res.data.data.pageInfo.page || 0;

          var isM = pageCount > _this.data.page_current;
          _this.setData({
            page_count: pageCount,
            isMore: isM
          });
          resolve(res.data.data.data);
        },
        fail: res => {
          reject(res);
        }
      }, msg);
    });
  },
  getLeftArrary: function(msg) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    var _this = this;
    return new Promise((resolve, reject) => {
      api.getAppAreaInfo({
        success: (res) => {
          resolve(res.data.data);
        },
        fail: res => {
          reject(res);
        }
      }, msg);
    })
  },
  tapCategory: function(event) {
    var that = this;
    that.setData({
      categoryType: event.target.dataset.id,
      sName: event.target.dataset.name || "",
    });
    that.setData({
      page_size: 6,
      page_current: 1,
      page_total: 0,
      isEnd: true,
      secondCateGoryList: []
    });
    this.getRightArrary().then(data => {
      that.setData({
        secondCateGoryList: data
      });
    });
    // 
    // var mutableTemArray=[];
    //		var mutableTemArray = this.getRightArry();
    // debugger
    // for (var i = 0; i < 30; i++) {

    // mutableTemArray.push(this.getRightArry(this.data.sName)[i])

    // }
    //		that.setData({
    //			secondCateGoryList: mutableTemArray
    //		});
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      page_size: 6,
      page_current: 1,
      page_total: 0,
      isEnd: false,
      secondCateGoryList: []
    });
    this.initialization();
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // console.log("this.data.isMore=" + this.data.isMore);
    if (!this.data.isMore) {
      return wx.showToast({
        title: '没有更多数据'
      });
    }
    var cpage = this.data.page_current + 1;
    this.setData({
      page_current: cpage,
    });
    this.getRightArrary("加载更多数据").then(data => { //
      this.setData({
        secondCateGoryList: this.data.secondCateGoryList.concat(data)
      });
    });
    //		var isUp = this.data.page_total > this.data.page_current++;
    //		this.setData({
    //			page_current: this.data.page_current,
    //			isEnd: isUp
    //		});
    //		this.getData("加载更多数据")
    //		var carrary = [];
    // for(var k = 0; k < this.data.page_current * this.data.page_size; k++) {
    // 	// this.data.dataLeft[k] && carrary.push(this.data.dataLeft[k]);
    //   var dataleftitem = this.data.dataLeft[k];
    //   dataleftitem && carrary.push(this.getRightArry(this.data.sName));
    // }
    // debugger
    //		carrary.push(this.getRightArry())
    //		// setTimeout(() => {
    //		// 	this.setData({
    //		// 		firstCategoryList: carrary,
    //		// 	});
    //		// 	wx.hideLoading();
    //		// }, 1000);
    //		setTimeout(() => {
    //			this.setData({
    //				secondCateGoryList: carrary,
    //			});
    //			wx.hideLoading();
    //		}, 1000);
  },
  tapName: function(e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '../question/question?uid=' + uid + '&que=1'
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  confirm: function(e) {
    var that=this;
    this.setData({
      page_size: 6,
      page_current: 1,
      page_total: 0,
      isEnd: true,
      secondCateGoryList: []
    });
    this.getRightArrary().then(data => {
      that.setData({
        secondCateGoryList: data
      });
    });

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})