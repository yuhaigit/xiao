//获取应用实例
const app = getApp()
Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		activeNames : ['1'] ,

        imgUrls_2: [
            'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png',
            'https://test.liupinshuyuan.com/data/upload/2018/0914/18/5b9b8f91d24dc_720_300_720_300.png',
            'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png',
            'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png'
        ],

		ads:'',	//是否显示
		isDatas: false ,//无数据
		page: 1,
		size: 10,
		daka: [],
		test: '正在加载中...',
		uid:'',//传递uid
		mid:'',//登陆uid
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
		let _this = this;
		let mid = wx.getStorageSync('mid');
		_this.setData({
			uid:e.uid,
			mid:mid
		})
		//页面预加载一次数据
		this.getList()
	
	},



	/**
	 * 打卡记录
	 * @param {*} param0 
	 */
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
			page: 1 ,
			daka: [],
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
					url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=dakalist',
					// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=dakalist',
					data:{
						yeshu: this.data.page,
						uid: this.data.uid,
						mid: this.data.mid,
						// uid: 90216,
						canshu:2,
						is_me:1,
						token: app.globalData.token
					},
					method: 'POST',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					success: (ret) => {
						let newList = [];
						let lists = ret.data.data;
						if (lists == null) {
							this.setData({
								allloaded: true,
								test:'暂无数据'
							})
							console.log(this.data.allloaded)
							console.log('数据加载完了')
							console.log('=====End数据001=====')
							resolve();
						} else {
							lists.forEach(item => {
								newList.push(item)
							})

							console.log(this.data.daka)

							let Newlist = this.data.daka;
							let newsData = Newlist.concat(newList)
							console.log('=====上拉的数据-=======')
							console.log(newsData)
							console.log('数据长度是' + newsData.length)
							// let addList = resData.slice(this.data.size * this.data.page, (this.data.page + 1) * this.data.size);

							this.setData({
								loading: false,
								daka: newsData,
								page: this.data.page + 1
							})
							console.log('=====End数据=====')
							console.log(this.data.daka)
							resolve();
						}
					}
				})
		
			// 	resolve();
			}, 1000)
		})
	},
	
	// 点赞
	handleZanX(){
		console.log('7777')
	},

	// 回复
	replys(){
		console.log('88888888888888')
	},

    //设置优秀
    setGood:function(event){
		var that = this;
		// console.log(event.detail)
		var id = event.currentTarget.dataset.id;
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Calendar&act=excellent',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Calendar&act=excellent',
			data: {id:id,uid:this.data.uid,token: app.globalData.token},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log(res.data.data);
				console.log(res.data);
				var status = res.data.data.status;
				wx.showToast({
					title: res.data.data.info,
					icon: 'none'
				})
				if(res.data.status == 1){
					console.log(status);
					for (var i = 0; i < that.data.daka.length; i++) {
						if (that.data.daka[i].id == id) {
							// 点赞成功时遍历list对象并获取到当前节点的id
							that.setData({
								// 改变list对象 i 节点的值
								['daka[' + i + '].excellent']: status
							})
						}
					}

				}

			},

		})
    },


    //分享
    // onshares:function(event){
    //     wx.showToast({
    //         title: '点击了分享呀',
	// 		icon: 'none'
    //     })
    // },

	onShareAppMessage: function (e) {
		console.log(e)
		console.log(999)
		var id = e.target.dataset.id;
		var img = e.target.dataset.img;
		var title = e.target.dataset.title;
		console.log(id);
		console.log(img);
		var that = this;
		return {
			title: title,
			// path: '/pages/circleShare/circleShare?id='+id,
			path: '/pages/circleSignInfo/circleSignInfo?id='+id,
			imageUrl:img,
			success: function (res) {

			},
			fail: function (res) {

			}
		}
	},
	//预览图片
    imgView:function(event){
		console.log(event)

		var src = event.currentTarget.dataset.src;//获取data-src

		var id = event.currentTarget.dataset.id;
		wx.request({
			url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Community&act=orimg',
			data: {id: id, token: app.globalData.token},
			success: function (res) {
				var imgList = res.data.data;

				//图片预览
				wx.previewImage({
					current: src, // 当前显示图片的http链接
					urls: imgList // 需要预览的图片http链接列表
				})

			}//wx.reque
		})
    },
	// 点赞
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
					for (var i = 0; i < that.data.daka.length; i++) {
						if (that.data.daka[i].id == id) {
							// 点赞成功时遍历daka对象并获取到当前节点的id
							that.setData({
								// 改变list对象 i 节点的值
								['daka[' + i + '].praise.is_zan']: res.data.data.zan_status,
								['daka[' + i + '].praise.count']: res.data.data.num
							})
						}
					}

				}

			},

		})
		console.log('like!')
	},

})

