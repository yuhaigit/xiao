//获取应用实例
const app = getApp()
import Dialog from '../../dist/dialog/dialog';

Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色
		item:'',
		uploadedImages: [],
		imgBoolean: true,
    	pfresult:[],
		list: [],

	},
    onLoad(e){
		var __this = this;
		console.log(e.uid);
		console.log(e.lid);
		wx.request({
		url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Pingfen&act=pfresult',
		// url: 'https://www.liupinshuyuan.com/index.php?app=dakaprogram&mod=Pingfen&act=pfresult',
		// 		data: { uid: e.uid, lid: e.lid,pf_resid:e.pf_resid},
				data: { uid: e.uid, lid: e.lid},
		method: 'POST',
		header: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		success: function (res) {

			console.log(res);
			console.log(res.data);
			
			let pfres = res.data.data;
			console.log(pfres);
			__this.setData({
				pfresult: pfres
			})
		},

		})
	},
	chooseImage: function () {
		var that = this;
		// 选择图片
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
				var tempFilePaths = res.tempFilePaths
				that.setData({
					item: tempFilePaths[0],
					imgBoolean: false
				});

				//不合格提示
				// that.onClickAlert2();

			}
		})


		
	},
	//删除图片
	deleteImg: function (e) { 
		Dialog.confirm({
			title: '',
			message: '确定要删除这张练习照片？'
		}).then(() => {

			var that = this;
			var images = that.data.uploadedImages;
			console.log(  images  )
			that.setData({
				uploadedImages: images,
				imgBoolean: true
			});
		}).catch(() => {

		});
	},

	//引导图
	tipss(){
		// var current = 'https://test.liupinshuyuan.com/data/upload/2018/0828/13/5b84deee91857.png';
		var current = this.data.pfresult.js_pinfen;
		wx.previewImage({
			current: current,
			urls: [current]
		})
	},
	//再评分

	gotoGrade(){
		wx.navigateTo({
			url:'/pages/myGrade/myGrade?id='+this.data.pfresult.pf_lid,
			// success:function(){
			//
			// },
			// fail:function(){
			//
			// }
		})
	},



	//提交
	submit: function (e) {
		
		console.log(  this.data.item  )

	},


	//上传后不合格提示
	dialogUp(event) {
		if (event.detail === 'confirm') {
		  	// 异步关闭弹窗
			setTimeout(() => {
				this.setData({
					show: false
				});
			}, 1000);
			console.log('点击了重新上传')
		} else {
			this.setData({
				show: false
			});
		}
	}

})