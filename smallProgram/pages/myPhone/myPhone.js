//获取应用实例
const app = getApp()

Page({
    data: {
		showIcon: true,				//顶部导航是否显示左侧按钮
		bgColor:"#fff",			//顶部导航背景颜色

		uid:'',//登陆uid
		tel: '',
		sms:'',
		yzm:'获取验证码',
		canshu:'',
		code:'', //发送的验证码
		yuantel:'',
		
		send: true,
		alreadySend: false,
		second: 60 ,	//倒计时60s
		// disabled: true,
		// buttonType: 'default',
		phoneNum: '',
		disableds:false,	//默认可点
		yanse:false
	},
	onLoad:function(e){
		let _this = this;
		console.log(e.canshu);
		console.log(e.phone);
		console.log(e.uid);
		_this.setData({
			uid:e.uid,
			canshu:e.canshu
		})
		if(e.canshu == 1){
			_this.setData({
				tel:e.phone,
				yuantel:e.phone
			})
		}
		// wx.request({
		// 	url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=myphone',
		// 	// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Mine&act=myphone',
		// 	data: {canshu:e.canshu,phone:e.phone,token: app.globalData.token},
		// 	method: 'POST',
		// 	header: {
		// 		"Content-Type": "application/x-www-form-urlencoded"
		// 	},
		// 	success: function (res) {
		// 		console.log('11');
		// 		console.log(res.data.data);
		// 		let canshu = res.data.data.canshu;
		// 		_this.setData({
		// 			canshu:canshu
		// 		})
		// 		if(canshu == 1){
		// 			let phone = res.data.data.phone;
		// 			_this.setData({
		// 				tel:phone
		// 			})
		// 		}
		//
		// 	},
		//
		// })

	},
	//改变时
	onTelBlur(event){
		console.log(event.detail)
		let _this = this;
		_this.setData({
			tel:event.detail,
			disableds:false
		})
	},
	onsms(event) {
		// event.detail 为当前输入的值
		let _this = this;
		console.log(event.detail);
		_this.setData({
			sms:event.detail
		})
	},
	// 保存信息
    saveTel(event){
		console.log(this.data.uid)
		console.log(event.detail);
		var telphone = this.data.tel;
		// var phonetel = this.data.tel.value;
		// var tel = phonetel?phonetel:telphone;
		// console.log(tel)
		var sms = this.data.sms;
		var code = this.data.code;
		if(telphone == ''){
			wx.showToast({
			    title: '请先填写手机号',
				icon: 'none'
			})
		}else if(sms == ''){
			wx.showToast({
				title: '请先填写手机验证码',
				icon: 'none'
			})
		}else if(code == ''){
			wx.showToast({
				title: '请重新获取手机验证码',
				icon: 'none'
			})
		}else if(code != sms){
			wx.showToast({
				title: '验证码错误',
				icon: 'none'
			})
		}else{
			var cuid = this.data.uid;
			console.log(cuid);
			wx.request({
				url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=checkCode',
				// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Mine&act=checkCode',
				data: {mid:this.data.uid,phone:telphone,canshu:this.data.canshu,token: app.globalData.token},
				method: 'POST',
				header: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: function (res) {
					console.log(res.data.data);
					if(res.data.status == 1 ){
						wx.showToast({
							title: res.data.info,
							icon: 'success',
							duration: 2000,
							success:function(){
								setTimeout(function () {
									//要延时执行的代码
									// wx.navigateBack({     //返回上一页面或多级页面
									// 	delta:1
									// })
									wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
										url: "/pages/myInformation/myInformation?uid=" + cuid
									})
								}, 2000) //延迟时间
							}
						})
					}else{
						wx.showToast({
							title: res.data.info,
							icon: 'none',
						})
					}

				},

			})
		}

	},
	//发送验证码
	obtain:function(){
		// if (this.data.tel=='') {
		// 	wx.showToast({
		// 		title: '请先填写手机号',
		// 		icon: 'none'
		// 	})	
		// 	return false;
		// }
		var __this =this ;
		console.log(this.data.tel);
		// console.log(this.data.tel.value);
		var telphone = this.data.tel;
		// var phonetel = this.data.tel.value;
		// var phonemobile = phonetel?phonetel:telphone;
		// console.log(phonemobile)
		// console.log(this.validateYzm(phonemobile))
		// this.validateYzm(phonemobile)
		if (telphone=='') {
			wx.showToast({
				title: '请先填写手机号',
				icon: 'none'
			})	
			return false;
		}
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=sendCode',
			// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Mine&act=sendCode',
			data: {mid:this.data.uid,phone:telphone,token: app.globalData.token},
			method: 'POST',
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function (res) {
				wx.showToast({
				    title: res.data.info,
					icon: 'none'
				})
				if(res.data.status == 0 || res.data.status == -1 || res.data.status == -2 || res.data.status == -3 || res.data.status == -5){
					__this.setData({
						alreadySend: false,
						send: true
					})
				}else{
					__this.setData({
						alreadySend: true,
						send: false
					})
					__this.timer()
				}
				if(res.data.status == 1){
					console.log(__this)
					__this.setData({
						code:res.data.data
					})
				}
			},

		})

		// this.setData({
		// 	alreadySend: true,
		// 	send: false
		// })
		// this.timer()
	  
	},
	//快捷授权手机号
	getPhoneNumber(e) {
    	var that =this;
		var cuid = this.data.uid;
		var canshu = this.data.canshu;
		console.log(cuid);
		wx.login({
			success: function (res) {
				var code = res.code;
				wx.request({
					url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Logins&act=user',
					data: {
						code: code
					},
					success: function (ras) {
						// var mid = ras.data.mid;
						console.log(ras.data.session_key);
						// wx.setStorageSync('mid', mid);
						wx.request({
							url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Userinfos&act=phone',
							data: {
								iv: e.detail.iv,
								encryptedData: e.detail.encryptedData,
								sessionKey: ras.data.session_key
							},
							success: function (ret) {

								var data1=JSON.parse(ret.data)
								console.log(data1.phoneNumber)
								that.setData({
									tel:data1.phoneNumber
								})
								wx.request({
									url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=checkCode',
									// url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Mine&act=checkCode',
									data: {mid:cuid,phone:data1.phoneNumber,canshu:canshu,token: app.globalData.token},
									method: 'POST',
									header: {
										"Content-Type": "application/x-www-form-urlencoded"
									},
									success: function (ryy) {
										console.log(ryy.data.data);
										if(ryy.data.status == 1 ){
											wx.showToast({
												title: ryy.data.info,
												icon: 'success',
												duration: 2000,
												success:function(){
													setTimeout(function () {
														//要延时执行的代码
														// wx.navigateBack({     //返回上一页面或多级页面
														// 	delta:1
														// })
														wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
															url: "/pages/myInformation/myInformation?uid=" + cuid
														})
													}, 2000) //延迟时间
												}
											})
										}else{
											wx.showToast({
												title: ryy.data.info,
												icon: 'none',
											})
										}

									},

								})
							}

						}) //wx.request


					}

				}) //wx.request
			} //wx.getUserInfo
			// login--->success
		}) //login




		console.log(e.detail.errMsg)
		console.log(e.detail.iv)
		console.log(e.detail.encryptedData)
	},
	timer: function () {
		let promise = new Promise((resolve, reject) => {
			let setTimer = setInterval(() => {
					this.setData({
						second: this.data.second - 1
					})
					if (this.data.second <= 0) {
						this.setData({
							second: 60,
							alreadySend: false,
							send: true
						})
						resolve(setTimer)
					}
				}, 1000)
			})
			promise.then((setTimer) => {
				clearInterval(setTimer)
			})
	},
	//校验手机号
	validateTel(phoneMobile){
		console.log(phoneMobile)
		var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
		if(phoneMobile.length===0){
			wx.showToast({
				title: '请先填写手机号',
				icon: 'none',
				duration: 1500
			});
			return false;
		}
		if (phoneMobile.length < 11) {
			wx.showToast({
				title: '手机号长度有误！',
				icon: 'none',
				duration: 1500
			});
			return false;
		}
		if (!myreg.test(phoneMobile)) {
			wx.showToast({
				title: '手机号有误！',
				icon: 'none',
				duration: 1500
			});
			return false;
		}
	},
	//校验验证码
	validateYzm(yzm){
		console.log(yzm)
		var regNum = /^[0-9]*$/;
		if (yzm.length < 6) {
			wx.showToast({
				title: '验证码长度有误！',
				icon: 'none',
				duration: 1500
			});
			return false;
		}
		if (!regNum.test(yzm)) {
			console.log(!regNum.test(yzm))
			wx.showToast({
				title: '验证码格式有误！',
				icon: 'none',
				duration: 1500
			});
			return false;
		}
	}
})
