// pages/guanFangMsg/guanFangMsg.js
var Wxmlify = require('../../components/wxmlify/wxmlify')
var WxParse = require('../../components/wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
    bgColor: '#fff', //顶部导航背景颜色,
    showIcon:true,
    bgColor:'#fff',
    type:'',
    listArr:[],
    isNull:false,
    isShowLode:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      type:e.type
    })
    this.getListFn()

    this.setData({
      isShowLode: true
    })
    //模态框
    setTimeout(() => {
      this.setData({
        isShowLode: false
      })
      wx.createSelectorQuery().select('#box').boundingClientRect(function (rect) {
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.bottom
        })
      }).exec((res) => {
        console.log(res)
      })
    }, 1000)
  },

  //加载页面数据 
  getListFn(){
    let _this = this;
    let mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host + '//index.php?app=dakaprogram&mod=Mine&act=getSystemMessage',
      data: {
        uid: mid,
        token: app.globalData.token,
        // uid: '116859',
        // token: '192541151ee19edaca223b108d9ca9b2'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        var oData = res.data.data;
        if(oData == null){
          _this.setData({
            isNull:true
          })
          return
        }     
        _this.setData({
          listArr: oData
        }) 
   
        for (let i = 0; i < _this.data.listArr.length; i++) {
          WxParse.wxParse('topic' + i, 'html', _this.data.listArr[i].content, _this);
          if (i === _this.data.listArr.length - 1) {
            WxParse.wxParseTemArray("listArr", 'topic', _this.data.listArr.length, _this)
          }
        }

        let oList = _this.data.listArr;   //重新赋值
        oList.map((item,index,arr)=>{
          arr[index][0].created_at = oData[index]['created_at'];
          arr[index][0].go_type = oData[index]['go_type'];
          arr[index][0].go_url = oData[index]['go_url'];
        })

        _this.setData({
          listArr: oList 
        }) 
      }
    })
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
    //授权
    let mid = wx.getStorageSync('mid');
    var isloginOauth = app.loginOauth('2', '/pages/guanFangMsg/guanFangMsg', '2');
    if (isloginOauth == 0) {
      return;
    }
    
    // 发送接口表明已读
    wx.request({
      url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Mine&act=noReadToReadByUid',
      data: {
        uid: mid,
        token: app.globalData.token,
        type:this.data.type
      // uid: '116859',
      // token: '770b7df766a402abb6ee51ac65c91fa5'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
      }
    })
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
    setTimeout(()=>{
      wx.stopPullDownRefresh();
      this.getListFn()
    },1000)
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

  }
})