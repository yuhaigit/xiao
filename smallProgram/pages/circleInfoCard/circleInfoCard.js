//获取应用实例
const app = getApp()
var t = 0;	//全局 默认选中-打卡记录
import CTB from '../../utils/canvas-text-break.js';
import wxp from '../../utils/wxp.js';
import Dialog from '../../dist/dialog/dialog';
var upFiles = require('../../utils/upFiles.js')
let ctx = null;

Page({
    data: {
    videoDefaPic:"",   //视频隐藏时需要展示的占位图
    imgReload:0,
		showIcon: true,				//顶部导航是否显示左侧按钮
		bgColor:"#fff",			//顶部导航背景颜色
    	noText: '正在加载中...',
		active: 0 ,		//默认打卡
    	idK: 0,
		//新的上拉下拉
		page: 1,
		size: 10,
		loading: false,
		allloaded: false,
		list: [],
		nearfriend:[],//附近书友
		map_url:'',//背景图
		map_canshu:'',//是否已授权过位置
		infoCircleCardhomesubmitlist:[],
		infoCircleCardfollowlist:[],
		// 圈内
		page_2: 1,
		size_2: 10,
		loading_2: false,
		allloaded_2: false,
		list_2: [],

		shows:true,	//控制是否显示推荐评分模块
		listHeights:'',//父元素高度
		tbodyHeight:'',
		screenHeight:'',//屏幕高
		navHeight:'',	//导航栏高度
		isShows:false,  //默认不显示
		isloading:false,//默认不显示加载动画
    	tapTime: "", //点击进群按钮的时间

		Models: false ,//默认隐藏
		ModelsShow: false ,	//提示授权
		noScroll: '' ,//页面滚动
		NEW_WIDTH: 640  ,
		NEW_HEIGHT: 1000  ,
		WIDTH: 640,
		HEIGHT: 1000,
		windowWidth: 0,
		windowHeight: 0,
		loaded:false,
		productDetail: {
			TxImg:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2369419058,1797305489&fm=27&gp=0.jpg', //头像，注意：必须是正方形头像,否则无法裁剪
			TxImg3: 'https://test.liupinshuyuan.com/data/upload/dakaprogram/logo2.jpg',	//小程序码
			TxImg2:'http://www.liupintang.com/data/attachment/forum/201812/10/162657fxfcf00vbcz5fuxe.jpg',	//封面图
			artistName:'佳基洛夫斯卡',	//用户名
			courseName:'颜真卿勤礼碑颜真真真真颜真真真真颜真卿勤嗯', //分享内容
		},
		sharesubmitinfo:'',

		IMGT:'56', 
		IMGB:'35',

		maxUploadLen:6,	//图片最大张数限制
		videoEndText: false , //默认不显示引导
		videoCoverEndText : false ,
		autoplays: false ,//不自动播放

		//位置
		hiddens:false,
		nearbyShow: false ,
		nearby:true ,
		longitude:'',	//经度
		latitude:'',	//维度
		markers: [	//附近用户
			// {
			// 	latitude: 30.288734,
			// 	longitude: 120.012199,
			// 	// name: 'T.I.T 创意园',
			// 	iconPath: '../../image/location.png'
			// },
			// {
			// 	latitude: 30.284669,
			// 	longitude: 119.998802,
			// 	// name: '看看啊',
			// 	iconPath: '../../image/location.png'
			// },
			// {
			// 	latitude: 30.5433,
			// 	longitude: 120.5741,
			// 	// name: '看看啊',
			// 	iconPath: '../../image/location.png'
			// },
			// {
			// 			// 	latitude: 30.284802,
			// 			// 	longitude: 119.998638,
			// 			// 	// name: '看看啊',
			// 			// 	iconPath: '../../image/location.png'
			// 			// },
		],

		contactsShow:false,
		system :'', 

		infocirclecard:'',
		cid:'',
		xid:'',
		vflag:false,
		currentTime:'',//播放时长
	},
    onReady:function(){
		let _this = this ;
		wx.removeStorageSync('img');
		wx.removeStorageSync('imgcount');
		wx.getSystemInfo({
		  	success: function(res) {
			    console.log(res)
				let navHeight =  app.globalData.statusBarHeight + app.globalData.titleBarHeight ;
				console.log( navHeight  )
				_this.setData({
					navHeight: navHeight ,
					tbodyHeight : res.windowHeight - navHeight,
					screenHeight: res.screenHeight ,
					system: res.platform ,
				})
				if(res.platform == "devtools"){
					console.log('PC端使用')
				}else if(res.platform == "ios"){
					console.log('ios端使用')
				}else if(res.platform == "android"){
					console.log('安卓端使用')
				}
		  	}
		})
		console.log(this.data.tbodyHeight)

		let pages = getCurrentPages();
		console.log(pages)

	},
	gotoGradeResult1:function(){
		console.log(12321)
		// return;
	},
	// yu
	joinGroup: function(){
		let that = this;
		let mid = wx.getStorageSync('mid');
		var nowTime = new Date();   //防止重复点击
		if (nowTime - this.data.tapTime < 1000) {
		return;
		}
		wx.request({      
		url: app.globalData.config_host +'/index.php?app=basic&mod=TencentCloud&act=getGroupInfoByAjax',
		data: {
			uid: mid,
			cid: that.data.idK
		},
		method: 'POST',
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		success: function(res){
			let data = res.data.data
			if(data!=""){
			wx.navigateTo({
        url: '/pages/groupChat/groupChat?GroupId=' + data.GroupId + '&identifier=' + data.identifier + '&userSig=' + data.usersig + "&groupTitle=" + data.title + "&uname=" + data.uname + "&id=" + that.data.idK
			})
			}
		}
		})
	},
	//加助教
	contacts(){
		let _this =this ;
		_this.setData({
			contactsShow:true,
			hiddens:true,
		})
	},
	contactClose(){
		let _this = this ;
		// console.log('触发了关闭哦')
		_this.setData({
			hiddens:false,
		})
	},
	// 邀请好友
	onShareAppMessage: function (e) {
		var id = this.data.idK;
		var infocirclecard = this.data.infocirclecard;
		var imgindex = infocirclecard.imgindex;
		console.log(infocirclecard);
		var title = infocirclecard.title;
		var that = this;
		return {
			title: "一起学习《" + title +"》",
			path: '/pages/circleInfo/circleInfo?id='+id,
			imageUrl:imgindex,
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	},
	onShow(){
		// var img= wx.getStorageSync('img');
		if (this.data.vflag) {
			// this.infoCirlceCard();
			this.onLoad();
		}
	},
	onHide(){
		var videoContext = wx.createVideoContext('myVideo', this);
		videoContext.pause();
	},	
	onLoad(e){
		console.log(e)
		let _this = this ; 
	  	this.isnetworkType();
		// var id = e.id;
		// var xid = e.xid;
		if (e!==undefined) {
			console.log('e值为未知')
			_this.setData({
				cid: e.id,
				xid: e.xid,
			})
		}
		var mid = wx.getStorageSync('mid');
		if(mid == ''){
			wx.redirectTo({
				url: "/pages/circleInfo/circleInfo?id=" + _this.data.cid 
			})
		}else{
			//@lee 圈子信息和圈子关注和圈子日志
			this.infoCirlceCard(e);
			// this.infoCircleCardfollow(e);
			// this.getInfosubmitlist_1(id);
			this.getInfosubmitlist_1();
			// this.getFollowUserList_2(id);//圈内成员
			this.getuserwz();//获取用户授权地理位置信息
			this.setData({
				navH: app.globalData.navHeight,
				idK:  _this.data.cid ,
			})
		}
	},
	//@lee 圈子详情还没加入的页面接口
	infoCirlceCard: function (e) {
		var that = this;
		// var xid = e.xid;
		// console.log(xid);
		let xid = that.data.xid ; 
		var mid = wx.getStorageSync('mid'); 
		that.setData({
			idK: that.data.cid ,
		})
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=infoJoinYes&id='+that.data.cid,
			data: { xid,mid:mid,token: app.globalData.token},
			success: function (res) {
				var infocirclecard = res.data.data;
				that.setData({
          videoDefaPic: infocirclecard.practise_first.imgindex,
					infocirclecard: infocirclecard,
					xid:infocirclecard.practise_first.id,
					cid:infocirclecard.id ,	//id==cid
				})
			}
		}) //wx.request
	},
	//@lee 圈子详情还没加入的页面接口
	infoCircleCardfollow: function (e) {
		var that = this;
		var ids = 1;
		var mid = wx.getStorageSync('mid');
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=infoCirclefollowByid&cid=',
		data: { mid: mid,cid:e.id ,token: app.globalData.token},
		success: function (res) {
			var infoCircleCardfollowlist = res.data.data;
			that.setData({
			infoCircleCardfollowlist: infoCircleCardfollowlist
			})
		}

		}) //wx.request

	},

	//@lee 圈子详情还没加入的页面接口
	infoCircleCardhomesubmit: function (e) {
		var that = this;
		var ids = 1;
		var mid = wx.getStorageSync('mid');
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=infoHomeworkSubmitByid&id='+e.id,
		data: { mid: mid, p: this.data.page,token: app.globalData.token},
		success: function (res) {
			var infoCircleCardhomesubmitlist = res.data.data;
			that.setData({
			infoCircleCardhomesubmitlist: infoCircleCardhomesubmitlist,
			page: that.data.page+1
			})
		}

		}) //wx.request

	},
	//
	selectShow: function (event) {
		t = event.detail.index;
		if (t == 1) {
		var title = "附近书友";
			var that = this;
			var map_canshu = that.data.map_canshu;
			if(map_canshu == 0){
				that.setData({
					nearby:true
				})
			}else{
				that.getLocation();
			}

		} else {
		var title = "打卡记录"
		}
		// wx.showToast({
		//   title: title,
		//   icon: 'none'
		// });
	},
	// 页面下拉刷新回调接口
	onPullDownRefresh: function () {
    	// var es = {id: this.data.idK};
		// this.onLoad(es);
		
		this.setData({
			page: 1,
			page_2: 1,
			infoCircleCardhomesubmitlist: [],
			infoCircleCardfollowlist: [],
		})
		this.getInfosubmitlist_1();
		this.getFollowUserList_2();

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
		console.log(t)
		if (t==0) {
			console.log( '走打卡请求');
			this.getInfosubmitlist_1();
		}else{
			// setTimeout(()=>{
        	// 	this.getFollowUserList_2();
      		// },1000)
		}
	},
	onUnload() {
		this.setData({
			page: 1,
			page_2: 1,
			infoCircleCardhomesubmitlist: [],
			infoCircleCardfollowlist: [],
		})
	},
	//@yang 获取用户是否授权位置信息
	getuserwz(){
		var mid = wx.getStorageSync('mid');
		var that = this;
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=getuserwz',
			data: { mid: mid,token: app.globalData.token},
			success: function (res) {
				that.setData({
					map_url:res.data.data.map_url,
					map_canshu:res.data.data.canshu
				})
			}

		})
	},
	//打卡记录
	getInfosubmitlist_1() {
    var that =this;
		var idK = this.data.idK; 
    var pages=this.data.page
		var mid = wx.getStorageSync('mid');
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=infoHomeworkSubmitByid&id='+idK,
				data:{ p: pages, mid:mid,token: app.globalData.token},
				success: (ret) => {
					let newList = [];
					let lists = ret.data.data;
					// console.log( lists.length)
                    if (lists.length == 0) {
             that.setData({
                 allloaded: true, isloading:false,isShowsText:'数据加载完了',
                        })
                    }else{
						lists.forEach(item=>{
							newList.push(item)
						})
            let newsData = that.data.infoCircleCardhomesubmitlist.concat(newList)
			
            that.setData({
							loading: true,//隐藏加载动画图
							infoCircleCardhomesubmitlist: newsData,
                            isShows:false ,//隐藏
              noText:"暂无打卡日记"
						})
					}
				}
						
		})
    that.setData({
      page: pages + 1,
    })
	},
	//圈内成员
	getFollowUserList_2() {
    var that=this;
		var idK=this.data.idK;
		var mid = wx.getStorageSync('mid');
		// })
		wx.request({
			url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Circles&act=infoCirclefollowByid',
				data:{
          p: that.data.page_2, mid: mid, cid: idK,token: app.globalData.token
				},
			success: (ret) => {
				let newList = [];
				let list_2 = ret.data.data;
				if (list_2.length == 0) {
          that.setData({
						allloaded: true,
						isloading:false,
						isShowsText:'数据加载完了',
					})
				}else{
					list_2.forEach(item=>{
						newList.push(item)
					})
          let newsData = that.data.infoCircleCardfollowlist.concat(newList)
					this.setData({
						infoCircleCardfollowlist: newsData,
						loading: true,//隐藏加载动画图
            page_2: that.data.page_2 + 1,
						isShows:false ,//隐藏
					})
				}
			}
			
		})
	},

	//@lee播放视频
	// playsVideo: function () {
	// 	this.setData({
	// 		isVideo: 1
	// 	})
	// },

	imgViewByidX: function (event) {
		var id = event.currentTarget.dataset.id;//获取data-src
		var src = event.currentTarget.dataset.src;//获取data-src

		// var imgList = event.currentTarget.dataset.list;//获取data-list
		wx.request({
		url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Homesubmit&act=info',
		data: { id: id ,token: app.globalData.token},
		success: function (res) {
			var imgList = res.data.data.imgarray;

			//图片预览
			wx.previewImage({
				current: src, // 当前显示图片的http链接
				urls: imgList, // 需要预览的图片http链接列表
			})

		}//wx.request
		})

	},
	//@lee评分跳转
	gotoGradeResult0: function (event) {
		console.log(1113);
		var xid = event.currentTarget.dataset.xid;
		var pfresid = event.currentTarget.dataset.pfresid;
		var mid = wx.getStorageSync('mid');
		if (pfresid>0){
		wx.navigateTo({
		url: "/pages/myGradeResult/myGradeResult?lid=" + xid+"&uid="+mid
		})
		}else{
		wx.navigateTo({
		url: "/pages/myGrade/myGrade?id="+xid
		})
		}
	},
	//@lee 打卡
	gotoCireBtnsCard: function (event) {
		var xid = event.currentTarget.dataset.xid;
		wx.navigateTo({
		url: "/pages/circleSign/circleSign?xid="+xid
		})
	},
	//预览图片
    imgView:function(event){
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
	// 回复
	// replys(){
	// 	console.log('88888888888888')
	// },
	// 点赞
	handleLike: function(event) {
	},


	// 取消关注圈主，吊炸天@lee
	quxiaoQuanzhu: function (event) {
		var that = this;
		var infocirclecard = that.data.infocirclecard;
		var mid = wx.getStorageSync('mid');
		var fid = event.currentTarget.dataset.fid;
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=unFollow',
		data: { fid: fid, mid: mid,token: app.globalData.token },
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: 'POST',
		success: function (res) {
			wx.showToast({
			title: res.data.info,
			icon: 'none'
			})

			that.setData({
			['infocirclecard.isfollow']: 0
			})
		}

		})
	},
	// 关注圈主，吊炸天@lee
	guanzhuQuanzhu: function (event) {
		var that = this;
		var infocirclecard=that.data.infocirclecard;
		var mid = wx.getStorageSync('mid');
		var fid = event.currentTarget.dataset.fid;
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=doFollow',
		data: { fid: fid, mid: mid ,token: app.globalData.token},
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		method: 'POST',
		success: function (res) {
			wx.showToast({
			title: res.data.info,
			icon: 'none'
			})
			
			that.setData({
			['infocirclecard.isfollow']:1
			})
		}

		})
	},
	// 点赞@lee 改造点赞
	handleZanX: function (event) {
		var that = this;
		var mid = wx.getStorageSync('mid');
		var id = event.currentTarget.dataset.id;
		var xiabiao = event.currentTarget.dataset.xiabiao;
		var values = event.currentTarget.dataset.values;
		var iszan = event.currentTarget.dataset.iszan;
		var iszanadd = parseInt(values - 1 + 2);
		var iszandelete = parseInt(values - 1);
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=praise',
		data: { subid: id, mid: mid ,token: app.globalData.token},
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
				['infoCircleCardhomesubmitlist[' + xiabiao + '].ispraise']: 1,
				['infoCircleCardhomesubmitlist[' + xiabiao + '].zan_count']: iszanadd
			})
			} else {
			that.setData({
				['infoCircleCardhomesubmitlist[' + xiabiao + '].ispraise']: 0,
				['infoCircleCardhomesubmitlist[' + xiabiao + '].zan_count']: iszandelete
			})
			}
		}

		})
	},
	//@lee 抄袭首页的收藏功能
	collectionButtonX: function (e) {
		var that = this;
		var mid = wx.getStorageSync('mid');
		var subid = e.currentTarget.dataset.index;
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
			//本地处理即可。不需要调用接口@lee
			wx.showToast({
			title: res.data.info,
			icon: 'none'
			})
			if (iscollection == 0) {
			that.setData({
				['infoCircleCardhomesubmitlist[' + xiabiao + '].iscollection']: 1
			})
			} else {
			that.setData({
				['infoCircleCardhomesubmitlist[' + xiabiao + '].iscollection']: 0
			})

			}
		}//wx.reque

		})
	},
	// imgViewByidX: function (event) {
	// 	var id = event.currentTarget.dataset.id;//获取data-src
	// 	var src = event.currentTarget.dataset.src;//获取data-src
	//
	// 	// var imgList = event.currentTarget.dataset.list;//获取data-list
	// 	wx.request({
	// 	url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homesubmit&act=info',
	// 	data: { id: id ,token: app.globalData.token},
	// 	success: function (res) {
	// 		var imgList = res.data.data.imgarray;
	//
	// 		//图片预览
	// 		wx.previewImage({
	// 		current: src, // 当前显示图片的http链接
	// 		urls: imgList // 需要预览的图片http链接列表
	// 		})
	//
	// 	}//wx.request
	// 	})
	//
	// },




