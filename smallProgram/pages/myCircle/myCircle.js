//获取应用实例
const app = getApp()


Page({
    data: {
		// navH:'',

		// showHome:true ,
		// showNav: true ,

		showIcon: true,				//顶部导航是否显示左侧按钮
		bgColor:"#fff",			//顶部导航背景颜色
		uid:'',//接收的uid参数
		circle:[],//圈子
		test: '正在加载中...',

//         imgUrls: [
// 'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png',
// 'https://test.liupinshuyuan.com/data/upload/2018/0914/18/5b9b8f91d24dc_720_300_720_300.png'
//         ],
//         indicatorDots: true,
//         autoplay: true,
//         interval: 3000,
//         duration: 1000,

        // imgUrls_2: [
        //     'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png',
        //     'https://test.liupinshuyuan.com/data/upload/2018/0914/18/5b9b8f91d24dc_720_300_720_300.png',
        //     'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png',
        //     'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png'
        // ],
        // isCourse: true , //是否有课
        // CourseImg: [
        //     'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png',
        //     'https://test.liupinshuyuan.com/data/upload/2018/0914/18/5b9b8f91d24dc_720_300_720_300.png'
        // ],


        brick_option: { //瀑布流内容设置
            // showFullContent: true,
            // backgroundColor:"#16A085",
            // forceRepaint: true,
            defaultExpandStatus: true,
            // imageFillMode:'aspectFill'
            // columns: 3
            // icon: {
            //   fill: 'https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg',
            //   default:'https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg',
            // },
            // fontColor:'black'
        },

		active: 0 ,		//默认精选
        imgLists:[],	//精选
		imgLists2:[],	//最新
		open : 'all',	//激活
		opens : '',	//激活2

		// remenList:[],	//页数
		list: [],

		tbodyHeight:0 ,	//高度


	},
	
    onReady:function(){
		// var tbodyHeight = app.globalData.windowHeight - 160; //90为头部固定高度 
		// console.log(tbodyHeight )
		// this.setData({
		// 	tbodyHeight: tbodyHeight.toFixed(0)
		// })
	},
  //@lee 首页基本信息获取和推荐圈子样式配置
  // circleInitlist: function (e) {
  //   var that = this;
  //   wx.request({
  //     url: 'https://test.liupinshuyuan.com/index.php?app=dakaprogram&mod=Circles&act=alist',
  //     success: function (res) {
  //       var listscircle = res.data.data;
  //       that.setData({
  //         listscircle: listscircle
  //       })
  //     }
  //
  //   }) //wx.request
  // },
    onLoad:function(e){
		// this.circleInitlist();
		let _this = this;
		_this.setData({
			uid:e.uid
		})
		//页面预加载一次数据
		// this.getList()

		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=mycircle',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Mine&act=mycircle',
			data: {uid:this.data.uid,token: app.globalData.token},
			// data: {uid:90216},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log('11');
				console.log(res.data.data);
				let circle = res.data.data;
				if(circle.length==0){
					_this.setData({
						circle:circle,
						test:'暂无数据'
					})
				}else{
					_this.setData({
						circle:circle,
					})
				}


			},

		})
	
	},
	


	/**
	 * 精选
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
			list: []
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
					url: 'https://test.liupinshuyuan.com/index.php?app=dakaprogram&mod=Tests',
					data:{
						page: this.data.page
					},
					method: 'GET',
					success: (ret) => {
						let newList = [];
						let lists = ret.data;
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

						if (newsData.length > 29 ) {
							this.setData({
								allloaded: true
							})
							console.log('数据加载完了')
						}

						this.setData({
							loading: false,
							list: newsData,
							page: this.data.page + 1
						})
						console.log('=====End数据=====')
						console.log( this.data.list )
						resolve();
					}

				})

			// 	resolve();
			}, 1000)
		})
	},

	// //预览图片
    // imgView:function(event){
	// 	console.log(event)
	//
	// 	var src = event.currentTarget.dataset.src;//获取data-src
	// 	// var imgList = event.currentTarget.dataset.list;//获取data-list
	// 	var imgList = ["http://www.liupintang.com/data/attachment/forum/201812/18/070927trvns8jjvnc4bjzz.jpg","http://www.liupintang.com/data/attachment/forum/201812/18/070927trvns8jjvnc4bjzz.jpg","http://www.liupintang.com/data/attachment/forum/201812/18/070927trvns8jjvnc4bjzz.jpg" ]
	// 	// console.log( imgList )
	// 	//图片预览
	// 	wx.previewImage({
	// 		current: src, // 当前显示图片的http链接
	// 		urls: imgList // 需要预览的图片http链接列表
	// 	})
    // },

	// 点赞
	// handleLike: function(event) {
	// 	console.log(event.detail)
	// 	console.log('like!')
	// },



})
