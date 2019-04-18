const app = getApp()


// import Dialog from '../../dist/dialog/dialog';

Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		item:'',
		uploadedImages: [],
		imgBoolean: true,
      	pfdecalinfo:[],
		// show: false,

		// picture:'' ,//动画图

		animationData:"",	//动画
		animationData2:"",	//动画2

		topEnd:'',
		leftEnd:'',
		rightEnd:'',

	},

    onLoad(e){
      	var _this = this;
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Pingfen&act=pfdecatal',
			// url: 'https://www.liupinshuyuan.com/index.php?app=dakaprogram&mod=Pingfen&act=pfdecatal',
			data: { lid: e.lid, uid:e.uid,resid:e.resid},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				let pfdecal = res.data.data;
				console.log(pfdecal);
				_this.setData({
					pfdecalinfo: pfdecal
				})
			},

		})
		  
		wx.createSelectorQuery().select('#Ends').boundingClientRect(function(rect){
			console.log( rect )
			_this.setData({
				topEnd: rect.top ,
				leftEnd: rect.left,
				rightEnd: rect.right,
			})
	  	}).exec()

		setTimeout(function () {
			_this.animationAll();
		}, 1000) //延迟时间 这里是1秒
		
	},

	onShow() {
		console.log('我进来了')
		// this.setData({
		// 	picture: 'picture'
		// })

	},


	animationAll(){
		//创建动画
		let animation = wx.createAnimation({
			duration: 4000,
			timingFunction: "ease",
			delay: 0,
			transformOrigin: "50% 50%",
		})
		let animation2 = wx.createAnimation({
			duration: 4000,
			timingFunction: "ease",
			delay: 0,
			transformOrigin: "50% 50%",
		})
		
		//设置动画
		// console.log( '左侧顶部'+ this.data.topEnd )
		// console.log( '左侧左侧'+ this.data.leftEnd  )

		animation.translate( this.data.leftEnd -22 , this.data.topEnd + 16 ).scale(1.5).step(); //偏移x,y,z  左侧
		animation2.translate( -this.data.leftEnd + 24 , this.data.topEnd + 16 ).scale(1.5).step(); //右侧
	
		//导出动画数据传递给组件的animation属性。
		this.setData({
			animationData: animation.export(),
			animationData2: animation2.export(),
		})

	},


	// 返回
	goback(){
		wx.navigateBack({
			delta: 1
		})
	},



  /**
   * 用户点击右上角分享
   */
	onShareAppMessage: function () {

	}



})