// ================新增绘图处理=================

	//触发邀请好友 生成图片分享
	inviteDraw(){
		var id = this.data.idK;
		var mid = wx.getStorageSync('mid');
		var infocirclecard = this.data.infocirclecard;
		var imgindex = infocirclecard.imgindex;
		console.log('触发生成图片')
		this.setData({
			Models : true,
			noScroll: true ,
			hiddens:true ,
		})
		var that = this;
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=circleshare',
			data: {token: app.globalData.token,id:id,mid:mid},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log(res.data.data);
				var sharesubmitinfo = res.data.data;
				that.setData({
					['productDetail.TxImg']: sharesubmitinfo.touxiang,
          			['productDetail.TxImg2']: imgindex,
					['productDetail.TxImg3']: sharesubmitinfo.qr_img,
					['productDetail.courseName']: sharesubmitinfo.title,
					['productDetail.artistName']: sharesubmitinfo.uname,
					sharesubmitinfo: sharesubmitinfo,
				})
				//加载完再绘制
				that.draw();
			}

		})

		//绘制
		// this.draw();
	},
	isnetworkType: function () {
		var that = this;
		wx.getNetworkType({
		success: function (res) {
			// 返回网络类型, 有效值：@lee
			// wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
			var networkType = res.networkType;
			if (networkType == 'wifi') {
			that.setData({
				autoplays: true,
			})
			}
		}
		})
	},

	draw() {
		if( this.data.screenHeight < 667 ){
			this.setData({
				IMGT: 30 ,
			})
		}else if ( this.data.screenHeight >749 ) {
			this.setData({
				IMGT: 130 ,
				IMGB: 100 ,
			})
		}else if( this.data.screenHeight >810 ){
			this.setData({
				IMGT: 150 ,
				IMGB: 100 ,
			})
		}

		wx.showLoading({
			title: '图片加载中...',
			mask:true,
		});
		const {
			WIDTH,
			HEIGHT,
			productDetail
		} = this.data;
		ctx = wx.createCanvasContext('myCanvas');

		// 为了显示canvas的边框阴影 宽高都加了40px 然后进行移动位置 20 20
		// ctx.translate(20, 20);

		//0. 获取图片信息
		Promise.all([
			wxp.getImageInfo({
				src: this.data.productDetail.TxImg //头像
			}),
			wxp.getImageInfo({
				src: this.data.productDetail.TxImg3 //二维码
			}),
			wxp.getImageInfo({
				src: this.data.productDetail.TxImg2 //封面
			}),
		]).then(res => {
			console.log(res)

			const imgTx = res[0].path ;	//头像
			const imgEwm = res[1].path ; //二维码
			const imgCont = res[2].path ; //封面

			console.log('屏幕尺寸是：' + WIDTH, HEIGHT)

			//1. 背景
			ctx.save();
			ctx.setFillStyle('#fff');
			ctx.fillRect(0, 0 , WIDTH, HEIGHT);
			ctx.restore();

			// 2. 用户头像
			let avatarurl_width = 96; //绘制的头像宽度
			let avatarurl_heigth = 96; //绘制的头像高度
			let avatarurl_x = 40; //绘制的头像在画布上的位置
			let avatarurl_y = 50; //绘制的头像在画布上的位置
			ctx.save();
			ctx.beginPath(); //开始绘制
			ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
			ctx.clip();
			ctx.drawImage( imgTx , avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); //必须是正方形图，否则无法裁剪
			ctx.restore(); 

			// 3. 用户名
			ctx.save();
			ctx.font = 'bold 32px arial';
			ctx.fillStyle = '#333333';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.fillText(this.getSub(this.data.productDetail.artistName, 10) , 151, 55);   //文字位置
			ctx.restore();

			// 4. 邀请语
			ctx.save();
			ctx.font = 'normal 28px arial';
			ctx.fillStyle = '#666666';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.fillText('邀请您加入一个很棒的书法学习圈子', 151, 110);   //文字位置
			ctx.restore();

			// 5. 内容区 
			// 5.1 课程名-前
			ctx.save();
			ctx.font = 'normal 130px arial';
			ctx.fillStyle = '#333333';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.fillText('“', 45, 160);   //文字位置
			ctx.restore();

			// 5.2 课程名
			CTB({
				ctx,
				text: this.getSub(this.data.productDetail.courseName, 25),
				x: 40,
				y: 265,
				w: 540,
				fontStyle: {
					lineHeight: 58,
					textAlign: 'left',
					textBaseline: 'top',
					font: '600 40px arial',
					fontSize: 40,
					fillStyle: '#333333'
				}
			});

			//5.22 封面图
			ctx.save();
			// ctx.fillRect(0, 0 , WIDTH, HEIGHT);
				console.log('屏幕尺寸是：' + WIDTH, HEIGHT)
			ctx.drawImage(imgCont  , 45 , 386 , 550, 323 );
			ctx.restore();

			// 5.3 课程名-后
			let contentHeight = this.data.productDetail.courseName.length ;//内容长度
			// console.log('文字长度：'+ contentHeight  )
			let endHeight = 0 ;
			if ( contentHeight <= 13  ) {
				endHeight = 440 + 58 * 5 ;
			}
			if (contentHeight >= 14) {
				endHeight = 440 + 58 * 5 ;
			}
			ctx.save();
			ctx.font = 'normal 130px arial';
			ctx.fillStyle = '#333333';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.fillText('”', WIDTH - 80, endHeight);   //文字位置
			ctx.restore();

			// 6. 底部 
			// 6.1 小程序码
			ctx.save();
			ctx.drawImage(imgEwm, 40, 820, 140, 140);
			ctx.restore();

			// 6.2 文字1
			ctx.save();
			ctx.font = 'normal 34px arial';
			ctx.fillStyle = '#A80909';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.fillText('六品练字' , 200 , 840);   //文字位置
			ctx.restore();

			//6.3 文字2
			ctx.save();
			ctx.font = 'normal 24px arial';
			ctx.fillStyle = '#666666';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.fillText('长按二维码识别小程序', 200 , 900);   //文字位置
			ctx.restore();


			ctx.draw(false, () => {
				setTimeout(() => {
				
					// 生成图片
					wxp.canvasToTempFilePath({
						canvasId: 'myCanvas',
					}).then(({
						tempFilePath
					}) => {
						this.setData({
							cardCreateImgUrl: tempFilePath
						});
						wx.hideLoading();
					});

				}, 500);

			});

		}).catch(err=>{
			console.log(err)
			wx.showToast({
				icon:'none',
				title: '获取信息失败',
			});
		})
		
	},

	// 保存到相册
	saveLoca:function(){
		let _this = this ;
		// 获取授权：图片保存到相册
		let imgs = this.data.cardCreateImgUrl;
		wx.saveImageToPhotosAlbum({
			filePath: imgs,
			success(res) {
				console.log(res)
				wx.showToast({
					title: '保存图片成功',
				});
			},
			fail(err) {
				console.log(err)
				wx.hideLoading();
				//授权
				_this.setData({
					ModelsShow: true 
				})
			}
		})
	},


	closeBox:function(e){
		console.log('关闭了')
		this.setData({
			Models : false,
			noScroll: '' ,	
			hiddens:false,
		})
		wx.hideLoading();
		// var xid = e.target.dataset.xid;
		// if (xid>0){
		// 	wx.navigateTo({
		// 		url: '/pages/circleInfoCardAllInfo/circleInfoCardAllInfo?id=' + xid
		// 	})
		// }else{
		// 	wx.switchTab({
		// 		url: "/pages/myRankingCard/myRankingCard"
		// 	})
		// }
	},


	/**
	 * 视频部分处理方法
	 * @param  e 
	 */
	//视频播放结束
	videoEnds(){
		console.log('视频播放完了。')
    var videoContext = wx.createVideoContext('myVideo', this);
    videoContext.exitFullScreen();
		this.setData({
			videoEndText: true ,
			videoCoverEndText: true ,
		})
	},
	//播放视频
	playsVideo: function () {
		this.setData({
			videoEndText: false ,
			videoCoverEndText: false ,
			// autoplays: true ,
		})
	},
	//进出全屏模式
	fullscreenchange(event){
		// console.log('触发全屏模式了--')
		// console.log(event)
		let _this = this ; 
		if(event.detail.direction=="horizontal" ){
			// console.log('进入全屏模式')
		}else{
			// console.log('退出全屏模式')
			if(_this.data.currentTime!==0){
				_this.setData({
					videoEndText: false ,
				})
			}
		}
	},
	//播放进度
	bindtimeupdates(event){
		this.setData({
			currentTime:event.detail.currentTime ,
		})
	},





	/**
	 * 上传图片
	 * @param  e 
	 */
	uploadFiles: function (e) {
		var _this = this;
    console.log(_this);
    upFiles.chooseImageCard(_this, _this.data.maxUploadLen);
    // console.log( _this.data.newdatass );
    // setTimeout(()=>{
    //   if (_this.data.newdatass.length !== undefined   ) {
    //     wx.redirectTo({
    //       url: '/pages/circleSign/circleSign'
    //     })
    //   }
    // },2000)
	},

	// 上传文件
	subFormData:function(){
		let _this = this;
		let upData = {};
		let upImgArr = _this.data.upImgArr;
		let upVideoArr = _this.data.upVideoArr;
		_this.setData({
			upFilesProgress:true,
		})
		upData['url'] = config.service.upFiles;
		upFiles.upFilesFun(_this, upData,function(res){
			if (res.index < upImgArr.length){
				upImgArr[res.index]['progress'] = res.progress
				
				_this.setData({
					upImgArr: upImgArr,
				})
			}else{
				let i = res.index - upImgArr.length;
				upVideoArr[i]['progress'] = res.progress
				_this.setData({
					upVideoArr: upVideoArr,
				})
			}
		//   console.log(res)
		}, function (arr) {
			// success
			console.log(arr)
		})
	},

	/**
	 * @yang
	 * @param 附近书友
	 */
	//获取用户地址位置
	getLocation(){
		let _this = this ;
		var mid = wx.getStorageSync('mid');
		wx.getLocation({
			// type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
			success(res) {
				console.log(res.longitude , res.latitude)
				_this.setData({
					nearby: false ,
					longitude: res.longitude,
					latitude: res.latitude,
				})
				wx.request({
					url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=nearfriend',
					data: { mid: mid,cid:_this.data.idK,lng:res.longitude,lat:res.latitude,token: app.globalData.token},
					success: function (rr) {
						console.log(rr.data.data);
						if(rr.data.data.count != 0){
							_this.setData({
								nearfriend:rr.data.data,
								markers:rr.data.data.markers
							})
						}

					}

				})
			},
			fail(err){
				console.log(err)
				//授权
				_this.setData({
					nearbyShow: true 
				})
			}
		})

	},


































	/**
	 * @desc 获取裁剪后的字符串
	 */
	getSub(str='',max=1){
		return str.length > max ? `${str.substr(0, max)}...` : str;
	},
	/**
	 * 定闹钟
	 * @param e
	 */
	alarm:function(e){
		var cid = this.data.idK;
		console.log(cid);
		wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
			url: "/pages/myClock/myClock?cid="+cid
		})
	}

})