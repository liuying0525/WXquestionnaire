// pages/question/question.js

import api from '../../api/api.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    qlist:{},
    tagaction: false,
    addres: "",
    src: "",
    tempFilePaths: '',
    region: ['广东省', '广州市', '海珠区'],
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
        },
        {
          "title": "03,请输入您的姓名",
          "type": "fill",
          "placeholder": "请输入您的姓名",
          "inputValue": ""
        },
        {
          "title": "04,评分题：对项目进行评分",
          "type": "fraction",
        },
        {
          "title": "05,位置上传",
          "type": "loCation"
        },
        {
          "title": "06,图片上传",
          "type": "uploadimg",

        },
        {
          "title": "07,多级下拉",
          "type": "multistage"
        }






      ]
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
  bindKeyInput: function(e) {
    // this.setData({
    //   inputValue: e.detail.value
    // })
  },
  slider4change: function(e) {
    console.log(e.detail.value)
  },
  gotoShow: function() {
    var _this = this;


    if (this.data.tagaction) return;
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        // success
        console.log(res)
        _this.setData({
          src: res.tempFilePaths
        })
        const tempFilePaths = res.tempFilePaths
        // wx.uploadFile({
        //   url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        //   filePath: tempFilePaths[0],
        //   name: 'file',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success(res) {
        //     const data = res.data
        //     debugger
        //     //do something
        //   }
        // })
        _this.setData({
          tagaction: true
        })

      },

      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  chooseImage: function() {
    debugger
    var _this = this;
    wx.previewImage({
      urls: _this.data.src,
    });
  },
  getLocation: function() {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //vm.getLocal(latitude, longitude);
        wx.chooseLocation({
          success: function(res) {
            vm.setData({
              "addres": res.name + "===" + res.latitude + "----" + res.longitude
            });
          }
        })
        // wx.openLocation({
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        //   scale: 18,
        //   success: function (res) {
        //     wx.chooseLocation({
        //       success: function (res) {
        //         vm.setData({ "addres": res.name + "===" + res.latitude + "----" + res.longitude });
        //       }
        //     })
        //   }
        // })
      }
    })
  },
  getUserLocation: function() {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  btnchoose() {

    this.getUserLocation();
  },
  tagitem: function(e) {
    var index = e.target.dataset.index;
    var ndata = this.data.qitem;

    ndata[index].isShow = !ndata[index].isShow;
    this.setData({
      qitem: ndata
    });
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var uid = options.uid;
    this.setData({
      uid: uid
    });
    this.getData(this.data.uid);
  },
  getData: function (uid) {
    var _this = this;
    return new Promise((resolve, reject) => {
      api.getAppSubInfo({
        data: {
          id: uid
        },
        success: (res) => {
          debugger
          _this.setData({
            qlist: res.data.data,
          });
          resolve(res.data.data);
        },
        fail: res => {
          reject(res);
        }
      });
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