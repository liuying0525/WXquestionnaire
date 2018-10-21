import api from '../../api/api.js';
var commonMixin = require('../../utils/commonMixin')
Page(Object.assign({

    /**
     * 页面的初始数据
     */
    data: {
      uid: "",
      qlist: {},
      qmlist: [],
      tagaction: false,
      addres: "",
      src: "",
      array: ['美国', '中国', '巴西', '日本'],
      tempFilePaths: '',
      answerList: [],
      oitem: {},
      anserResult: {},
      multistageIni: ""
    },
    radioChange: function(e) {
      var txtValue = e.detail.value;
      var rsModel = this.data.anserResult;
      rsModel[e.currentTarget.dataset.id] = txtValue;
      this.setData({
        anserResult: rsModel
      });
    },
    inputgetValue: function(e) {
      var txtValue = e.detail.value;
      var rsModel = this.data.anserResult;
      rsModel[e.currentTarget.dataset.id] = txtValue;
      this.setData({
        anserResult: rsModel
      });
    },
    checkboxChange: function(e) {
      var txtValue = e.detail.value.join(',');
      var rsModel = this.data.anserResult;
      rsModel[e.currentTarget.dataset.id] = txtValue;
      this.setData({
        anserResult: rsModel
      });
    },
    bindPickerChange: function(e) {
      var lindex = e.currentTarget.dataset.lindex;
      var oindex = e.currentTarget.dataset.oindex;
      var pindex = e.currentTarget.dataset.pindex;
      var options = e.currentTarget.dataset.options;
      var gData = this.data.qmlist;
      var pvalue = parseInt(e.detail.value);
      var picList = [];
      var result = options[pvalue];
      var dmodel = gData[lindex].item[oindex].pickerList[pindex];
      dmodel.result = result;
      dmodel.pindex = pvalue;
      gData[lindex].item[oindex].pickerList[pindex] = dmodel;
      var maxDefault = parseInt(gData[lindex].item[oindex].option[0].default_choose);

      //保存选择的答案
      var rsModel = this.data.anserResult;
      var sarrary = new Array(maxDefault);
      var saveValue = "";
      sarrary[pindex] = pvalue;
      var mvalue = [];
      if (rsModel.hasOwnProperty(e.currentTarget.dataset.id)) {
        mvalue = rsModel[e.currentTarget.dataset.id].split(",");
        mvalue[pindex] = pvalue;
        saveValue = mvalue.join(",");
      } else {
        saveValue = sarrary.join(",");
      }
      rsModel[e.currentTarget.dataset.id] = saveValue;
      this.setData({
        anserResult: rsModel
      });

      if (maxDefault > (pindex + 1)) {
        var nresult = "";
        var noption = gData[lindex].item[oindex].option[0].option_name[pindex + 1].childList;
        var sooption = noption.filter(a => a.label == result);
        var pmodel = {};
        pmodel.kindex = "kindex_" + (pvalue + 1);
        if (sooption.length > 0) {
          var narrary = sooption[0].value.split(',');
          for (var m = 0; m < narrary.length; m++) {
            m == 0 && (nresult = narrary[m])
            picList.push(narrary[m]);
          }
        }
        pmodel.pindex = 0;
        pmodel.result = nresult;
        pmodel.options = picList;
        gData[lindex].item[oindex].pickerList[pindex + 1] = pmodel;
      }
      this.setData({
        qmlist: gData
      });
    },
    slider4change: function(e) {
      var txtValue = e.detail.value;
      var rsModel = this.data.anserResult;
      rsModel[e.currentTarget.dataset.id] = txtValue;
      this.setData({
        anserResult: rsModel
      });
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

      var _this = this;
      wx.previewImage({
        urls: _this.data.src,
      });
    },
    getLocation: function(lindex, oindex, id) {
      let vm = this;
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          // var latitude = res.latitude
          // var longitude = res.longitude
          wx.chooseLocation({
            success: function(res) {
              var addresname = res.address;
              var latitude = res.latitude;
              var longitude = res.longitude;
              var rsModel = vm.data.anserResult;
              var gData = vm.data.qmlist;
              rsModel[id] = addresname + ",latitude=" + latitude + ",longitude=" + longitude;
              gData[lindex].item[oindex].result = addresname;
              vm.setData({
                anserResult: rsModel,
                qmlist: gData
              });
            }
          })
        }
      })
    },
    getUserLocation: function(lindex, oindex, id) {
      let vm = this;
      wx.getSetting({
        success: (res) => {
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
            vm.getLocation(lindex, oindex, id);
          } else {
            //调用wx.getLocation的API
            vm.getLocation(lindex, oindex, id);
          }
        }
      })
    },
    btnchoose(e) {
      var id = e.currentTarget.dataset.id;
      var lindex = e.currentTarget.dataset.lindex;
      var oindex = e.currentTarget.dataset.oindex;
      this.getUserLocation(lindex, oindex, id);
    },
    tagitem: function(e) {
      var index = e.target.dataset.lindex;
      var ndata = this.data.qmlist;
      ndata[index].isShow = !ndata[index].isShow;
      this.setData({
        qmlist: ndata
      });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      var uid = options.uid;
      this.setData({
        uid: uid
      });
      this.getDataInitialization(this.data.uid);
    },
    getDataInitialization(uid) {
      this.getData(uid).then(res => {
        var sData = res;
        var dist = sData.mod;
        var nlist = [];
        for (var i = 0; i < dist.length; i++) {
          var mm = dist[i];
          mm.isShow = i == 0 ? true : false;
          for (var k = 0; k < mm.item.length; k++) {
            if (mm.item[k].sub_cat == "multistage") {
              var picList = [];
              var count = parseInt(mm.item[k].option[0].default_choose);
              var resArrary = mm.item[k].hasOwnProperty("result") ? mm.item[k].result.split(",") : new Array[count];
              //debugger
              var clist = mm.item[k].option[0].option_name;
              if (clist != null) {
                for (var j = 0; j < count; j++) {
                  var pmodel = {};
                  pmodel.kindex = "kindex_" + (j + 1);
                  pmodel.options = [];
                  pmodel.result = "";
                  if (j > 0) {
                    if (this.data.multistageIni != "") {
                      var noption = clist[j].childList.filter(a => a.label == this.data.multistageIni);
                      var narrary = noption[0].value.split(',');
                      for (var m = 0; m < narrary.length; m++) {
                        pmodel.options.push(narrary[m]);
                        if (resArrary[j] == m) {
                          pmodel.result = narrary[m];
                        }
                      }
                    } else {
                      for (var m = 0; m < clist[j].options.length; m++) {
                        m == 0 && (pmodel.result = clist[j].options[m].value);
                        pmodel.options.push(clist[j].options[m].value);
                      }
                    }
                  } else {
                    for (var m = 0; m < clist[j].options.length; m++) {
                      m == 0 && (pmodel.result = clist[j].options[m].value);
                      pmodel.options.push(clist[j].options[m].value);
                    }
                  }
                  debugger
                  pmodel.pindex = resArrary[j] == "" ? 0 : parseInt(resArrary[j]);
                  if (resArrary[j] != "") {
                    pmodel.result = pmodel.options[parseInt(resArrary[j])];
                  }
                  this.setData({
                    multistageIni: pmodel.result
                  });
                  picList.push(pmodel);
                }
              }
              mm.item[k].pickerList = picList;
            }
            if (mm.item[k].sub_cat == "multiple") {
              for (var q = 0; q < mm.item[k].option.length; q++) {
                if (mm.item[k].result) {
                  var df = "0";
                  var res = "," + mm.item[k].result + ",";
                  var rid = "," + mm.item[k].option[q].id + ",";
                  if (res.indexOf(rid) != -1) {
                    df = "1";
                  }
                  mm.item[k].option[q].default_choose = df;
                }
              }
            }
            if (mm.item[k].sub_cat == "loCation") {
              if (mm.item[k].result) {
                mm.item[k].result = mm.item[k].result.split(",")[0];
              }
            }
            if (mm.item[k].sub_cat == "fractions") {
              if (mm.item[k].hasOwnProperty("result")) {
                //mm.item[k].result = 50;
              }
            }

          }
          nlist.push(mm);
        }
        this.setData({
          qlist: sData,
          qmlist: nlist
        });
      });
    },
    getData: function(uid) {
      var _this = this;
      return new Promise((resolve, reject) => {
        api.getAppSubInfo({
          data: {
            id: uid
          },
          success: (res) => {
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

    },
    savequestion: function() {
      var _this = this;
      var anserList = [];
      console.log(JSON.stringify(this.data.anserResult));
      var forinModel = this.data.anserResult;
      for (var mkey in forinModel) {
        anserList.push({
          "id": mkey,
          "result": forinModel[mkey]
        });
      }
      var saveModel = {};
      saveModel.id = this.data.uid;
      saveModel.ans_status = "1";
      saveModel.data = JSON.stringify(anserList);
      api.getAppAnswerSave({
        data: saveModel,
        success: (res) => {
          console.log(res);
          wx.showModal({
            title: '提示',
            content: "保存成功！",
            success: function(res) {

            }
          })
          _this.getDataInitialization(this.data.uid);
        }
      });
      return;

      var qmlist = _this.data.qmlist;
      var answerList = [];
      var setdata = [{
        "id": "380",
        "result": "44444"
      }]
      var dataList = JSON.stringify(setdata);
      for (var i = 0; i < qmlist.length; i++) {
        for (var m = 0; m < qmlist[i].item.length; m++) {
          // if (qmlist[i][j].item[m].result == "") return;


          answerList.push({
            id: qmlist[i].item[m].id,
            result: qmlist[i].item[m].result
          })


        }

      }
      _this.setData({
        answerList: answerList
      })
      api.getAppAnswerSave({
        data: {
          id: _this.data.qlist.sub_id ? _this.data.qlist.sub_id : _this.data.qlist.id,

          ans_status: "1",
          // data: _this.data.answerList
          data: dataList
        },
        success: (res) => {
          console.log(res)
        }
      })
    },
    submitquestion: function() {

    },
    submitSaveitem: function() {

    }
  },
  commonMixin));