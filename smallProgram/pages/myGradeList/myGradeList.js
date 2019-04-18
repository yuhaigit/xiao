//获取应用实例
import Dialog from '../../dist/dialog/dialog';
const app = getApp()
Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		list: [],
		mid:'',
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
		let mid = wx.getStorageSync('mid');
		_this.setData({
			mid:mid
		})
		console.log(e);
		_this.pinfenglist(e.cid,e.select_id);//评分列表

		setTimeout(()=>{
			
			_this.scrolls();

		},2000)
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
	nolock(){
		let _this =this ;
		Dialog.alert({
			title: '练习尚未解锁',
      		message: '完成上一讲练字打卡，方能解锁',
			confirmButtonText:'好的，知道了',
			closeOnClickOverlay: true,
		}).then(() => {

		});
	},
	//跳转链接
	jumplink:function(e){
    	var xid = e.currentTarget.dataset.canshu;
    	var pinfen = e.currentTarget.dataset.pinfen;
    	var lock = e.currentTarget.dataset.lock;
    	console.log(xid);
    	console.log(pinfen);
    	console.log(lock);
		console.log(this.data.mid)
    	if(lock==1){
			Dialog.alert({
				title: '练习尚未解锁',
				message: '完成上一讲练字打卡，方能解锁',
				confirmButtonText:'好的，知道了',
				closeOnClickOverlay: true,
			}).then(() => {

			});
		}else if(pinfen == 0){
			// wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
			// 	url: "/pages/myGrade/myGrade?id=" + xid//评分页
			// })
			wx.redirectTo({
				url: "/pages/myGrade/myGrade?id=" + xid//评分页
			})
		}else{
			// wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
			// 	url: "/pages/myGradeResult/myGradeResult?lid=" + xid+"&uid="+this.data.mid//评分结果页
			// })
			wx.redirectTo({
				url: "/pages/myGradeResult/myGradeResult?lid=" + xid+"&uid="+this.data.mid//评分结果页
			})
		}
	},

	//列表
	pinfenglist: function (cid,select_id) {
		var that = this;
		console.log(cid);
		var mid = wx.getStorageSync('mid');
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Pingfen&act=pinfenlist',
		data: {mid:mid ,cid:cid,select_id:select_id,token: app.globalData.token},
		success: function (res) {
			var practiseslistgo = res.data.data;
			console.log(practiseslistgo);
			that.setData({
			list: practiseslistgo
			})
		}

		})

	},

})