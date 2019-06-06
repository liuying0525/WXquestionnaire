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
    navTab: ['全部', '待提交', '已完成'],
    currentTab: 0,
    sendList: [],
    inputValue: ''
  },
  select: {
    page: 1,
    size: 6,
    isEnd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
    var that = this;
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
   this.setData({
     currentTab: app.globalData.currentTab
   })
    
    this.data.sendList = [];
    if (!wx.getStorageSync("userOpenid")) return;
    this.initialization("加载中");
    // console.log(this.data.sendList.length)
  },
  initialization: function(msg) {
    var _this=this;

    this.getData(msg).then(data => {
      
      _this.setData({
        sendList: _this.data.sendList.concat(data)
      });
      // debugger

    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.select.page = 1;
  app.globalData.currentTab=0;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.data.sendList = [];
    app.globalData.currentTab = 0;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.sendList = [];

    this.select = {
      page: 1,
      size: 6,
      isEnd: false
    }
    this.getData().then(data => {

    });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // console.log("this.data.isMore=" + this.data.isMore);
    if (this.select.isEnd) {
      return wx.showToast({
        title: '没有更多数据'
      });
    }
    var cpage = this.select.page + 1;
    this.setData({
      page: cpage,
    });


    var that = this;
    // var scrollHeight = (that.data.page+1) * that.data.deviceHeight
    //   wx.pageScrollTo({
    //     scrollTop: scrollHeight,
    //     duration: 0
    //   })
    this.getData("加载更多数据").then(data => { //
//       var oldsendList = this.data.sendList;
// debugger
//       this.setData({
//         sendList: oldsendList.concat(data)
//       });
    if (this.select.isEnd) {
      return wx.showToast({
        title: '没有更多数据'
      });
    }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  currentTab: function(e) {
    // debugger
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    this.select = {
      page: 1,
      size: 6,
      isEnd: false
    }
    this.data.sendList = [];
    this.setData({
      sendList: []
    });
   
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    this.getData()
  },
  getData: function(massege) {
    var _this = this;
   //if (_this.select.isEnd) return;
    var type = this.data.currentTab;
    return new Promise((resolve, reject) => {
      api.getAppAnswerLst({
        data: {
          p: _this.select.page,
          pageSize: _this.select.size,
          status: type,
          search: _this.data.inputValue || ""
        },
        success: (res) => {
          // debugger
          var content = res.data.data.data;
          var page_cuts = res.data.data.pageInfo.count / _this.select.size;
          if (Math.round(page_cuts)<=1 && !_this.select.isEnd){
            _this.setData({
              sendList: content
            })
            return
          }
          // if (_this.select.isEnd) return;
       
          // debugger
          // if (page_cuts > _this.select.page) {
          if (res.data.data.pageInfo.page >= _this.select.page) {
            _this.select.page++
            _this.setData({
              sendList: this.data.sendList.concat(content)
            })
          } else {
            _this.select.isEnd = true;
          }
          resolve(content);
          // console.log(this.data.sendList.length)
        },
        fail: res => {
          reject(res);
        }
      }, massege);
    });

  },
  tapName: function(e) {
    var uid = e.currentTarget.dataset.uid;
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
    // wx.redirectTo({
      url: '../question/question?uid=' + uid + '&answer_id=' + id

    })
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  confirm: function(e) {
    //this.select.page = 1;
    this.select = {
      page: 1,
      size: 6,
      isEnd: false
    };

    this.getData();
  }
})