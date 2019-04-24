//获取应用实例
const app = getApp()

Page({
    data: {
		showIcon: false, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		active: 0 ,		//默认精选
        imgLists:[],	//精选
		imgLists2:[],	//最新
		open : 'all',	//激活
		opens : '',	//激活2

		// remenList:[],	//页数
		list: [],

		// tbodyHeight:0 ,	//高度

	},
	
    onReady:function(){
		// var tbodyHeight = app.globalData.windowHeight - 160; //90为头部固定高度 
		// console.log(tbodyHeight )
		// this.setData({
		// 	tbodyHeight: tbodyHeight.toFixed(0)
		// })
	},
  //@lee 首页基本信息获取和推荐圈子样式配置
  circleInitlist: function (e) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=alist',
      data: { mid: mid,token: app.globalData.token },
      success: function (res) {
        var listscircle = res.data.data;
        that.setData({
          listscircle: listscircle
        })
      }

    }) //wx.request
  },
    onLoad(){
      console.log(444);
      //app.loginOauth('1', '/pages/circle/circle');
		  this.circleInitlist();
		

	
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
			page: 0 ,
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
					url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Tests',
					data:{
						page: this.data.page,token: app.globalData.token
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



})
