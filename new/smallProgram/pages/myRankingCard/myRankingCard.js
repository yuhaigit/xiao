//获取应用实例
// var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../utils/config.js')
var util = require('../../utils/util.js')
var upFiles = require('../../utils/upFiles.js')

const app = getApp()
Page({
    data: {
		showIcon: false, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色
    	contentA:"",
		activeNames : [''] ,
		value: '',	//输入框内容
    	issshow:1,
		upFilesBtn:true,
		upFilesProgress:false,
		maxUploadLen:6,
		maxUploadLenBack:0,
      	isLogindialog: false,
		checked: false ,	//开关

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
		disableds:0,	//按钮是否可点击 默认不可点

	},



	onLoad(){
		var mid = wx.getStorageSync('mid');
		var isloginOauth = app.loginOauth('1', '/pages/myRankingCard/myRankingCard','2');
		if (isloginOauth == 0) {
			return;
		}
	},

	getUserInfo2: function () {
		console.log(444);
		var that = this;
		wx.login({
		success: function (res) {
			console.log(res);
			if (res.code) {
			//获取用户信息
			wx.getUserInfo({
				success: function (msg) {
				//发起网络请求
				wx.request({
					url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Logins&act=userLogin',
					method: 'POST',
					header: {
					// 'content-type': 'application/json'
					'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
					code: res.code,
					encryptedData: msg.encryptedData,
					iv: msg.iv
					},
					success: function (ress) {
					console.log(8989);
					var mid = ress.data.mid;
					wx.setStorageSync('mid', mid);
					// that.onPullDownRefresh()//重点   重新执行下onLoad去获取当前的数据
					// // wx.switchTab({
					// //   url: '/pages/home/home',
					// // })
					that.setData({
						isLogindialog: false,
					})
					},
					fail: function (res) {
					console.log(444)
					}
				})
				},
				fail: function (res) {
				console.log(777888)
				that.setData({
					isLogindialog: true,
				})
				}
			})
			}
		}
		});

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
		console.log(event);
		this.setData({
			onSHow:event.detail.name,
    	isshow: event.detail.isshow
		});
		this.setData({ show: false });
	},




	changes:function(event){
		console.log('====**===')
		console.log(event)
		this.setData({
			activeNames:event.detail
		})
	},



	// 预览图片
	previewImg: function (e) {
		let imgsrc = e.currentTarget.dataset.presrc;
		console.log(imgsrc)
		let _this = this;
		let arr = _this.data.upImgArr;
		let preArr = [];
		arr.map(function(v,i){
			preArr.push(v.path)
		})
	  	console.log(preArr)
		wx.previewImage({
			current: imgsrc,
			// urls: preArr
			urls: [imgsrc]
		})
	},
	// 删除上传图片 或者视频
	delFile:function(e){
		let _this = this;
		wx.showModal({
			title: '提示',
			content: '您确认删除嘛？',
			success: function (res) {
				if (res.confirm) {
					let delNum = e.currentTarget.dataset.index;
					let delType = e.currentTarget.dataset.type;
					let upImgArr = _this.data.upImgArr;
					let newdatass = _this.data.newdatass;
					let upVideoArr = _this.data.upVideoArr;
					if (delType == 'image') {
						// upImgArr.splice(delNum, 1)
						newdatass.splice(delNum, 1)
						_this.setData({
							upImgArr: newdatass, 
							newdatass: newdatass, 
							disableds: newdatass.length
						})
					} else if (delType == 'video') {
						upVideoArr.splice(delNum, 1)
						_this.setData({
							upVideoArr: upVideoArr,
						})
					}
					let upFilesArr = upFiles.getPathArr(_this);
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
	//获取用户输入的用户名
	bindTextAreaBlur: function (e) {

		this.setData({
		contentA: e.detail
		})
	},
	// 上传文字和链接信息
	submitdaka: function (e) {
		var that = this;
		var contentA = this.data.contentA;
	
		var recommend = 0;
		var checked = this.data.checked;
		var is_show = this.data.isshow;
		if (is_show == 0) {
		is_show = 0;
		}
		if (checked==true){
		recommend=1;
		}
		var mid = wx.getStorageSync('mid');
		var newss = this.data.newdatass;
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homesubmit&act=addContentfree',
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		data: { content: contentA, imageUrl: newss, mid: mid, recommend: recommend, is_show, is_show, token: app.globalData.token},
		success: function (res) {
			var resdata = res.data;
			console.log(resdata); console.log(777);
			if (resdata.status == 0) {
			wx.showToast({
				title: resdata.info
			});
			} else {
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
	// 选择图片或者视频
	// uploadFiles: function (e) {
	// 	var _this = this;
	// 	wx.showActionSheet({
	//     // itemList: ['选择图片', '选择视频'],
	//     itemList: ['选择图片'],
	// 		success: function (res) {
	// 		  //   console.log(res.tapIndex)
	// 			let xindex = res.tapIndex;
	// 			if (xindex == 0){
	// 				upFiles.chooseImage(_this, _this.data.maxUploadLen)
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

		upFiles.chooseImage(_this, newMaxUploadLenBack)
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

	// 申请推荐
	selectBtn({ detail }) {
		// 需要手动对 checked 状态进行更新
		console.log(detail);
		this.setData({ checked: detail });
	}





})