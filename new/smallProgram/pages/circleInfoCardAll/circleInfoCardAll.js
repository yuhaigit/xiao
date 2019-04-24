//获取应用实例
import Dialog from '../../dist/dialog/dialog';
const app = getApp()
Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		list: [],

		scrollTop:'0',
		offsetTop:'',
		tbodyHeight:'',

	},
	onReady:function(){
		let _this = this ;
		let NavHeight = app.globalData.statusBarHeight + app.globalData.titleBarHeight ;
		wx.getSystemInfo({
		  	success: function(res) {
			    console.log(res)
				_this.setData({
					offsetTop: NavHeight,
					tbodyHeight : res.windowHeight
				})
		  	}
		})
	},
    onLoad(e){
		let _this = this ;
		_this.practiseslist(e.id);
		_this.mypractisesNext(e.id);

		setTimeout(()=>{
			
			_this.scrolls();

		},1500)
		// _this.nolock()
		console.log('执行完毕了')
	},

	//滚动至指定位置
	scrolls: function (e) {
		let _this = this ;
		let query = wx.createSelectorQuery() 
		query.select('#litsActives').boundingClientRect();
		query.exec(function (res) {
			console.log(res)
			console.log(res[0].top); // 节点的上边界坐
			_this.setData({
				scrollTop: res[0].top - _this.data.offsetTop - 20 ,
			})
		});



		console.log('--页面滚动到指定位置--')

	},
	//未解锁提示
  nolock1(event){
		let _this =this ;
    _this.nolock0(event);
		// Dialog.alert({
		// 	title: '练习尚未解锁',
    //   		message: '完成上一讲练字打卡，方能解锁',
		// 	confirmButtonText:'好的，知道了',
		// 	closeOnClickOverlay: true,
		// }).then(() => {
    //   _this.nolock0(event)
		// });
	},
  // //未解锁提示
  // nolock0() {
  //   console.log(666);
  // },

  //未解锁提示
  nolock0(event) {

		let pages = getCurrentPages(); 
		console.log(pages)
		let prevPage = pages[ pages.length - 2 ];  
		prevPage.setData({
			xid : event.currentTarget.dataset.xid ,
			cid : event.currentTarget.dataset.cid ,
			vflag: true,
			videoEndText: false ,
		})
		wx.navigateBack({
			delta: 1 , // 返回上一级页面。
		})

    // var xid = event.currentTarget.dataset.xid;//获取data-src
    // var cid = event.currentTarget.dataset.cid;//获取data-src
    // wx.navigateTo({
    //   url: '/pages/circleInfoCard/circleInfoCard?id='+cid+"&xid="+xid,
		// })
  },

	//@lee 打卡提交
	mypractisesNext: function (id) {
		var that = this;
		console.log(id);
		var mid = wx.getStorageSync('mid');
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Practises&act=nextPractiseByuser',
		data: { cid: id,mid:mid ,token: app.globalData.token},
		success: function (res) {
			var practisesNext = res.data.data;
			that.setData({
			practisesNext: practisesNext
			})
		}

		}) //wx.request

	},
	//@lee 打卡列表
	practiseslist: function (id) {
		var that = this;
		console.log(id);
		var mid = wx.getStorageSync('mid');
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Practises&act=listbycid&cid='+id,
		data: {mid:mid ,token: app.globalData.token},
		success: function (res) {
			var practiseslistgo = res.data.data;
			console.log(practiseslistgo);
			that.setData({
			practiseslistgo: practiseslistgo
			})
		}

		}) //wx.request

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


})