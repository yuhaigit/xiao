//获取应用实例
var Wxmlify = require('../../components/wxmlify/wxmlify')
const app = getApp()

Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff",			//顶部导航背景颜色
    	


	},
	
  onReady:function(){
	
  },
  appUserlogin: function () {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //获取用户信息
          wx.getUserInfo({
            success: function (msg) {
              //发起网络请求
              wx.request({
                url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Logins&act=userLogin',
                method: 'POST',
                header: {
                  // 'content-type': 'application/json'
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  code: res.code,
                  encryptedData: msg.encryptedData,
                  iv: msg.iv
                },
                success: function (ress) {
                  var mid = ress.data.mid;
                  wx.setStorageSync('mid', mid);
                  var urlArray=wx.getStorageSync('urlArray');
                  var urlmodel = urlArray.urlmodel;
                  var urlAll = urlArray.urlAll;
                  if (urlmodel ==1){
                    wx.switchTab({
                      url: urlAll,
                    })
                  }else{
                    wx.redirectTo({
                      url: urlAll,
                    })
                  }
                  // that.onPullDownRefresh()//重点   重新执行下onLoad去获取当前的数据
                  // that.setData({
                  //   isLogindialog: false,
                  // })
                },
                fail: function (res) {
                  console.log(444)
                }
              })
            },
            fail: function (res) {
              console.log(777888)
              that.setData({
                isLogindialog: false,
              })
            }
          })
        }
      }
    });

  },
  onLoad(e){
 
   


		
	},

})