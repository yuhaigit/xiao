//获取应用实例
const app = getApp()

Page({
    data: {
		showIcon: true,				//顶部导航是否显示左侧按钮
		bgColor:"#FFFFFF",			//顶部导航背景颜色

		active: 2 , //默认总榜
		ads:'',	//是否显示
		isDatas: true ,//无数据
 
		list: [],

		scrollTop: 0,
		offsetTop:0,   //滚动至顶部的距离
		isFixed: false,



	},
	onReady:function(){
		console.log(app.globalData)

		let scrollHeight =  app.globalData.statusBarHeight + app.globalData.titleBarHeight ;
		console.log(  scrollHeight  )
		this.setData({
			offsetTop: scrollHeight,
		})
	},
  onShow(){
    var mid = wx.getStorageSync('mid')
    
  },

	onLoad() {
    var mid = wx.getStorageSync('mid')
    if (mid == "") {
        var urlArray = {
          urlmodel: '2',
          urlAll: '/pages/myRanking/myRanking'
        }
        wx.setStorageSync('urlArray', urlArray);
      wx.redirectTo({
          url: '/pages/loginUser/loginUser',
        })
      return;
    }
      console.log(app.globalData)
      this.myranks();
      this.weekRank();
      this.monthRank();
      this.totalRank();
    
	

	},


	//吸顶 [框架有小问题]
	onPageScroll(event) {
		// console.log('=======滚动======')
		// console.log(event)

		this.setData({
			scrollTop: event.scrollTop,
			// isFixed: 'top',
		});

		// console.log(this.data.scrollTop)
	},

  //@lee 打卡提交
  weekRank: function (id) {
    var that = this;
     var mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Ranks&act=weekRank',
      data: { mid: mid, token: app.globalData.token},
      success: function (res) {
        var weekRank = res.data.data;
        that.setData({
          weekRank: weekRank
        })
      }

    }) //wx.request

  },

  //@lee 打卡提交
  monthRank: function (id) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Ranks&act=monthRank',
      data: { mid: mid, token: app.globalData.token},
      success: function (res) {
        var monthRank = res.data.data;
        that.setData({
          monthRank: monthRank
        })
      }

    }) //wx.request

  },
  //@lee 打卡提交
  totalRank: function (id) {
    var that = this;
     var mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Ranks&act=totalRank',
      data: { mid: mid, token: app.globalData.token},
      success: function (res) {
        var totalRank = res.data.data;
        that.setData({
          totalRank: totalRank
        })
      }

    }) //wx.request

  },
  //@lee 打卡提交
  myranks: function (id) {
    var that = this;
     var mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Ranks&act=myrank',
      data: { mid: mid, token: app.globalData.token },
      success: function (res) {
        var myranksinfo = res.data.data;
        that.setData({
          myranksinfo: myranksinfo
        })
      }

    }) //wx.request

  },
    //点击喜欢
    likes:function(event){
        wx.showToast({
            title: '收藏成功',
			icon: 'none'
        })
    },
	//预览图片
    imgView:function(event){
		console.log(event)

		var src = event.currentTarget.dataset.src;//获取data-src
		// var imgList = event.currentTarget.dataset.list;//获取data-list
		var imgList = ["http://www.liupintang.com/data/attachment/forum/201812/18/070927trvns8jjvnc4bjzz.jpg","http://www.liupintang.com/data/attachment/forum/201812/18/070927trvns8jjvnc4bjzz.jpg","http://www.liupintang.com/data/attachment/forum/201812/18/070927trvns8jjvnc4bjzz.jpg" ]
		// console.log( imgList )
		//图片预览
		wx.previewImage({
			current: src, // 当前显示图片的http链接
			urls: imgList // 需要预览的图片http链接列表
		})
    },

	// 点赞
	handleLike: function(event) {
		console.log(event.detail)
		console.log('like!')
	},


	// 跳转打卡页
	gotoCard:function(){
		wx.switchTab({
			url: '/pages/myRankingCard/myRankingCard',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
		})
	},





    //关闭广告
    tapClose:function(event){
		console.log('关闭了广告')
		this.setData({
			ads: 'none'
		})
	},
	




})
