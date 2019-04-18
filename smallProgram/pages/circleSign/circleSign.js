//获取应用实例
// var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../utils/config.js')
var util = require('../../utils/util.js')
var upFiles = require('../../utils/upFiles.js')
//获取应用实例
var Wxmlify = require('../../components/wxmlify/wxmlify')
// var sample = require('../../sample')

const app = getApp()
Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		activeNames : [''] ,
		value: '',	//输入框内容
		isSHOW: true, //是否展示输入框
    	contentA:'',//内容
		upFilesBtn:true,
		upFilesProgress:false,
		maxUploadLen:6,
		maxUploadLenBack:0,
		checked: false ,	//开关

		// upImgArr : [],
		newdatass :'',
    	disableds:0,
		show: false,
		onSHow:'所有人可见',	//默认公开
		// onSHowText:'所有人可见',
		actions: [	//弹出菜单
			{
				name: '所有人可见',
        		isshow: 1
			},
			{
				name: '仅自己可见',
        		isshow: 0
			},
		],
		content:'',	//输入框内容

		infoCircleCardhomesubmitlist:[],

		idK: 0,
		page: 1,
		shows:true,	//控制是否显示推荐评分模块
		// listHeights:'',//父元素高度
		// tbodyHeight:'',
		// screenHeight:'',//屏幕高
		// navHeight:'',	//导航栏高度
		isShows:false,  //默认不显示
		isloading:false,//默认不显示加载动画

	},
    onLoad(e){
		let _this = this ;
		// var img=wx.getStorageSync('img');
		// console.log(img);console.log(34343);
		_this.setData({
			// isSHOW:true,
			xid:e.xid,
		})
		var id=e.xid;
		_this.circleSigndaka(id);
		_this.getMysubmitlist();
		// this.setData({ newdatass: img });
			
		// var img = wx.getStorageSync('img');
		// console.log(img); console.log(34343);
		// this.setData({ newdatass: img });

	},
	onReady(e){
		let _this = this ;
		var img = wx.getStorageSync('img');
		var imgcount = wx.getStorageSync('imgcount');
		wx.removeStorageSync('imgcount');
		_this.setData({ newdatass: img, disableds: imgcount });
		console.log('走这里=====')
		console.log(_this.data.newdatass)
		setTimeout(()=>{
			if (_this.data.newdatass.length >= _this.data.maxUploadLen) {
				console.log('图片超过限制')
				_this.setData({
					upFilesBtn: false,
				})
			}
		},100)
	},
	onUnload() {
		wx.removeStorageSync('img');
	},

	//选择 是否公开
	onSelected(){
		console.log('点我了***')
		this.setData({ show: true });
	},
	onClose() {
		this.setData({ show: false });
	},
	
	onSelect(event) {
		console.log(event.detail);
		this.setData({
			onSHow:event.detail.name,
    	isshow: event.detail.isshow
		});
		this.setData({ show: false });
	},

	//是否展开顶部课程信息
	changes:function(event){
		// console.log('====**===')
		// console.log(event)
		let _this = this ;
		if ( event.detail.length == 2 ) {
			console.log('当前是展开状态')
			_this.setData({
				isSHOW:false,
				activeNames:event.detail
			})
		}else{
			console.log('当前是收起来状态')
			console.log( event)
			_this.setData({
				// isSHOW:true,
				value: _this.data.content,
				activeNames:event.detail
			})
			setTimeout(()=>{
				_this.setData({
					isSHOW:true,
				})
			},500)
		}
		// console.log( this.data.activeNames )
	},

	//替换函数，无限可能@lee
	srcUrlreplace: function (str1) {
		var str = str1 + "";
		// var str = "this is test string <img src=\"http:yourweb.com/test.jpg\" width='50' > 123 and the end <img src=\"所有地址也能匹配.jpg\" /> 33! <img src=\"/uploads/attached/image/20120426/20120426225658_92565.png\" alt=\"\" />"
		var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
		var imgReg = /<img.*?(?:>|\/>)/gi;
		var length = 0;
		var arr = str.match(imgReg);
		if (!arr) {
		length = 0;
		} else {
		var length = arr.length;
		}
		for (var i = 0; i < length; i++) {
		var src = arr[i].match(srcReg);
		if (src[1]) {
			console.log(src[1]);
			str = str.replace(src[1],app.globalData.config_host + src[1])
		}

		}
		// console.log(str);
		return str;
	},

	//@lee 打卡提交
	circleSigndaka: function (id) {
		var that = this;
		console.log(id);
		
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=circleSign&xid='+id,
		data: { ids: 1 ,token: app.globalData.token },
		success: function (res) {
			
			var infocircleSigndaka = res.data.data;
			var as = infocircleSigndaka.prompt;
			console.log(as);
			as = that.srcUrlreplace(as);
			that.setData({
			infocircleSigndaka: infocircleSigndaka
			})

			// 富文本解析
			var wxmlify = new Wxmlify(as, that, {
			preserveStyles: ['fontSize', 'fontWeight', 'fontStyle', 'color', 'textDecoration', 'textAlign', 'backgroundColor', 'background'],
			dataKey: 'nodes',
			disableImagePreivew: false,
			onImageTap: function (evt) {
				console.log(evt)
			}
			})

			console.log(wxmlify.getFullNodes())
		}

		}) //wx.request

	},

	// 预览图片
	previewImg: function (e) {
		let imgsrc = e.currentTarget.dataset.presrc;
		let _this = this;
		let arr = _this.data.newdatass;
		let preArr = [];
		arr.map(function(v,i){
			preArr.push(v.path)
		})
	//   console.log(preArr)
		wx.previewImage({
			current: imgsrc,
			// urls: preArr
			urls: [imgsrc]
		})
	},


  	// 删除上传视频--暂未用
	// delFile:function(e){
	// 	let _this = this;
	// 	wx.showModal({
	// 		title: '提示',
	// 		content: '您确认删除嘛？',
	// 		success: function (res) {
	// 			if (res.confirm) {
	// 				let delNum = e.currentTarget.dataset.index;
	// 				let delType = e.currentTarget.dataset.type;
	// 				let upImgArr = _this.data.upImgArr;
	// 			let newdatass = _this.data.newdatass;
	// 				let upVideoArr = _this.data.upVideoArr;
	// 				if (delType == 'image') {
	// 					upImgArr.splice(delNum, 1)
	// 			newdatass.splice(delNum, 1)
	// 					_this.setData({
	// 				upImgArr: upImgArr, newdatass,newdatass, disableds: newdatass.length
	// 					})
	// 				} else if (delType == 'video') {
	// 					upVideoArr.splice(delNum, 1)
	// 					_this.setData({
	// 						upVideoArr: upVideoArr,
	// 					})
	// 				}
	// 				let upFilesArr = upFiles.getPathArr(_this);
	// 				if (upFilesArr.length < _this.data.maxUploadLen) {
	// 					_this.setData({
	// 						upFilesBtn: true,
	// 					})
	// 				}
	// 			} else if (res.cancel) {
	// 				console.log('用户点击取消')
	// 			}
	// 		}
	// 	})
	// },

  	// 删除上传图片
	delFileX: function (e) {
		let _this = this;
		wx.showModal({
			title: '提示',
			content: '您确认删除嘛？',
			success: function (res) {
				if (res.confirm) {
					let delNum = e.currentTarget.dataset.index;
					let newdatass = _this.data.newdatass;
					newdatass.splice(delNum, 1)
					_this.setData({
						newdatass: newdatass, 
						disableds: newdatass.length,
						upImgArr: newdatass ,
					})
					let upFilesArr = upFiles.getPathArr(_this);
					// console.log(upFilesArr)
					if (upFilesArr.length < _this.data.maxUploadLen) {
						_this.setData({
							upFilesBtn: true,
							maxUploadLenBack: _this.data.maxUploadLen - upFilesArr.length ,
						})
					}
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	// 选择图片或者视频
	// uploadFiles: function (e) {
	// 	var _this = this;
	// 	wx.showActionSheet({
	// 	//	itemList: ['选择图片','选择视频'],
	//     	itemList: ['选择图片'],
	// 		success: function (res) {
	// 		  //   console.log(res.tapIndex)
	// 			let xindex = res.tapIndex;
	// 			if (xindex == 0){
	// 				upFiles.chooseImage(_this, _this.data.maxUploadLen)
	// 				//获取第一张图片地址 @lee
	// 				// console.log(newdatass);
	// 			} else if (xindex == 1){
	// 				upFiles.chooseVideo(_this, _this.data.maxUploadLen)
	// 			}
	// 		},
	// 		fail: function (res) {
	// 			console.log(res.errMsg)
	// 		}
	// 	})
	// },
	//更新 选择图片
	uploadFiles: function (e) {
		var _this = this;
		var newMaxUploadLenBack = 0 ;
		if (_this.data.maxUploadLenBack!==0) {
			// console.log('剩余数目是：'+  _this.data.maxUploadLenBack )
			newMaxUploadLenBack =  _this.data.maxUploadLenBack
		} else {
			newMaxUploadLenBack = _this.data.maxUploadLen 
		}
		// console.log( newMaxUploadLenBack   )
		upFiles.chooseImage(_this, newMaxUploadLenBack)
	},

	//获取用户输入的用户名
	bindTextAreaBlur:function(e){ 

		this.setData({
			contentA: e.detail
		})

	},

	// 上传文字和链接信息
	submitdaka: function (e) {
		var that=this;
		var contentA = this.data.contentA;
		var xid = e.currentTarget.dataset.xid;
		var mid = wx.getStorageSync('mid');
		console.log(this.data.newdatass); 
		var newss = this.data.newdatass;
		var recommend = 0;
		var checked = this.data.checked;
		if (checked == true) {
		recommend = 1;
		}
		var is_show = this.data.isshow;
		if (is_show == 0) {
		is_show = 0;
		}
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homesubmit&act=addContent',
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},  
		data: { content: contentA, imageUrl: newss, mid: mid, xid: xid, recommend: recommend,is_show:is_show,token: app.globalData.token },
		success: function (res) {
			var resdata=res.data;
			console.log(resdata.info);
			if (resdata.status==0){
				wx.showToast({
				title: resdata.info
				});
			}else{
			wx.showToast({
			title: '成功...'
			});
			wx.navigateTo({
				url: "/pages/myRankingShare/myRankingShare?id=" + resdata.data
			})
						setTimeout(() => {
							that.setData({
								contentA:'',
								newdatass:'',
								disableds:'0'
							})
						}, 200);
			}
		
		}
		
	});
	},

	// 上传文件
	subFormData:function(){
	console.log(333);
	console.log(this.data.newdatass);
	console.log(222);
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
	chooseImage: function () {
		console.log('执行了我呀')
		var that = this;
		//console.log('aaaaaaaaaaaaaaaaaaaabbb');


		wx.chooseImage({
		count: 1,
		success: function (res) {
			//console.log('ssssssssssssssssssssssssss')
			//缓存下 
			wx.showToast({
			title: '正在上传...',
			icon: 'loading',
			mask: true,
			duration: 2000,
			success: function (ress) {
				console.log('成功加载动画');
			}
			})
			console.log(res.tempFilePaths);
			that.setData({
			imageList: res.tempFilePaths
			})
			//获取第一张图片地址 
			var filep = res.tempFilePaths[0]
			//向服务器端上传图片 
			// getApp().data.servsers,这是在app.js文件里定义的后端服 务器地址 
			wx.uploadFile({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Qiniu&act=postimg',
			filePath: filep,
			name: 'file',
			formData: {
				'user': 'test'
			},
			success: function (res) {

				console.log(res.data)
				var sss = JSON.parse(res.data)
				//var dizhi = sss[0];
				var dizhi = sss['options']['custom_path'];
				var dizhi2 = sss[0]['savename'];
				var dizhi3 = 'http://test.liupinshuyuan.com/data/upload/dakaprogram/' + dizhi + dizhi2;
				//输出图片地址 
				console.log(dizhi3);
				that.setData({
				"dizhi": dizhi3,
				'test2': dizhi3
				})

				//do something  
			}, fail: function (err) {
				console.log(err)
			}
			});
		}
		})
	},

	// 申请推荐
	selectBtn({ detail }) {
		// 需要手动对 checked 状态进行更新
		this.setData({ checked: detail });
	},


	// 页面下拉刷新回调接口
	onPullDownRefresh: function () {
		// this.setData({
		// 	page: 1,
		// 	infoCircleCardhomesubmitlist: [],
		// })
		// this.getMysubmitlist();
		// wx.stopPullDownRefresh();
	},

    // 上拉加载数据
	onReachBottom: function() {
    // console.log( '触发底部了');
    // this.setData({
    //         isShows:true,
    //         isShowsText:'正在拼命的捞数据',
    //         isloading:true,
		// })
    // this.getMysubmitlist();
	},

	//打卡记录
  getMysubmitlist(){
    	var that =this;
		var idK = this.data.xid; 
    	var pages=this.data.page
		var mid = wx.getStorageSync('mid');
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Practises&act=myhwlistByid&id='+idK,
			data:{ mid:mid,token:app.globalData.token},
			success: (ret) => {
				let newList = [];
				let lists = ret.data.data||[];
        ;
				// console.log( lists.length)
				// if (lists.length == 0) {
				// 	that.setData({
				// 		allloaded: true, 
				// 		isloading:false,
				// 		isShowsText:'数据加载完了',
				// 	})
				// }else{
          lists
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
						
		})
		that.setData({
			page: pages + 1,
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


	//打卡日记图预览
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
					urls: imgList // 需要预览的图片http链接列表
				})
			}//wx.request
		})
	},




})