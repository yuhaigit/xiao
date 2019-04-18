//获取应用实例
const app = getApp()
Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色
 
		// 收藏
		page: 0,
		size: 10,
        loading: false,
        allloaded: false,
		list: [],
		test: '正在加载中...',
		uid:'',//接收的uid参数
		currentTab: 1 ,
		active: 0 ,		//单双 默认位置
		Modes:true ,	//单双模式选择，默认未知

        isCourse: true , //是否有课

		tbodyHeight:0 ,	//高度
		gotopsFlag: false,//默认不显示 返回顶部
        isShows:false,  //默认不显示
        isloading:false,//默认不显示加载动画
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
	},
    onLoad:function(e){

		let _this = this;
		_this.setData({
			uid:e.uid
		})
		//页面预加载一次数据
		this.getLists();

	},
	


	//选择精选或者最新  待完善滚动数据改变
	selectShow:function(event){
		wx.showToast({
			title: `点击标签 ${event.detail.index}`,
			icon: 'none'
		});
	},




	// 下拉刷新回调接口
	onPullDownRefresh: function () {
		this.setData({
			page_2: 1,
			page: 0,
			list: [],
			test: '正在加载中...',
			isShowsText:'',
			listRecommend: [],
			newlistIndex: [],
		})
		this.getLists();
		wx.stopPullDownRefresh();
	},
    // 上拉加载数据
  	onReachBottom: function() {
        console.log( '触发底部了');
        this.setData({
            isShows:true,
            isShowsText:'正在拼命的捞数据',
            isloading:true,
		})
		this.getLists();
	},

	getLists() {
		setTimeout(() => {
			wx.request({
				url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=mycollection',
				// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Mine&act=mycollection',
				data:{
					yeshu: this.data.page,
					uid:this.data.uid,
					// uid:90216
					token: app.globalData.token
				},
				method: 'POST',
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: (ret) => {
					let newList = [];
					console.log(ret.data)
					let lists = ret.data.data;
					if (lists == '' ) {
						this.setData({
							allloaded: true,
							test:'暂无数据',
                            isloading:false,
                            isShowsText:'数据加载完了',
						})
						console.log('数据加载完了')
					}else{
						lists.forEach(item=>{
							newList.push(item)
						})
						let Newlist = this.data.list ;
						let newsData  = Newlist.concat(newList);
						this.setData({
							loading: true,
							list: newsData,
							page: this.data.page + 10,
                            isShows:false ,//隐藏
						})
						console.log('=====End数据=====')
						console.log( this.data.list )
					}

				}
				
			})
	
		// 	resolve();
		}, 1000)
	},

	// 返回顶部
	// gotops:function(){
	// 	// 控制滚动
	// 	wx.pageScrollTo({
	// 		scrollTop: 0
	// 	})
	// },




  	// 加载更多
	  loadmore({
		detail
	}) {
		this.getList().then(res => {
			// console.log(res)
			detail.success();
		});
	},
  	// 刷新
	refresh({
		detail
	}) {
		this.setData({
			loading: false,
			allloaded: false,
			page: 0 ,
			list: [],
			test: '正在加载中...',
		})
		this.getList().then(res => {
			detail.success();
		});
	},
	getList() {
		return new Promise((resolve, reject) => {
			console.log('=====触发了打卡的请求=====')
			console.log('基础状态第1次=='+   this.data.loading)
			console.log('基础状态第111次=='+   this.data.allloaded)
			if (this.data.loading || this.data.allloaded) {
				resolve();
				return;
			}
			console.log('测试第1次页码=='+ this.data.page)
			this.setData({
				loading: true
			})
			console.log( this.data  )
			console.log('测试页码*'+ this.data.page)
			setTimeout(() => {
				wx.request({
					url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=mycollection',
					// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Mine&act=mycollection',
					data:{
						yeshu: this.data.page,
						uid:this.data.uid,
						// uid:90216
						token: app.globalData.token
					},
					method: 'POST',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					success: (ret) => {
						let newList = [];
						console.log(ret.data)
						let lists = ret.data.data;
						console.log(lists);
						if (lists == '' ) {
							this.setData({
								allloaded: true,
								test:'暂无数据'
							})
							console.log('数据加载完了')
						}else{
							lists.forEach(item=>{
								newList.push(item)
							})

							console.log(this.data.list )

							let Newlist = this.data.list ;
							let newsData  = Newlist.concat(newList)
							console.log('=====上拉的数据-=======')
							console.log(newsData)
							console.log('数据长度是'+ newsData.length)
							// let addList = resData.slice(this.data.size * this.data.page, (this.data.page + 1) * this.data.size);

							this.setData({
								loading: false,
								list: newsData,
								page: this.data.page + 10
							})
							console.log('=====End数据=====')
							console.log( this.data.list )
							resolve();
						}

					}
					
				})
		
			// 	resolve();
			}, 1000)
		})
	},



    //收藏与取消收藏
    likes:function(event){
		var that = this;
		console.log(event)
		var id = event.currentTarget.dataset.id;
		console.log(id);
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=collection',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=collection',
			data: {subid:id,mid:this.data.uid,token: app.globalData.token},
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
					for (var i = 0; i < that.data.list.length; i++) {
						if (that.data.list[i].id == id) {
							// 点赞成功时遍历list对象并获取到当前节点的id
							that.setData({
								// 改变list对象 i 节点的值
								['list[' + i + '].collection']: status
							})
						}
					}

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


	// 点赞
	handleLike: function(event) {
		var that = this;
		// console.log(event.detail)
		var id = event.currentTarget.dataset.id;
		let mid = wx.getStorageSync('mid');
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
					for (var i = 0; i < that.data.list.length; i++) {
						if (that.data.list[i].id == id) {
							// 点赞成功时遍历list对象并获取到当前节点的id
							that.setData({
								// 改变list对象 i 节点的值
								['list[' + i + '].praise.is_zan']: res.data.data.zan_status,
								['list[' + i + '].praise.count']: res.data.data.num
							})
						}
					}

				}

			},

		})
		console.log('like!')
	},


	//单双模式切换
	clickTab: function (e) {
		// console.log(e.target.dataset.current)
		
		var that = this;
		if (this.data.currentTab === e.target.dataset.current) {
			return false;
		} else {
			that.setData({
				currentTab: e.target.dataset.current,
			})
		}
		if (that.data.currentTab ==0) {
			this.setData({
				Modes:false,
			})
		}else{
			this.setData({
				Modes:true,
			})
		}
	},


})