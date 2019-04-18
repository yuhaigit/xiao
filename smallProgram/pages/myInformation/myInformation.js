//获取应用实例
const app = getApp()
Page({
    data: {
		showIcon: true,				//顶部导航是否显示左侧按钮
		bgColor:"#fff",			//顶部导航背景颜色
		uid:'',//接收的uid参数
		uname:'', //用户名
		sex:'', //性别
		avator:'', //头像
		phone:'', //手机号
		canshu:'', //手机号参数0：未绑定，1：已绑定

		// onSHow:'男',	//默认公开
		// onSHowText:'所有人可见',
		actions: [	//弹出菜单
			{
				name: '男',
        		isshow: 1
			},
			{
				name: '女',
        		isshow: 2
			},
		],

	},
	onLoad:function(e){
		let _this = this;
		_this.setData({
			uid:e.uid
		})
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=edit',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Mine&act=edit',
			data: {uid:this.data.uid,token: app.globalData.token},
			// data: {uid:90216},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				console.log('11');
				console.log(res.data.data);
				let uname = res.data.data.uname;
				let sex = res.data.data.sex;
				let avator = res.data.data.avator;
				let phone = res.data.data.phone;
				let canshu = res.data.data.canshu;
				_this.setData({
					uname: uname,
					sex: sex,
					avator: avator,
					phone: phone,
					canshu: canshu,
				})

			},

		})

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
		//选择完 请求保存...
		console.log(event);
		var that = this;
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=editsex',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Mine&act=editsex',
			data: {uid:this.data.uid,sex:event.detail.isshow,token: app.globalData.token},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				wx.showToast({
					title: res.data.info,
					icon: 'none'
				})
				if(res.data.status == 1){
					that.setData({
						sex:event.detail.name,
						isshow: event.detail.isshow,
						show: false
					});
				}

			},

		})

	},


})

