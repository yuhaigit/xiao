//获取应用实例
const app = getApp()

// import initCalendar from '../../template/calendar/index';
//引入日历组件
import initCalendar, {
	getSelectedDay,
	setTodoLabels,
	disableDay,
	switchView,
	jump,
  } from '../../template/calendar/index';


Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		activeNames : ['1'] ,
		isSHOW: true ,

		active: 2 ,		//默认周榜
		ads:'',	//是否显示
		isDatas: false ,//无数据
 
		list: [],
		mid:'',//用户uid
		avator:'',//头像
		tol_days:'0',//总打卡天数
		cod_days:'0',//连续打卡天数
		zongshu:'0',//打卡日志总数
		ctime:'',//加入日期
		uname:'',//昵称
		sex:'',//性别
		uedit:'', //
		utype:'', //
		test: '正在加载中...',
		newYear:'',

		daka:[],
		dyear:'',	//年
		dmonth:'',	//月
		dday:'',	//日
		// 打卡记录
		page: 1,
		size: 10,
		nowDate:'',
	},
	onLoad: function (e) {
		console.log(e)
		let _this = this;
		let mid = wx.getStorageSync('mid');
		if (mid == "") {
			var urlArray = {
				urlmodel: '2',
				urlAll: '/pages/myCardCalendar/myCardCalendar'
			}
			wx.setStorageSync('urlArray', urlArray);
			wx.redirectTo({
				url: "/pages/loginUser/loginUser",
			});
			return;
		}
		// let mid = 90216;
		console.log(this.getToday())
		console.log(mid+'123');
		_this.setData({
			mid:mid,
			// nowDate: this.data.dyear+'.'+this.data.dmonth+'.'+this.data.dday ,
			nowDate : this.getToday() ,
			// mid:90216
		})
		// var mid = wx.getStorageSync('mid');console.log(mid);console.log('1111');
		// var uid = wx.get('uid');
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Calendar&act=index',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Calendar&act=index',
			data: {mid:this.data.mid,token: app.globalData.token},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log('11');
				console.log(res.data.data);
				let avator = res.data.data.avator;
				let tol_days = res.data.data.tol_days;
				if(tol_days == null){
					tol_days = 0;
				}
				let cod_days = res.data.data.cod_days;
				if(cod_days == null){
					cod_days = 0;
				}
				let zongshu = res.data.data.zongshu;
				let ctime = res.data.data.ctime;
				let uname = res.data.data.uname;
				let sex = res.data.data.sex;
				let uedit = res.data.data.uedit;
				let utype = res.data.data.utype;
				_this.setData({
					avator: avator,
					tol_days: tol_days,
					cod_days: cod_days,
					zongshu: zongshu,
					uname: uname,
					sex: sex,
					uedit: uedit,
					utype: utype,
					ctime: ctime,
				})
			},

		})
		//页面预加载一次数据
		this.getList(mid);
	},

	getList(c){
		var now = new Date();
		console.log(now);
		console.log(c);
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var day = now.getDate();
		console.log(year);
		console.log(month);
		console.log(day);
		var _that = this;
		wx.request({
			url: app.globalData.config_host+ '/index.php?app=dakaprogram&mod=Calendar&act=calendar',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Calendar&act=calendar',
			data: {mid:c,y:year,m:month,d:day,token: app.globalData.token},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log(res.data.data.data);
				// newdakas = daka.concat(res.data.data);
				// console.log(newdakas);
				console.log(_that);
				if(res.data.data.data == null){
					_that.setData({
						test:'暂无打卡信息',
						daka:[]

					})
				}else{
					_that.setData({
						daka:res.data.data.data,
						test: '正在加载中...'
					})
				}
			},


		})
	},
	//授权信息
	bindGetUserInfo(e) {
		var that = this;
		console.log(e.detail.userInfo)
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=inseruser',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=inseruser',
			data: {uid:this.data.mid,nickName: e.detail.userInfo.nickName,gender:e.detail.userInfo.gender,avatarUrl:e.detail.userInfo.avatarUrl,token: app.globalData.token},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log('11');
				console.log(res.data.data);
				let uname = res.data.data.uname;
				let avator = res.data.data.avator;
				let sex = res.data.data.sex;
				let uedit = res.data.data.uedit;
				wx.showToast({
					title: res.data.info,
					icon: 'none'
				})
				if(res.data.status == 1){
					that.setData({
						uname: uname,
						avator: avator,
						sex: sex,
						uedit: uedit,
					})
				}

			},

		})
	},
	// 日历收起-展开
	changes:function(event){
		let _this = this ;
		console.log(event)
		_this.setData({
			activeNames:event.detail,
		})
		console.log( _this.data.activeNames )
		if ( event.detail.length == 1 ) {
			console.log('当前是展开状态')
			_this.setData({
				isSHOW:true
			})
		}else{
			console.log('当前是收起来状态')
			_this.setData({
				isSHOW:false
			})
		}
		// console.log( _this.data.activeNames )
	},

	//日历
	onShow: function() {
		console.log(this);
		var mid = this.data.mid;
		console.log(mid);
		var _that = this;
		var newdakas = [];
		initCalendar({
		  // multi: true, // 是否开启多选,
		  // disablePastDay: true, // 是否禁选过去日期
		  // defaultDay: '2018-8-8', // 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
		  /**
		   * 选择日期后执行的事件
		   * @param { object } currentSelect 当前点击的日期
		   * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
		   */
			afterTapDay: (currentSelect, allSelectedDays) => {
					console.log('===============================');
					console.log('当前点击的日期', currentSelect);
			  console.log(currentSelect.year)
			  console.log(currentSelect.month)
			  console.log(currentSelect.day)
			  wx.request({
				  url: app.globalData.config_host+ '/index.php?app=dakaprogram&mod=Calendar&act=calendar',
				  // url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Calendar&act=calendar',
				  data: {mid:mid,y:currentSelect.year,m:currentSelect.month,d:currentSelect.day,token: app.globalData.token},
				  method: 'POST',
				  header: {
					  "Content-Type": "application/x-www-form-urlencoded"
				  },
				  success: function (res) {
					  console.log(res.data.data.data);
					  // newdakas = daka.concat(res.data.data);
					  // console.log(newdakas);
					  console.log(_that);
					  _that.setData({
							dyear:currentSelect.year,
							dmonth:currentSelect.month,
							dday:currentSelect.day,
							nowDate: currentSelect.year +'.'+currentSelect.month+'.'+currentSelect.day //当前日期
					  })
					  if(res.data.data.data == null){
						  _that.setData({
							  test:'暂无打卡信息',
							  daka:[]

						  })
					  }else{
						  _that.setData({
							  daka:res.data.data.data,
							  test: '正在加载中...'
						  })
					  }
				  },


			  })
					console.log(
					'当前点击的日期是否有事件标记: ',
					currentSelect.hasTodo || false
					);
					allSelectedDays && console.log('选择的所有日期', allSelectedDays);

					console.log('getSelectedDay方法', getSelectedDay());
			},

			whenChangeMonth(current, next) {
				// console.log(current);
				// console.log(next);
			},
		  /**
		   * 日期点击事件（此事件会完全接管点击事件）
		   * @param { object } currentSelect 当前点击的日期
		   * @param { object } event 日期点击事件对象
		   */
		  // onTapDay(currentSelect, event) {
		  //   console.log(currentSelect);
		  //   console.log(event);
		  // },
		  /**
		   * 日历初次渲染完成后触发事件，如设置事件标记
		   */

		  afterCalendarRender(ctx) {

			  // let mid = wx.getStorageSync('mid');
			  // console.log(mid+'123');
			  // _this.setData({
				//   mid:mid
			  // })
			  var mid = wx.getStorageSync('mid');
			  console.log(mid);
			  wx.request({
				  url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Calendar&act=riqi',
				  // url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Calendar&act=riqi',
				  data: {mid:mid,token: app.globalData.token},
				  method: 'POST',
				  header: {
					  "Content-Type": "application/x-www-form-urlencoded"
				  },
				  success: function (res) {
					  console.log('11');
					  console.log(res.data.data);
					  let month = res.data.data;
					  console.log(month);

					  ctx.__data__.calendar.todoLabels = month;
					  console.log(ctx)
					  console.log(ctx.__data__.calendar)
					  console.log(ctx.__data__.calendar.todoLabels)
					  setTimeout(() => {
						  setTodoLabels({
							  pos: 'bottom',
							  dotColor: '#40',
							  days: ctx.__data__.calendar.todoLabels
						  });
						  disableDay(1);
					  }, 0);
				  },

			  })
				const data = [
				{
					year: '2018',
					month: '12',
					day: '2'
				},
				{
					year: '2019',
					month: '1',
					day: '3'
				},
				{
					year: '2019',
					month: '1',
					day: '4'
				},
				// {
				// 	year: 2019,
				// 	month: 1,
				// 	day: 10,
				// 	todoText: '待办'
				// }
				];
			  // console.log(data);
				// 异步请求
				// setTimeout(() => {
				// 	setTodoLabels({
				// 		pos: 'bottom',
				// 		dotColor: '#40',
				// 		days: data
				// 	});
				// 	disableDay(1);
				// }, 0);
				// enableArea(['2018-10-7', '2018-10-28']);
			}

		});
		console.log(newdakas);
		// this.__data__.daka = newdakas;
		console.log(this);
		jump(this.data.dyear, this.data.dmonth, this.data.dday);
	},
	switchView() {
		if (!this.weekMode) {
			switchView('week');
		} else {
			switchView();
		}
	},


	// choosePrevMonth:function(){
    // 	console.log('88888888888888')
	// },


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
			data: {id:id,uid:this.data.mid,token: app.globalData.token},
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
		console.log(this.data.dyear);
		console.log(this.data.dmonth);
		console.log(this.data.dday);
    },
	//分享
	onShareAppMessage: function (e) {
		console.log(e)
		console.log(999)
		var id = e.target.dataset.id;
		var img = e.target.dataset.img;
		var title = e.target.dataset.title;
		console.log(id)
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
    //关闭广告
    tapClose:function(event){
		console.log('关闭了广告')
		this.setData({
			ads: 'none'
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


	/**
	 * @desc 获取当前日期
	 */
	getToday() {
		const date = new Date();
    console.log(date);
		const zeroize = n => n < 10 ? `0${n}` : n;
		return `${date.getFullYear()}.${zeroize(date.getMonth() + 1)}.${zeroize(date.getDate())}`;
	},


})

