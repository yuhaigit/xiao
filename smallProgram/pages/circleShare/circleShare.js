//获取应用实例
const app = getApp()
Page({
    data: {
		showIcon: false,				//顶部导航是否显示左侧按钮
		bgColor:"#fff",			//顶部导航背景颜色

		// remenList:[],	//页数
		daka: [],
		id:'',
		mid:'',
		tbodyHeight:0 ,	//高度

	},
    onReady:function(){
		let _this = this ;

		wx.getSystemInfo({
		  success: function(res) {
		    console.log(res.windowHeight)
			_this.setData({
				tbodyHeight : res.windowHeight
			})
			
		  }
		})
			
		console.log(this.data.tbodyHeight)
	},
    onLoad:function(e){
		console.log(8888);
		let _this = this;
		let mid = wx.getStorageSync('mid');
		console.log(mid);
		_this.setData({
			id:e.id,
			mid:mid
		})
		console.log(e.id);
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=circleshare',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=circleshare',
			data: {id:e.id,mid:mid,token: app.globalData.token},
			// data: {id:5461},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log('11');
				console.log(res.data.data);
				let circle = res.data.data;
				if(res.data.data.length==0){
					_this.setData({
						daka:[],
						test:'暂无数据'
					})
				}else{
					_this.setData({
						daka:res.data.data,
					})
				}


			},

		})
	},
	
    //收藏与取消收藏
    likes:function(event){
		var that = this;
		console.log(event)
		var id = event.currentTarget.dataset.id;
		console.log(id);
		var mid = wx.getStorageSync('mid');
		console.log(mid);
		if (mid == "") {
			var urlArray = {
				urlmodel: '2',
				urlAll: '/pages/circleShare/circleShare?id='+id
			}
			wx.setStorageSync('urlArray', urlArray);
			wx.redirectTo({
				url: "/pages/loginUser/loginUser",
			});
			return;
		}
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=collection',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=collection',
			data: {subid:id,mid:mid,token: app.globalData.token},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log(res.data.data);
				console.log(res.data);
				var status = res.data.data;
				wx.showToast({
					title: res.data.info,
					icon: 'none'
				})
				if(res.data.status == 1){
					console.log(status);
							// 点赞成功时遍历list对象并获取到当前节点的id
							that.setData({
								// 改变list对象 i 节点的值
								['daka.collection']: status
							})
				}

			},

		})
    },


	//预览图片
	imgView:function(event){
		console.log(event)

		var src = event.currentTarget.dataset.src;//获取data-src
		var imgList = event.currentTarget.dataset.list;//获取data-list
		// var imgList = ["http://www.liupintang.com/data/attachment/forum/201812/18/070927trvns8jjvnc4bjzz.jpg","http://www.liupintang.com/data/attachment/forum/201812/18/070927trvns8jjvnc4bjzz.jpg","http://www.liupintang.com/data/attachment/forum/201812/18/070927trvns8jjvnc4bjzz.jpg" ]
		// console.log( imgList )
		//图片预览
		wx.previewImage({
			current: src, // 当前显示图片的http链接
			urls: imgList // 需要预览的图片http链接列表
		})
	},
	// 改变卡片展开状态事件的回调
	// handleExpand: function(event) {
	// 	console.log(event.detail)
	// 	console.log('expand call back')
	// },

	// // 点击卡片
	// tapCard: function(event) {
	// 	console.log(event.detail)
	// 	console.log('tap card!')
	// },

	// 点赞
	handleLike: function(event) {
		var that = this;
		var id = event.currentTarget.dataset.id;
		let mid = wx.getStorageSync('mid');
		console.log(mid);
		if (mid == "") {
			var urlArray = {
				urlmodel: '2',
				urlAll: '/pages/circleShare/circleShare?id='+id
			}
			wx.setStorageSync('urlArray', urlArray);
			wx.redirectTo({
				url: "/pages/loginUser/loginUser",
			});
			return;
		}
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=praise',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=praise',
			data: {subid:id,mid:mid,token: app.globalData.token},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log(res.data.data);
				var zan_status = res.data.data.zan_status;
				wx.showToast({
					title: res.data.info,
					icon: 'none'
				})
				if(res.data.status == 1){
					console.log(zan_status);
							that.setData({
								// 改变list对象 i 节点的值
								['daka.praise.is_zan']: res.data.data.zan_status,
								['daka.praise.count']: res.data.data.num
							})

				}

			},

		})
		console.log('like!')
	},
	//跳首页
	shouye:function(){
    	console.log('diaji')
		wx.switchTab({
			url: '/pages/home/home'
		})
	},
	// 一起学习
	// gotoStudy:function(){
	// 	console.log('点击了一起学')
	//
	// 	// 判断是否加入圈子再跳转
	//
	// 	// wx.redirectTo({
	// 	// 	url: '/pages/circle/circle'
	// 	// })
	//
	// }

})
