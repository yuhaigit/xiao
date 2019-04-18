// pages/msgInform/msgInform.js
var WxParse = require('../../components/wxParse/wxParse.js');
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    bgColor: '#fff', //顶部导航背景颜色
    dataInfo:'',
    isShows: false,  //默认不显示
    isloading: false,//默认不显示加载动画
    isImg:false
  },
  
  // 点击官方信息跳转页面
  guanfang(){
    wx.navigateTo({
      url: '/pages/guanFangMsg/guanFangMsg',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadingData();
  },

  loadingData(){
    let _this = this;
    let mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=getMyMessageHome',
      data: {
        uid: mid,
        token: app.globalData.token
        // uid: '116859',
        // token: '192541151ee19edaca223b108d9ca9b2'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res)=>{
        let data = res.data;
        if (data.data.last_sys!=null && data.data.last_sys.content.indexOf('img')!=-1){
          _this.setData({
            isImg:false
          })
        }else{
          _this.setData({
            isImg: true
          })
        }
        // if (data.data.last_sys != null){
        //   WxParse.wxParse('topic', 'html', data.data.last_sys.content, _this);
        // }
        _this.setData({
          dataInfo: data
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
    this.onLoad()
    let mid = wx.getStorageSync('mid');
    var isloginOauth = app.loginOauth('1', '/pages/msgInform/msgInform', '1');
    if (isloginOauth == 0) {
      return;
    }
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
      this.loadingData();
      wx.stopPullDownRefresh();
    },800)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('触发底部了');
    this.setData({
      isShows: true,
      isShowsText: '正在拼命的捞数据',
      isloading: true,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})