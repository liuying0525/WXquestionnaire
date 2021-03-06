import api from '../../api/api.js';
import util from '../../utils/util.js';
var commonMixin = require('../../utils/commonMixin');

Page(Object.assign({

  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    qlist: {},
    qmlist: [],
    mustList: [],
    itemModList: [],
    tagaction: false,
    addres: "",
    deviceWidth: "",
    deviceHeight: "",
    src: "",
    toView: "",
    array: ['美国', '中国', '巴西', '日本'],
    tempFilePaths: '',
    answerList: [],
    oitem: {},
    anserResult: {},
    multistageIni: "",
    options: [{
      name: 'USA',
      value: '美国'
    },
    {
      name: 'CHN',
      value: '中国',
      checked: 'true'
    }
    ],
    relateSub: []
  },
  radioChange: function (e) {
    var _this = this;
    var txtValue = e.detail.value;
    var rsModel = this.data.anserResult;
    var id = e.currentTarget.dataset.id;
    var lindex = e.currentTarget.dataset.lindex;
    var oindex = e.currentTarget.dataset.oindex;
    var mindex = e.currentTarget.dataset.hasOwnProperty("mindex") ? e.currentTarget.dataset.mindex : "";
    var gData = this.data.qmlist;
    rsModel[id] = txtValue;
    var toViewid = "id_";

    rsModel[e.currentTarget.dataset.id] = txtValue;

    if (e.currentTarget.dataset.hasOwnProperty("mindex")) {
      for (var v = 0; v < gData[lindex].item[oindex].item[mindex].option.length; v++) {
        if (txtValue == gData[lindex].item[oindex].item[mindex].option[v].id) {
          // debugger
          toViewid = 'list' + gData[lindex].item[oindex].item[mindex].option[v].skip_sub;
        }
      }

    } else {
      // debugger
      //只有第一个选项才有跳转逻辑。可以看返回的字段。都不能选择了 选不选择什么的无所谓。功能早就做好了。现在是融入另一个功能。先把那个功能效果做出来了再回头调这个。

      for (var v = 0; v < gData[lindex].item[oindex].option.length; v++) {
        if (txtValue == gData[lindex].item[oindex].option[v].id) {
          // debugger
          toViewid = 'list' + gData[lindex].item[oindex].option[v].skip_sub;
        }
      }


    }
    //debugger
    _this.setData({
      anserResult: rsModel,
      toView: toViewid,
    });

  },
  saveLocation: function () {
    this.setData({
      toView: "list486"
    });
  },
  inputgetValue: function (e) {

    var txtValue = e.detail.value;
    var rsModel = this.data.anserResult;

    this.setData({
      anserResult: rsModel,

    });
  },
  checkboxChange: function (e) {

    var id = e.currentTarget.dataset.id;
    var lindex = e.currentTarget.dataset.lindex;
    var oindex = e.currentTarget.dataset.oindex;
    var mindex = e.currentTarget.dataset.hasOwnProperty("mindex") ? e.currentTarget.dataset.mindex : "";
    var gData = this.data.qmlist;
    var txtValue = e.detail.value.join(',');
    var rsModel = this.data.anserResult;
    rsModel[e.currentTarget.dataset.id] = txtValue;
    this.setData({
      anserResult: rsModel
    });
    var changeModel = {};
    if (e.currentTarget.dataset.hasOwnProperty("mindex")) {
      changeModel = gData[lindex].item[oindex].item[mindex];
    } else {
      changeModel = gData[lindex].item[oindex];
    }
    for (var k = 0; k < changeModel.option.length; k++) {
      changeModel.option[k].default_choose = "0";
      if (txtValue.indexOf(changeModel.option[k].id) != -1) {
        changeModel.option[k].default_choose = "1";
      }
    }
    if (e.currentTarget.dataset.hasOwnProperty("mindex")) {
      gData[lindex].item[oindex].item[mindex] = changeModel;
    } else {
      gData[lindex].item[oindex] = changeModel;
    }
  },
  bindPickerChange: function (e) {

    var lindex = e.currentTarget.dataset.lindex;
    var oindex = e.currentTarget.dataset.oindex;
    var pindex = e.currentTarget.dataset.pindex;
    var mindex = e.currentTarget.dataset.mindex;
    var options = e.currentTarget.dataset.options;

    var gData = this.data.qmlist;
    var pvalue = parseInt(e.detail.value);
    var picList = [];
    var result = options[pvalue];
    if (e.currentTarget.dataset.hasOwnProperty("mindex")) {
      var bindItem = gData[lindex].item[oindex].item[mindex];
    } else {
      var bindItem = gData[lindex].item[oindex];
    }
    var dmodel = bindItem.pickerList[pindex];
    dmodel.result = result;
    dmodel.pindex = pvalue;
    bindItem.pickerList[pindex] = dmodel;
    var maxDefault = parseInt(bindItem.option[0].default_choose);

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
      var noption = bindItem.option[0].option_name[pindex + 1].childList;
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
      bindItem.pickerList[pindex + 1] = pmodel;
    }
    this.setData({
      qmlist: gData
    });
  },
  slider4change: function (e) {
    var txtValue = e.detail.value;
    var rsModel = this.data.anserResult;
    rsModel[e.currentTarget.dataset.id] = txtValue;
    this.setData({
      anserResult: rsModel
    });
  },
  gotoShow: function () {
    var _this = this;

    if (this.data.tagaction) return;
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'http://114.92.40.170:58080/Api/Answer/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
          },
          name: 'file',
          formData: {
            'openid': wx.getStorageSync("userOpenid")
          },
          success(res) {
            const data = JSON.parse(res.data)
            //do something
            _this.setData({
              src: data.data.uploadPath
            })
            // api.uploadImage({
            //   success(data){
            //     console.log(data);
            //     debugger
            //   }
            // })
          }
        })
        // _this.setData({
        //   tagaction: true
        // })

      },

      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  chooseImage: function () {

    var _this = this;
    wx.previewImage({
      urls: _this.data.src,
    });
  },
  getLocation: function (lindex, oindex, id, mindex) {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // var latitude = res.latitude
        // var longitude = res.longitude
        wx.chooseLocation({
          success: function (res) {
            var addresname = res.address;
            var latitude = res.latitude;
            var longitude = res.longitude;
            var locationName = res.name;
            var rsModel = vm.data.anserResult;
            var gData = vm.data.qmlist;
            // rsModel[id] = addresname + "--" + locationName + ",latitude=" + latitude + ",longitude=" + longitude;
            rsModel[id] = {
              "addresname": addresname,
              "locationName": locationName
            }

            if (mindex != "") {
              gData[lindex].item[oindex].item[mindex].result = {
                "addresname": addresname,
                "locationName": locationName
              }
              //debugger
            } else {

              gData[lindex].item[oindex].result = {
                "addresname": addresname,
                "locationName": locationName
              }
            }
            vm.setData({
              qmlist: gData,
              anserResult: rsModel,
            });
          }
        })
      }
    })
  },
  getUserLocation: function (lindex, oindex, id, mindex) {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      vm.getLocation(lindex, oindex, id, mindex);
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
          vm.getLocation(lindex, oindex, id, mindex);
        } else {
          //调用wx.getLocation的API
          vm.getLocation(lindex, oindex, id, mindex);
        }
      }
    })
  },
  btnchoose(e) {
    var id = e.currentTarget.dataset.id;
    var lindex = e.currentTarget.dataset.lindex;
    var oindex = e.currentTarget.dataset.oindex;
    var mindex = e.currentTarget.dataset.mindex || "";
    this.getUserLocation(lindex, oindex, id, mindex);
  },
  tagitem: function (e) {
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
  onLoad: function (options) {
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
      var itemmodList = [];
      var AnserList = [];

      for (var i = 0; i < dist.length; i++) {

        var mm = dist[i];

        mm.isShow = i == 0 ? true : false;
        if (!!mm.mod && mm.mod.length != 0) { //mm.item[i].item！=0

          for (var j = 0; j < mm.mod.length; j++) {
            mm.mod[j].sub_cat = 'comprehensive';
            mm.mod[j].title = mm.mod[j].mod_name;
            if (mm.hasOwnProperty("item") && mm.item.length == 0) {
              mm.item = [];
            }
            mm.item.push(mm.mod[j]);
          }
          for (var w = 0; w < mm.item.length; w++) {
            var related = mm.item[w].serial_number;
            if (mm.item[w].hasOwnProperty("item")) {
              this.itemResult(mm.item[w].item, AnserList, related);
            }
          }
        }
        this.itemResult(mm.item, AnserList, related);
        nlist.push(mm);
      }
      this.setData({
        qlist: sData,
        qmlist: nlist
      });
    });
  },
  getData: function (uid) {
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
  itemResult: function (modelItem, AnserList, related) { //modelItem= mm.item

    for (var k = 0; k < modelItem.length; k++) {
      modelItem[k].serial_number = parseInt(modelItem[k].serial_number);
      if (modelItem[k].sub_cat == "single") {
        for (var q = 0; q < modelItem[k].option.length; q++) {
          if (modelItem[k].option[q].related_sub != "0") {
            relateSub.push("")
          }
          if (modelItem[k].result) {
            var df = "0";
            var res = modelItem[k].result;
            var rid = modelItem[k].option[q].id;
            if (res.indexOf(rid) != -1) {
              df = "1";
            }
            modelItem[k].option[q].default_choose = df;
          }
        }
      }
      if (modelItem[k].sub_cat == "multistage") {
        var picList = [];
        var count = parseInt(modelItem[k].option[0].default_choose);
        var resArrary = [];
        if (!!modelItem[k].result) {
          resArrary = modelItem[k].result.split(",");
        } else {
          for (var mm = 0; mm < count; mm++) {
            resArrary.push(0);
          }
        }
        var clist = modelItem[k].option[0].option_name;
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
                  if (clist[j].svalue != "" && modelItem[k].result == "") {
                    m == 0 && (pmodel.result = clist[j].svalue);
                  } else {
                    m == 0 && (pmodel.result = clist[j].options[m].value);
                  }
                  pmodel.options.push(clist[j].options[m].value);
                }
              }
            } else {
              for (var m = 0; m < clist[j].options.length; m++) {
                m == 0 && (pmodel.result = clist[j].options[m].value);
                pmodel.options.push(clist[j].options[m].value);
              }
            }
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
        modelItem[k].pickerList = picList;
      }
      if (modelItem[k].sub_cat == "multiple") {
        for (var q = 0; q < modelItem[k].option.length; q++) {
          if (modelItem[k].result) {
            var df = "0";
            var res = "," + modelItem[k].result + ",";
            var rid = "," + modelItem[k].option[q].id + ",";
            if (res.indexOf(rid) != -1) {
              df = "1";
            }
            modelItem[k].option[q].default_choose = df;
          }
        }
      }
      if (modelItem[k].sub_cat == "loCation") {

        if (modelItem[k].result && typeof (JSON.parse(modelItem[k].result)) == "object") {

          var nameAll = JSON.parse(modelItem[k].result);
          modelItem[k].result = nameAll;
          // JSON.parse(modelItem[k].result).addresname = nameAll.addresname;
          // JSON.parse(modelItem[k].result).locationName = nameAll.locationName;
        }

      }
      if (modelItem[k].sub_cat == "fractions") {
        if (modelItem[k].hasOwnProperty("result")) {
          //mm.item[k].result = 50;
        }
      }
      modelItem.sort(function (a, b) {
        return a.serial_number - b.serial_number;
      });
      // 结束


      if (modelItem[k].result) {

        AnserList.push({
          "id": modelItem[k].id,
          "result": modelItem[k].result
        })

        this.setData({
          answerList: AnserList
        })
      }
      if (modelItem[k].is_must == "1") {
        this.data.mustList.push({
          "id": modelItem[k].id,
          "questionname": modelItem[k].title
        });
      }

    }



  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDataInitialization(this.data.uid);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  savequestion: function (e) {

    var _this = this;
    // var anserList = this.data.answerList.push;
    console.log(JSON.stringify(this.data.anserResult));

    var forinModel = this.data.anserResult;
    for (var mkey in forinModel) {
      for (var i = 0; i < _this.data.answerList.length; i++) {
        if (_this.data.answerList[i].id == mkey) {

          _this.data.answerList.splice(i, 1)
        }
      }
      _this.data.answerList.push({
        "id": mkey,
        "result": forinModel[mkey]
      });
    }
    console.log(_this.data.answerList)
    var saveModel = {};
    saveModel.id = this.data.uid;
    // debugger
    saveModel.id = _this.data.qlist.sub_id ? _this.data.qlist.sub_id : _this.data.qlist.id
    saveModel.ans_status = e.target.dataset.save;
    // saveModel.data = JSON.stringify(anserList);

    for (var i = 0; i < this.data.answerList.length; i++) {
      if (typeof (this.data.answerList[i].result) == 'object') {
        this.data.answerList[i].result = JSON.stringify(this.data.answerList[i].result)
      }
    }
    saveModel.data = JSON.stringify(_this.data.answerList);
    if (e.target.dataset.save == "2") {
      for (var q = 0; q < _this.data.mustList.length; q++) {
        for (var b = 0; b < _this.data.answerList.length; b++) {
          if (!_this.data.answerList[b][_this.data.mustList[q].id]) {

            wx.showModal({
              title: '提示',
              content: "题目:" + _this.data.mustList[q].questionname + "为必答题，请作答后再提交",
              success: function (res) {
                // _this.getDataInitialization(_this.data.uid);
              }
            })
            return
          }
        }
      }
    }

    api.getAppAnswerSave({
      data: saveModel,
      success: (res) => {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: "保存成功！",
          success: function (res) {

          }
        })
        _this.getDataInitialization(this.data.uid);
      }
    });
    return;

    // var qmlist = _this.data.qmlist;
    // var answerList = [];
    // var setdata = [{
    //   "id": "380",
    //   "result": "44444"
    // }]
    // var dataList = JSON.stringify(setdata);
    // for (var i = 0; i < qmlist.length; i++) {
    //   for (var m = 0; m < qmlist[i].item.length; m++) {
    //     // if (qmlist[i][j].item[m].result == "") return;


    //     answerList.push({
    //       id: qmlist[i].item[m].id,
    //       result: qmlist[i].item[m].result
    //     })


    //   }

    // }
    // _this.setData({
    //   answerList: answerList
    // })

    // api.getAppAnswerSave({
    //   data: {
    //     id: _this.data.qlist.sub_id ? _this.data.qlist.sub_id : _this.data.qlist.id,

    //     ans_status: e.target,
    //     // data: _this.data.answerList
    //     data: dataList
    //   },
    //   success: (res) => {
    //     console.log(res)
    //     debugger
    //   }
    // })

  },
  submitquestion: function () {

  },
  submitSaveitem: function () {

  }
},
  commonMixin));