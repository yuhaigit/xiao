// pages/huiFu/huiFu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: true,
    bgColor: '#fff',
    listArr:'' ,
    type:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    this.setData({
      type:type
    })
    this.loadingData()
    setTimeout(()=>{
      wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.bottom
        })
      }).exec((res) => {
        console.log(res)
      })
    },500)
  },
  loadingData() {
    let _this = this;
    let mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Mine&act=getReplyMessage',
      data: {
        // uid: '116859',
        // token: '7be4cda207d6b61768cfdfc5f8e49798'
        uid: mid,
        token: app.globalData.token
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        let data = res.data.data;
        _this.setData({
          listArr: data
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
    // 发送接口表明已读
    let mid = wx.getStorageSync('mid');
    var isloginOauth = app.loginOauth('2', '/pages/huiFu/huiFu', '2');
    if (isloginOauth == 0) {
      return;
    }

    wx.request({
      url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Mine&act=noReadToReadByUid',
      data: {
        uid: mid,
        token: app.globalData.token,
        type: this.data.type
        // uid: '116859',
        // token: '770b7df766a402abb6ee51ac65c91fa5'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log('已读')
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
      this.loadingData()
    },2000)
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