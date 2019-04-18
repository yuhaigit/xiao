/**
 * dist版本号
 * v0.5.7
 * 注：picker-column下index生命周期待官方修复,本地已完善
 */

// var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./utils/config')
var md5 = require('./utils/MD5')
const token = md5.md5(config.service.systemdate+config.service.token);
App({
  onLaunch: function () {
      // 获取小程序更新机制兼容
      if (wx.canIUse('getUpdateManager')) {
          console.log(8888);
          const updateManager = wx.getUpdateManager()
          updateManager.onCheckForUpdate(function (res) {
              // 请求完新版本信息的回调
              if (res.hasUpdate) {
                  updateManager.onUpdateReady(function () {
                      wx.showModal({
                          title: '更新提示',
                          content: '新版本已经准备好，是否重启应用？',
                          success: function (res) {
                              if (res.confirm) {
                                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                  updateManager.applyUpdate()
                              }
                          }
                      })
                  })
                  updateManager.onUpdateFailed(function () {
                      // 新的版本下载失败
                      wx.showModal({
                          title: '已经有新版本了哟~',
                          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                      })
                  })
              }
          })
      } else {
          console.log(999);
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          wx.showModal({
              title: '提示',
              content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
      }

  },
  loginOauth: function (urlmodel, urlAll,gotype=1) {
     var mid = wx.getStorageSync('mid');
     var urlmodel;
     var urlAll;
     var gotype;
      if (mid == "") {
        var urlArray = {
          urlmodel,
          urlAll
        }
        wx.setStorageSync('urlArray', urlArray);
        if (gotype==1){
          wx.navigateTo({
            url: "/pages/loginUser/loginUser",
          });
        }else{
          wx.redirectTo({
            url: "/pages/loginUser/loginUser",
          });
        }
         return 0;
      }else{
        return 1;
      }
  },
	getUsersFormid_2sk_er3: function (e) {
			let mid = wx.getStorageSync('mid');
			console.log('----获取用户formId值------');
			console.log(e.detail.formId);
			let formId = e.detail.formId ;
			if( formId !== 'the formId is a mock one' ){
				wx.request({
			    url: config.service.host+'/index.php?app=dakaprogram&mod=Clock&act=save_formid',
			    data: {mid:mid,formId:formId,token: token},
			    method: 'POST',
			    header: {
			        "Content-Type": "application/x-www-form-urlencoded"
			    },
			    success: function (res) {
							console.log('--id save success--')
			        console.log(res);
			    },
				})
			}
	},

  globalData: {
        navHeight:0,
        userInfo: null,
        config_host: config.service.host,
        token:token,
        statusBarHeight: 0,
        titleBarHeight: 0,
        sdkappid: '1400188708',
        accountType: '36862'
    }
})