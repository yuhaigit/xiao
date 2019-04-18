const app = getApp();
Component({
	properties: {
		//小程序页面的表头
		title: {
			type: String,
			default: '六品打卡'
		},
		//是否展示返回和主页按钮
		showIcon: {
			type: Boolean,
			default: true
		},
		//背景颜色
		bgColor: {
			type: String,
			value: '#FFFFFF'
		},
	},

	data: {
		statusBarHeight: 0,
		titleBarHeight: 0
	},

  ready: function () {
    // 因为很多地方都需要用到，所有保存到全局对象中
    if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight
      });
    } else {
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          if (!app.globalData) {
            app.globalData = {}
		  }
          if (res.model.indexOf('iPhone') !== -1) {
            app.globalData.titleBarHeight = 44
          } else {
            app.globalData.titleBarHeight = 48
          }
          app.globalData.statusBarHeight = res.statusBarHeight
          that.setData({
            statusBarHeight: app.globalData.statusBarHeight,
            titleBarHeight: app.globalData.titleBarHeight
          });
        },
        failure() {
          that.setData({
            statusBarHeight: 0,
            titleBarHeight: 0
          });
        }
      })
    }
  },

  methods: {
    headerBack(event) {
    //   console.log('用户触发了返回上一页页面11------')
      // wx.navigateBack({
      //   delta: 1,
      //   fail(e) {
      //     wx.switchTab({
      //       url: '/pages/grouponList/main'
      //     })
      //   }
      // })
      var urlArray = wx.getStorageSync('urlArray');
      var urlmodel = urlArray.urlmodel;
      if (urlmodel==1){
        wx.switchTab({
          url: '/pages/home/home'
        })
      }else{
        wx.navigateBack({
          delta: 1,
          fail(e) {
            wx.switchTab({
              url: '/pages/home/home'
            })
          }
        })
      }
    },
    headerHome() {
    //   console.log('用户触发了返回首页------')
      wx.switchTab({
        url: '/pages/home/home'
      })
    }
  }
})
