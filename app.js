App({
  onShow: function() {
    var _this = this;
    if (wx.getStorageSync("userOpenid")) {
      wx.login({
        success: (tdata) => {
          if (tdata.code) {
            wx.request({
              url: 'https://ffcmc.cn/index.php/Api/User/register',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                code: tdata.code
              },
              success: function(data) {
                _this.globalData.userInfo = data.data.data || {};
              }
            })
          }
        }
      });
    }else{
      wx.checkSession({
        success: function (chres) { },
        fail: function (chres) {
          wx.getSetting({
            success: (res) => {
              if (!!res.authSetting["scope.userInfo"]) {
                wx.login({
                  success: (data) => {
                    if (data.code) {
                      wx.getUserInfo({
                        withCredentials: true,
                        success: udata => {
                          console.log("udata=" + udata);
                        }
                      });
                    }
                  }
                });
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res);
                }
              } else {
                wx.switchTab({
                  url: '/pages/userInfo/userInfo',
                  fail: function () {
                    console.info("跳转失败");
                  }
                });
              }
            }
          });
        }
      });
    }
 
  },
  setWatcher(page) {
    let data = page.data;
    let watch = page.watch;
    Object.keys(watch).forEach(v => {
      let key = v.split('.'); // 将watch中的属性以'.'切分成数组
      let nowData = data; // 将data赋值给nowData
      for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
        nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
      }
      let lastKey = key[key.length - 1];
      // 假设key==='my.name',此时nowData===data['my']===data.my,lastKey==='name'
      let watchFun = watch[v].handler || watch[v]; // 兼容带handler和不带handler的两种写法
      let deep = watch[v].deep; // 若未设置deep,则为undefine
      this.observe(nowData, lastKey, watchFun, deep, page); // 监听nowData对象的lastKey
    })
  },
  observe(obj, key, watchFun, deep, page) {
    var val = obj[key];
    // 判断deep是true 且 val不能为空 且 typeof val==='object'（数组内数值变化也需要深度监听）
    if (deep && val != null && typeof val === 'object') {
      Object.keys(val).forEach(childKey => { // 遍历val对象下的每一个key
        this.observe(val, childKey, watchFun, deep, page); // 递归调用监听函数
      })
    }
    var that = this;
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        // 用page对象调用,改变函数内this指向,以便this.data访问data内的属性值
        watchFun.call(page, value, val); // value是新值，val是旧值
        val = value;
        if (deep) { // 若是深度监听,重新监听该对象，以便监听其属性。
          that.observe(obj, key, watchFun, deep, page);
        }
      },
      get: function() {
        return val;
      }
    })
  },
  globalData: {
    userInfo: null,
    userOpenid: "",
    currentTab:0,
  }
})　　　　