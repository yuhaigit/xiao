//获取应用实例
const app = getApp()
Page({
    data: {
		showIcon: false, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		uname:'', //用户名
		fensi:'', //粉丝
		guanzhu:'', //关注
		sex:'', //性别
		uedit:'', //
		utype:'', //
		avator:'', //头像
		leaderboard:'', //排行榜
		daka:'' ,//判断今日是否打卡
		circle:'' ,//我的圈子
		uid:'',

		tbodyHeight:'',
	},

    onReady:function(){
		let _this = this ;
		// console.log(app.globalData.windowHeight)
		let scrollHeight =  app.globalData.statusBarHeight + app.globalData.titleBarHeight ;
		wx.getSystemInfo({
		  success: function(res) {
		//     console.log(res.windowHeight)
			_this.setData({
				tbodyHeight : res.windowHeight - scrollHeight
			})
			
		  }
		})
		
		// console.log(  app.globalData.statusBarHeight,app.globalData.titleBarHeight  )
		// console.log(  scrollHeight  )
		// console.log(this.data.tbodyHeight)

	},
	onShow: function (e) {
		var mid = wx.getStorageSync('mid');
		console.log(mid);
    if (mid == "") {
      var urlArray = {
        urlmodel: '1',
        urlAll: '/pages/myHome/myHome'
      }
      wx.setStorageSync('urlArray', urlArray);
      wx.redirectTo({
        url: "/pages/loginUser/loginUser",
      });
      return;
    }

	},
	onLoad: function (e) {

		//初始化
		this.loadingData();

	},
	// 数据请求
	loadingData(){
		let _this = this;
		let mid = wx.getStorageSync('mid');
		_this.setData({
			uid:mid,
			// uid:201515
		})
		// var mid = wx.getStorageSync('mid');console.log(mid);console.log('1111');
		// var uid = wx.get('uid');
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=mine',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Mine&act=mine',
			data: {uid:this.data.uid,token: app.globalData.token},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {

				let uname = res.data.data.uname;
				let fensi = res.data.data.fensi;
				let guanzhu = res.data.data.guanzhu;
				let sex = res.data.data.sex;
				let utype = res.data.data.utype;
				let uedit = res.data.data.uedit;
				let avator = res.data.data.avator;
				let circle = res.data.data.circle;
				let leaderboard = res.data.data.leaderboard;
				let daka = res.data.data.daka;
				_this.setData({
					uname: uname,
					fensi: fensi,
					guanzhu: guanzhu,
					sex: sex,
					utype: utype,
					uedit: uedit,
					avator: avator,
					circle: circle,
					leaderboard: leaderboard,
					daka: daka,
				})

			},

		})
	},

	//授权信息
	bindGetUserInfo(e) {
    	var that = this;
		console.log(e.detail.userInfo)
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=inseruser',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=inseruser',
			data: {uid:this.data.uid,nickName: e.detail.userInfo.nickName,gender:e.detail.userInfo.gender,avatarUrl:e.detail.userInfo.avatarUrl,token: app.globalData.token},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log('11');
				console.log(res.data.data);
				let uname = res.data.data.uname;
				let avator = res.data.data.avator;
				let sex = res.data.data.sex;
				let uedit = res.data.data.uedit;
				wx.showToast({
					title: res.data.info,
					icon: 'none'
				})
				if(res.data.status == 1){
					that.setData({
						uname: uname,
						avator: avator,
						sex: sex,
						uedit: uedit,
					})
				}

			},

		})
	},


	// 跳转打卡页
	gotoCard:function(){
		wx.switchTab({
			url: '/pages/myRankingCard/myRankingCard',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
		})
	},



	// 下拉刷新回调接口
	onPullDownRefresh: function () {
		// do somthing
		// console.log('下拉了-----')
		this.loadingData();
		wx.stopPullDownRefresh()
	},

})
