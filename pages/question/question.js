// pages/question/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qitem: [{
      "title": "Q1.大标题",
      "isShow": true,
      "items": [{
        "title": "01,你持续喝咖啡多少年了？",
        "type": "radio",
        "options": [{
            name: 'USA',
            value: '美国'
          },
          {
            name: 'CHN',
            value: '中国',
            checked: 'true'
          },
          {
            name: 'BRA',
            value: '巴西'
          },
          {
            name: 'JPN',
            value: '日本'
          },
          {
            name: 'ENG',
            value: '英国'
          },
          {
            name: 'TUR',
            value: '法国'
          }
        ]
      }, {
        "title": "02,你持续喝咖啡多少年了？",
        "type": "checkbox",
        "options": [{
            name: 'USA',
            value: '美国'
          },
          {
            name: 'CHN',
            value: '中国',
            checked: 'true'
          },
          {
            name: 'BRA',
            value: '巴西'
          },
          {
            name: 'JPN',
            value: '日本'
          },
          {
            name: 'ENG',
            value: '英国'
          },
          {
            name: 'TUR',
            value: '法国'
          }
        ]
      }]
    }, {
        "title": "Q2.大标题2",
        "isShow": false,
        "items": [{
          "title": "01,你持续喝咖啡多少年了2？",
          "type": "radio",
          "options": [{
            name: 'USA',
            value: '美国'
          },
          {
            name: 'CHN',
            value: '中国',
            checked: 'true'
          },
          {
            name: 'BRA',
            value: '巴西'
          },
          {
            name: 'JPN',
            value: '日本'
          },
          {
            name: 'ENG',
            value: '英国'
          },
          {
            name: 'TUR',
            value: '法国'
          }
          ]
        }, {
          "title": "02,你持续喝咖啡多少年了？",
          "type": "checkbox",
          "options": [{
            name: 'USA',
            value: '美国'
          },
          {
            name: 'CHN',
            value: '中国',
            checked: 'true'
          },
          {
            name: 'BRA',
            value: '巴西'
          },
          {
            name: 'JPN',
            value: '日本'
          },
          {
            name: 'ENG',
            value: '英国'
          },
          {
            name: 'TUR',
            value: '法国'
          }
          ]
        }]
      }]
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  tagitem: function(e) {
    var index = e.target.dataset.index;
    var ndata = this.data.qitem;
    ndata[index].isShow = !ndata[index].isShow;
    this.setData({
      qitem: ndata
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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