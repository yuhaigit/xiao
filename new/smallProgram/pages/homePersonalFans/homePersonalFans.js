//获取应用实例
const app = getApp()
Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		page: 1,
		size: 10,
		loading: false,
		allloaded: false,
		list: [],
		test: '正在加载中...',
		uid:'',//接收的uid参数

		isShows:false,  //默认不显示
		isloading:false,//默认不显示加载动画

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
		this.setData({
			uid:e.uid
		})
		//页面预加载一次数据
		this.getList()
	},
	
	// 下拉刷新回调接口
	onPullDownRefresh: function () {
		this.setData({
			page: 1,
			list: [],
		})
		this.getList();
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
		this.getList();
	},

	getList() {
		setTimeout(() => {
			wx.request({
				url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=following',
				data:{
					yeshu: this.data.page,
					fid:this.data.uid,
					token: app.globalData.token
				},
				method: 'POST',
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: (ret) => {
					let newList = [];
					console.log(ret.data);
					let lists = ret.data.data;
					if (lists == null ) {
						this.setData({
							// allloaded: true,
							isloading:false,
							isShowsText:'数据加载完了',
						})
						console.log('数据加载完了')
					}else{
						lists.forEach(item=>{
							newList.push(item)
						})
						console.log(this.data.list )

						let Newlist = this.data.list ;
						let newsData  = Newlist.concat(newList)
						this.setData({
							list: newsData,
							loading: true,//隐藏加载动画图
							page: this.data.page + 1,
							isShows:false ,//隐藏
						})
					}
				}
				
			})
		}, 500)
	},

})