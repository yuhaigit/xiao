//获取应用实例
const app = getApp();
var t = 0;	//全局 默认选中-精选/最新
Page({
	data: {
		navH:'',
		showIcon: false, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色
		// 精选
		page: 1,
		size: 10,
		tol_days: 0,
		loading: false,
		allloaded: false,
		list: [],
    	listRecommend: [],
		// 最新
		page_2: 1,
		size_2: 10,
		loading_2: false,
		allloaded_2: false,
		list_2: [],
		currentTab:1,
		Modes:true ,	//单双模式选择，默认未知

    	//新标签
    	newlistIndex: [],
		likeColor:'black',  //收藏颜色
    	zanColor:'', //点赞颜色
    	isCourse: false , //是否有课
		active: 0 ,		//默认精选
    	imgLists:[],	//精选
		imgLists2:[],	//最新
		open : 'all',	//激活
		opens : '',	//激活2
		tbodyHeight:0 ,	//高度
		gotopsFlag: false,//默认不显示 返回顶部
		isShows:false,  //默认不显示
		isloading:false,//默认不显示加载动画
	},
	onShow:function(){
		var loadingImage = this.data.loadingImage;
		if (loadingImage!=1){
		this.onPullDownRefresh();
		}
	},

	onReady:function(){
		// wx.getSystemInfo({
		//   	success: function(res) {
		// 	    console.log(res)
		// 		let system = res.system ;
		// 		if(res.platform == "devtools"){
		// 			console.log('PC端使用')
		// 		}else if(res.platform == "ios"){
		// 			console.log('ios端使用')
		// 		}else if(res.platform == "android"){
		// 			console.log('安卓端使用')
		// 		}
		//   	}
		// })
	},
	onLoad(){
		var mid = wx.getStorageSync('mid');
		//this.indexInitArray();
	},
	// 下拉刷新回调接口
	onPullDownRefresh: function () {
		this.setData({
			page: 1,
			listRecommend: [],
		})
		this.indexInitArray();
		wx.stopPullDownRefresh();
	},
	//更多圈子
	gotoCireText:function(){
		wx.switchTab({
			url: '/pages/circle/circle'
		})
	},
	//选择精选或者最新 
	selectShow:function(event){
		t = event.detail.index;
		if(t==1){
			var title = "最新"
		}else{
			var title = "精选"
		}
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


	onPageScroll(event) {
		if ( event.scrollTop < 199 ) {
			this.setData({
				gotopsFlag:false,
		  	});
		}
	},
	// 返回顶部
	gotops:function(){
		// 控制滚动
		wx.pageScrollTo({
			scrollTop: 0
		})
	},
    // 上拉加载数据
  	onReachBottom: function() {
        // console.log( '触发底部了');
        this.setData({
            isShows:true,
            isShowsText:'正在拼命的捞数据',
            isloading:true,
		})
		if (t==1) {
			this.getNewlist_1();
		}else{
			this.getRecommendlist_1();
		}
	},
	
 // ============此处为新增请求方法=======
getRecommendlist_1() {
		var mid = wx.getStorageSync('mid');
		if (this.data.loading || this.data.allloaded) {
			return;
		}
		this.setData({
			loading: true
		})
		// 新增返回顶部
		// console.log(this.data.page)
		if (this.data.page >=3) {
			this.setData({
				gotopsFlag: true
			})
		}
			wx.request({
				url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homepages&act=recommendlist',
				data:{
					p: this.data.page,mid:mid,token: app.globalData.token 
				},
				method: 'GET',
				success: (ret) => {
					let newList = [];
					let lists = ret.data.data;
					lists.forEach(item=>{
						newList.push(item)
					})

					let Newlist = this.data.listRecommend ;
					let newsData  = Newlist.concat(newList)
					if (newsData.length > 1000 ) {
						this.setData({
							allloaded: true
						})
						console.log('数据加载完了')
					}

					this.setData({
						loading: false,
						listRecommend: newsData,
						page : this.data.page + 1
					})
					// resolve();
				}
				
			})

	},
	getNewlist_1() {
		var mid = wx.getStorageSync('mid');
	//   return new Promise((resolve, reject) => {
			if (this.data.loading_2 || this.data.allloaded_2) {
			//   resolve();
				return;
			}
			this.setData({
				loading_2: true
		})
		// 新增返回顶部
		// console.log(this.data.page_2)
		if (this.data.page_2 >=3) {
			this.setData({
				gotopsFlag: true
			})
		}

			wx.request({
				url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homepages&act=newlist',
				data:{
					p: this.data.page_2,mid:mid,token: app.globalData.token 
				},
				success: (ret) => {
					let newList2 = [];
				//let lists = ret.data;
				let lists2 = ret.data.data;
        if (lists2!=null){
				lists2.forEach(item=>{
					newList2.push(item)
				})
        }
				let newsData2 = this.data.newlistIndex.concat(newList2)
				if (newsData2.length > 1000 ) {
					this.setData({
						allloaded_2: true
					})
					console.log('数据加载完了')
				}
				this.setData({
					newlistIndex: newsData2,
					loading_2: false,
					page_2: this.data.page_2 + 1
				})

				// resolve();
			}
			
		})

		//   })
	},
//一函数定终身@lee
	indexInitArray: function (e) {
		this.indexInit();
		this.indexCirlce();
		this.getRecommendlist_1();
		//this.getNewlist_1();
},
  	//@lee 首页基本信息获取和推荐圈子样式配置
 indexInit: function (e) {
		var that = this;
		var mid = wx.getStorageSync('mid');
		wx.request({
		url:app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homepages&act=indexInit',
			data: { mid: mid,token: app.globalData.token },
		
			success: function (res) {
				var iscourse = res.data.data.iscourse;
				var tol_days = res.data.data.tol_days;
				that.setData({
				isCourse: iscourse,
					tol_days: tol_days
				})
			}

		}) //wx.request
	
	},
	//@lee 首页圈子推荐或者圈子进度接口
	indexCirlce: function (e) {
		var that = this;
		var mid = wx.getStorageSync('mid');
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homepages&act=indexCircle',
			data: { mid: mid ,token: app.globalData.token },
			success: function (res) {
				var listscircle = res.data.data;
				that.setData({
					listscircle: listscircle
				})
			}

		}) //wx.request
	
	},

  //@lee 首页基本信息获取和推荐圈子样式配置
  collectionButton: function (e) {

    var that = this;
    var mid = wx.getStorageSync('mid');
    var isloginOauth = app.loginOauth('1', '/pages/home/home', '1');
    if (isloginOauth == 0) {
      return;
    }
    var subid= e.currentTarget.dataset.id;
    var xiabiao = e.currentTarget.dataset.xiabiao;
    var iscollection = e.currentTarget.dataset.iscollection;
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=collection',
      method: 'POST', 
      data: { mid: mid, subid: subid,token: app.globalData.token },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })
        //本地处理即可。不需要调用接口@lee搞死了
        if(iscollection==0){
        that.setData({
          ['listRecommend[' + xiabiao + '].is_collection']: 1
        })
        }else{
          that.setData({
            ['listRecommend[' + xiabiao + '].is_collection']: 0
          })

        }
    }//wx.reque

   }) 

  },
  //@lee 首页基本信息获取和推荐圈子样式配置
  collectionButton2: function (e) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    var isloginOauth = app.loginOauth('1', '/pages/home/home', '1');
    if (isloginOauth == 0) {
      return;
    }
    var subid = e.currentTarget.dataset.id;
    var xiabiao = e.currentTarget.dataset.xiabiao;
    var iscollection = e.currentTarget.dataset.iscollection;
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=collection',
      method: 'POST',
      data: { mid: mid, subid: subid,token: app.globalData.token  },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //本地处理即可。不需要调用接口@lee
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })
        if (iscollection == 0) {
          that.setData({
            ['newlistIndex[' + xiabiao + '].is_collection']: 1
          })
        } else {
          that.setData({
            ['newlistIndex[' + xiabiao + '].is_collection']: 0
          })

        }
      }//wx.reque

    })
  },
  //@lee 首页基本信息获取和推荐圈子样式配置
  imgViewByid2: function (event) {
    this.setData({
      loadingImage: 1
    })
    var id = event.currentTarget.dataset.id;//获取data-src
    var isjoin = event.currentTarget.dataset.isjoin;//获取data-src
    if (isjoin){
        wx.navigateTo({
          url: '/pages/circleInfoCard/circleInfoCard?id=' + id
        })
      }else{
        wx.navigateTo({
          url: '/pages/circleInfo/circleInfo?id=' + id
        })
      }
  },
  //当个图片查看@lee 接口调用
  //@lee 首页基本信息获取和推荐圈子样式配置
  imgViewByid1: function (event) {
    var id = event.currentTarget.dataset.id;//获取data-src
    var src = event.currentTarget.dataset.src;//获取data-src
    this.setData({
      loadingImage: 1
    })
		// var imgList = event.currentTarget.dataset.list;//获取data-list
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homesubmit&act=info',
      data: { id: id ,token: app.globalData.token },
      success: function (res) {
        var imgList = res.data.data.imgarray;

        //图片预览
        wx.previewImage({
          current: src, // 当前显示图片的http链接
          urls: imgList // 需要预览的图片http链接列表
        })

      }//wx.request
    })

  },


  // 点赞@lee 改造点赞
  handleZan: function (event) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    var isloginOauth = app.loginOauth('1', '/pages/home/home', '1');
    if (isloginOauth == 0) {
      return;
    }
    var id = event.currentTarget.dataset.id;
    var xiabiao = event.currentTarget.dataset.xiabiao;
    var values = event.currentTarget.dataset.values;
    var iszan = event.currentTarget.dataset.iszan;
    var iszanadd = parseInt(values-1+2);
    var iszandelete = parseInt(values-1);
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=praise',
      data: { subid: id,mid:mid,token: app.globalData.token },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })
        if (iszan == 0) {
          that.setData({
            ['listRecommend[' + xiabiao + '].is_zan']: 1,
            ['listRecommend[' + xiabiao + '].zan_count']: iszanadd
          })
        }else{
        that.setData({
          ['listRecommend[' + xiabiao + '].is_zan']: 0,
          ['listRecommend[' + xiabiao + '].zan_count']: iszandelete
        })
    }
  }

    })
  },


  // 点赞@lee 改造点赞
  handleZan2: function (event) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    var isloginOauth = app.loginOauth('1', '/pages/home/home', '1');
    if (isloginOauth == 0) {
      return;
    }
    var id = event.currentTarget.dataset.id;
    var xiabiao = event.currentTarget.dataset.xiabiao;
    var values = event.currentTarget.dataset.values;
    var iszan = event.currentTarget.dataset.iszan;
    var iszanadd = parseInt(values - 1 + 2);
    var iszandelete = parseInt(values - 1);
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=praise',
      data: { subid: id, mid: mid ,token: app.globalData.token },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })
        if (iszan == 0) {
          that.setData({
            ['newlistIndex[' + xiabiao + '].is_zan']: 1,
            ['newlistIndex[' + xiabiao + '].zan_count']: iszanadd
          })
        } else {
          that.setData({
            ['newlistIndex[' + xiabiao + '].is_zan']: 0,
            ['newlistIndex[' + xiabiao + '].zan_count']: iszandelete
          })
        }
      }

    })
  },


})