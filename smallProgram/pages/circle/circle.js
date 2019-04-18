// pages/circle/ee.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIcon: false, //顶部导航是否显示左侧按钮
    bgColor: "#fff", //顶部导航背景颜色
    active: 0,		//默认精选
    currentTab: 0 , //默认一级分类,
    circleType: [], //圈子一级分类
    lv2:[]  //二级数组
  },
  clickTab: function (e) {  //一级点击
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      let pid = e.target.dataset.pid
      that.setData({
        lv2: []
      })
      wx.showLoading({
        title: '拼命加载中',
        mask: true
      })  
      that.getLv2Circle(pid)
      that.setData({
        currentTab: e.target.dataset.current,
      })
      // setTimeout(()=>{
      //   wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {
      //     // 使页面滚动到底部
      //     wx.pageScrollTo({
      //       scrollTop: 0
      //     })
      //   }).exec((res) => {
      //     console.log(res)
      //   })
      // },300)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '拼命加载中',
      mask: true
    }) 
    this.getLv1Circle()
  },
  getLv1Circle: function(){  //一级数据列表
    let _this = this;
    let mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Circles&act=getCircle',
      data: {
        mid: mid,
        token: app.globalData.token
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        let data = res.data.data;
        if(data!=""){
          let pid = data[0].dk_circle_category_id
          _this.getLv2Circle(pid)
        }
        _this.setData({
          circleType: data
        })
      }
    })
  },
  getLv2Circle: function(pid){   //二级数据列表
    let _this = this;
    let mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Circles&act=getCateCircle',
      data: {
        mid: mid,
        token: app.globalData.token,
        pid: pid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        let data = res.data.data;
        _this.setData({
          lv2: data
        })
        wx.hideLoading()
      }
    })
  },
  join: function(e){  //加群
    var isloginOauth = app.loginOauth('1', '/pages/circle/circle', '1');
    if (isloginOauth == 0) {
      return;
    }
    let _this = this;
    let mid = wx.getStorageSync('mid');
    let cid = e.target.dataset.cid;
    wx.request({
      url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Circles&act=joincircle',
      data: {
        mid: mid,
        token: app.globalData.token,
        cid: cid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        let data = res.data.status;
        if (res.data.status == 1 && res.data.info=="加入成功"){
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '/pages/circleInfoCard/circleInfoCard?id='+cid,
            })
          },500)
        }
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
    this.setData({
      currentTab: 0,
      lv2: []
    })
    this.onLoad()
    // setTimeout(() => {
    //   wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {
    //     // 使页面滚动到底部
    //     wx.pageScrollTo({
    //       scrollTop: 0
    //     })
    //   }).exec((res) => {
    //     console.log(res)
    //   })
    // }, 300)

    // let pages = getCurrentPages();    
    // let prePage = pages[0].__displayReporter.showReferpagepath;
    // console.log(prePage)
    // if (prePage == "pages/circleInfoCard/circleInfoCard.html"){
    //   this.setData({
    //     currentTab: 0
    //   })
    //   this.onLoad()
    // }
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

  }
})