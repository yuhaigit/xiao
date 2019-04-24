//获取应用实例
const app = getApp()
import Dialog from '../../dist/dialog/dialog';
Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		activeNames : ['1'] ,

		ads:'',	//是否显示
		isDatas: false ,//无数据
		page: 1,
		size: 10,
		daka: [],
    	placeTitle: '输入评论',
		test: '正在加载中...',
    	circleText:"我也要加入这个圈子",
		uid:'',//传递uid
		mid:'',//登陆uid
		tbodyHeight:0 ,	//高度

		show:true ,

		isfocus:false,
		placeholderText:'输入评论',
		contentA:'',	//输入框文字
		// PD: 3 ,
		system :'', 
		keyboardH:'',//键盘高度
	},
    onReady:function(){
		let _this = this ;
		wx.getSystemInfo({
		  	success: function(res) {
			    console.log(res)
			    console.log(res.windowHeight)
				_this.setData({
					tbodyHeight : res.windowHeight
				})
				// if(res.platform == "devtools"){
				// 	console.log('PC端使用')
				// }else if(res.platform == "ios"){
				// 	console.log('ios端使用')
				// 	_this.setData({
				// 		system:'ios' ,
				// 	})
				// }else if(res.platform == "android"){
				// 	console.log('安卓端使用')
				// 	_this.setData({
				// 		system:'android' ,
				// 		PD : 8 ,
				// 	})
				// }


			
		  	}
		})
			
		console.log(this.data.tbodyHeight)
	},
	//获取用户输入的用户名
	bindTextAreaBlur: function (e) {
		console.log(111);
		this.setData({
		contentA: e.detail
		})
	},
	// 发送上传文字和链接信息
	commentSending: function (e) {
		var that = this;
		that.setData({
			keyboardH: 0 ,
		})
		let mid = wx.getStorageSync('mid');
		var hid = that.data.id;//获取data-src
		var isloginOauth = app.loginOauth('2', '/pages/circleSignInfo/circleSignInfo?id=' + hid);
		if (isloginOauth == 0) {
			return;
		}
		var commentid = that.data.commentid;//获取data-src
		var type = that.data.type;//获取data-src
		var reviewsid = that.data.reviewsid;//获取data-src
		var contentA = that.data.contentA;
		wx.request({
		url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Infosubmit&act=addCommentNew',
		data: { mid: mid,type, content: contentA, reviewsid, commentid, hid: hid, token: app.globalData.token },
		success: function (res) {
			var status = res.data.status;
			if (status == 2) {
			Dialog.alert({
				title: '提示',
            message: '您的账户操作异常,暂时锁定',
				confirmButtonText: '立即联系客服',
				confirmButtonOpenType: "contact",
				closeOnClickOverlay: true,
			}).then(() => {
				// on close
				console.log('跳转客服')
			});
			} else if (status == 3) {
			wx.showToast({
				title: res.data.info,
				icon: 'none'
			})
			return;
			} else if (status == 0) {
			wx.showToast({
				title: res.data.info,
				icon: 'none'
			})
			return;
			} else {
			wx.showToast({
				title: res.data.info,
				icon: 'none'
			})
			let Vflag = '1';
			that.oneSubmit(hid,Vflag);
			that.setData({
            type: 0, contentA: "", placeTitle: "输入评论"
			})
			}
		}
		});
	},
    onLoad:function(e){
		let _this = this;
		let mid = wx.getStorageSync('mid');
		// var e={uid:157875};
		var id=e.id;
		_this.setData({
			mid,id
		})
		//页面预加载一次数据
      this.oneSubmit(id);
	
	},
	imgViewByidX: function (event) {
		var id = event.currentTarget.dataset.id;//获取data-src
		var src = event.currentTarget.dataset.src;//获取data-src

		// var imgList = event.currentTarget.dataset.list;//获取data-list
		wx.request({
		url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Homesubmit&act=info',
		data: { id: id, token: app.globalData.token },
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
	//@lee 打卡详情页
	oneSubmit: function (id,Vflag) {
		var that = this;
		let mid = wx.getStorageSync('mid');
		wx.request({
		url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Infosubmit&act=oneinfo&id=' + id,
		data: { mid:mid,token: app.globalData.token },
		success: function (res) {
			if(Vflag=='1'){
				that.scrolls(res.data.data.commentcount);	//滚动到底部
			}
			var oneSubmitdata = res.data.data;
			var circleinfoA = oneSubmitdata.circleinfo;
			oneSubmitdata.circleinfo.card='';
			var circleText='我也要加入';
			if (circleinfoA.hasOwnProperty('isjoin') && circleinfoA.isjoin==1){
			oneSubmitdata.circleinfo.card="Card";
			var circleText ="去圈子内部";
			}
			console.log(oneSubmitdata);
			that.setData({
			oneSubmitdata: oneSubmitdata, circleText
			})
		}
			})
	},
	userSQf:function(){
		// var id=this.data.id;
		// var isloginOauth = app.loginOauth('2', '/pages/circleSignInfo/circleSignInfo?id=' + id);
		// console.log(isloginOauth);
		// if (isloginOauth == 0) {
		// return;
		// }
		this.setData({
			isfocus: true ,
    });
    this.setData({
      placeTitle: "输入评论",commentid: 0, type: 0
		})
		// wx.navigateTo({
		// 	url: "/pages/circleSignInfoReply/circleSignInfoReply?postid=0&hid=" + id
		// })
	},
	userSQ2: function (event) {
		var uname = event.currentTarget.dataset.uname;
		var postid = event.currentTarget.dataset.postid;
		var hid = event.currentTarget.dataset.hid;
		var circle = event.currentTarget.dataset.circle;
		var isloginOauth = app.loginOauth('2', '/pages/circleSignInfo/circleSignInfo?id=' + hid);
		if (isloginOauth == 0) {
		return;
		}
		wx.navigateTo({
		url: "/pages/circleSignInfoReply/circleSignInfoReply?&postid=" + postid + "&hid=" + hid+"&uname="+uname
		})
	},
  replyToUser: function (event) {
    var that=this;
    var uname = event.currentTarget.dataset.uname;
    var uid = event.currentTarget.dataset.uid;
    var hid = that.data.id;
    // var circle = event.currentTarget.dataset.circle;
    var commentid = event.currentTarget.dataset.commentid;//获取data-src
    var type = event.currentTarget.dataset.type;//获取data-src
    var reviewsid = event.currentTarget.dataset.reviewsid;//获取data-src
    var isloginOauth = app.loginOauth('2', '/pages/circleSignInfo/circleSignInfo?id=' + hid);
    if (isloginOauth == 0) {
      return;
    }
    var mid = wx.getStorageSync('mid');
    if(mid==uid){
      wx.showToast({
        title: "请勿自评",
        icon: 'none'
      })
      return;
    }
    this.setData({
      placeTitle: "@" + uname
    })
    this.setData({
      hid, commentid, type, reviewsid
    })
    // wx.navigateTo({
    //   url: "/pages/circleSignInfoReply/circleSignInfoReply?&postid=" + postid + "&hid=" + hid + "&uname=" + uname
    // })
	},
	//@lee 加入圈子神操作
	gotoCireBtns: function (event) {
		var that = this;
		var id = event.currentTarget.dataset.id;
		var circle = event.currentTarget.dataset.circle;
		var mid = wx.getStorageSync('mid');
		var isloginOauth = app.loginOauth('2', '/pages/circleSignInfo/circleSignInfo?id=' + id);
		if (isloginOauth == 0) {
		return;
		}
		wx.request({
		url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Circles&act=joinCircle',
		data: { mid: mid, cid: circle, token: app.globalData.token },
		method: 'POST',
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		success: function (res) {
			wx.showToast({
			title: res.data.info,
			icon: 'none'
		})
			wx.redirectTo({
			url: "/pages/circleInfoCard/circleInfoCard?id=" + circle
			})
		}
		}) //wx.request
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
	


	
	//@lee 首页基本信息获取和推荐圈子样式配置 --收藏
	collectionButton: function (e) {

		var that = this;
		var mid = wx.getStorageSync('mid');
    var subid = e.currentTarget.dataset.id;
    var isloginOauth = app.loginOauth('2', '/pages/circleSignInfo/circleSignInfo?id=' + subid)
		if (isloginOauth == 0) {
			return;
		}
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
            ['oneSubmitdata.iscollection']: 1
					})
				}else{
					that.setData({
            ['oneSubmitdata.iscollection']: 0
					})

				}
			}//wx.reque

		}) 

	},

	// 回复
	replys(){
		Dialog.alert({
			title: '提示',
			message: '您的账户操作异常，暂时锁定。',
			confirmButtonText:'立即联系客服',
			closeOnClickOverlay:true,
		}).then(() => {
			// on close
			console.log('跳转客服')

		});
	},
  // 点赞@lee 改造点赞
  handleZanX: function (event) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    var id = event.currentTarget.dataset.id;;
    var isloginOauth = app.loginOauth('2', '/pages/circleSignInfo/circleSignInfo?id=' + id);
    if (isloginOauth == 0) {
      return;
    }
    var values = event.currentTarget.dataset.values;
    var iszan = event.currentTarget.dataset.iszan;
    var iszanadd = parseInt(values - 1 + 2);
    var iszandelete = parseInt(values - 1);
    console.log(iszan);
    wx.request({
      url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Community&act=praise',
      data: { subid: id, mid: mid, token: app.globalData.token },
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
            ['oneSubmitdata.ispraise']: 1,
            ['oneSubmitdata.zan_count']: iszanadd
          })
        } else {
          that.setData({
            ['oneSubmitdata.ispraise']: 0,
            ['oneSubmitdata.zan_count']: iszandelete
          })
        }
        that.oneSubmit(id);
      }

    })
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


	//预览图片
    imgView:function(event){
		var src = event.currentTarget.dataset.src;//获取data-src
		var imgList = event.currentTarget.dataset.list;//获取data-list
		//图片预览
		wx.previewImage({
			current: src, // 当前显示图片的http链接
			urls: imgList // 需要预览的图片http链接列表
		})
    },

    //加入圈子
    gotoCircle(){
        console.log('8888')
    },

	getUsersFormid_2sk(e){
		app.getUsersFormid_2sk_er3(e)
	},

	//行数变化
	bindlinechange(event){
		let _this = this ;
		console.log('行数变化----')
		console.log(event.detail.lineCount);

		
		// if( _this.data.system=='ios'){
		// 	console.log('ios机型')
		// 	if( event.detail.lineCount>=2 ){
		// 		_this.setData({
		// 			PD : 0 ,
		// 		})
		// 	}else{
		// 		_this.setData({
		// 			PD : 3 ,
		// 		})
		// 	}
		// }
		// if( _this.data.system=='android') {
		// 	console.log('android机型')
		// 	if( event.detail.lineCount>=2 ){
		// 		_this.setData({
		// 			PD : 0 ,
		// 		})
		// 	}else{
		// 		_this.setData({
		// 			PD : 8 ,
		// 		})
		// 	}
		// }



	},
	bindTextAreaBlur(event){
		console.log(event.detail)
		this.setData({
			contentA: event.detail ,
		})

	},
	//获得焦点触发
	bindFocus(event){
		console.log('获得焦点---')
		console.log(  event  )
		this.setData({
			keyboardH: event.detail.height ? event.detail.height : 0 ,
			placeholderText:''
		})
	},
	// bindTextAreaBlur(e) {
	//   console.log(e.detail.value)
	// },

	//失去焦点
	bindBlur(event){
	  	console.log(event.detail.value)
		console.log('触发失去焦点--')
		let _this = this ;
		_this.setData({
			keyboardH: 0 ,
		})
	},

	bindinput(event) {
		console.log(event.detail.value)
		let _this = this ;
		_this.setData({
			contentA: event.detail.value
		})
	},

	//滚动至底部
	scrolls: function (val) {
		let _this = this ;
		let v_HEiGHT = val*120 ;
		console.log(v_HEiGHT)
		wx.createSelectorQuery().select('#b_page').boundingClientRect(function (res) {
			console.log(res)
			// 使页面滚动到底部
			wx.pageScrollTo({
			  	scrollTop: res.bottom + 120 + v_HEiGHT
			})
		}).exec()
	},

})

