// ===============================================================
let SCREEN_WIDTH = 750
let PAGE_X, // 手按下的x位置
  PAGE_Y, // 手按下y的位置
  PR = wx.getSystemInfoSync().pixelRatio, // dpi
  T_PAGE_X, // 手移动的时候x的位置
  T_PAGE_Y, // 手移动的时候Y的位置
  CUT_L,  // 初始化拖拽元素的left值
  CUT_T,  // 初始化拖拽元素的top值
  CUT_R,  // 初始化拖拽元素的
  CUT_B,  // 初始化拖拽元素的
  CUT_W,  // 初始化拖拽元素的宽度
  CUT_H,  //  初始化拖拽元素的高度
  IMG_RATIO,  // 图片比例
  IMG_REAL_W,  // 图片实际的宽度
  IMG_REAL_H,   // 图片实际的高度
  DRAFG_MOVE_RATIO = 750 / wx.getSystemInfoSync().windowWidth,  //移动时候的比例,
  INIT_DRAG_POSITION = 200,   // 初始化屏幕宽度和裁剪区域的宽度之差，用于设置初始化裁剪的宽度
  DRAW_IMAGE_W // 设置生成的图片宽度
// ===============================================================

//获取应用实例
const app = getApp()
//弹窗
import Dialog from '../../dist/dialog/dialog';

Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		item:'',
		uploadedImages: [],
		imgBoolean: true,
    	// practises_img:'',
    	scoreinfo:[],
      	lxid:0,

		show: false,	//结果提示 默认隐藏

		// list: [],

		// tbodyHeight:0 ,	//高度

		// =================================================================
		// 之后可以动态替换
		// imageSrc: 'http://www.bing.com/az/hprichbg/rb/BulgariaPerseids_ZH-CN11638911564_1920x1080.jpg',
		imageSrc: '',
		// NewImage:'' ,	//截图后生成的新图

		UpImg: false,	//初始 截图弹窗不显示

		// 是否显示图片(在图片加载完成之后设置为true)
		isShowImg: false,
		useruploadimg:'',
		imgrquestinfo:'',

		// 初始化的宽高
		cropperInitW: SCREEN_WIDTH,
		cropperInitH: SCREEN_WIDTH,

		// 动态的宽高
		cropperW: SCREEN_WIDTH,
		cropperH: SCREEN_WIDTH,

		// 动态的left top值
		cropperL: 0,
		cropperT: 0,

		// 图片缩放值
		scaleP: 0,

		// 裁剪框 宽高
		cutL: 0,
		cutT: 0,
		cutB: SCREEN_WIDTH,
		cutR: '100%',
		qualityWidth: DRAW_IMAGE_W,
		innerAspectRadio: DRAFG_MOVE_RATIO ,
		// =============================================================


		disabled: true ,	//默认不可以提交

		temimgurl:'',
		uid:0,
		pfres:[],

		TipsShow: false ,

	},

	// ====
    onLoad(e){
    var __thiss=this;
      __thiss.lxid = e.id;
	var mid = wx.getStorageSync('mid');
      wx.request({
        url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Pingfen&act=practiseinfo',
        // url: 'https://www.liupinshuyuan.com/index.php?app=dakaprogram&mod=Pingfen&act=practiseinfo',
        data: {lid: e.id,mid:mid},
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data.data);
          __thiss.setData({
			  scoreinfo:res.data.data
          })
			if(res.data.data.pfor == 0){
				__thiss.tipss();
			}
        },

      })
	},


// ==========================================
	/**
	 * 选择本地图片
	 */
	getImage: function () {
		var _this = this;
		wx.chooseImage({
			// count: 1, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			success: function (res) {
				_this.setData({
					imageSrc: res.tempFilePaths[0],
					UpImg: true,	//截图弹窗显示
					imgBoolean : false	//添加按钮隐藏
				})
				_this.loadImage();
			},
		})
	},




	/**
	 * 初始化图片信息
	 * 获取图片内容，并初始化裁剪框
	 */
	loadImage: function () {
		var _this = this
		wx.showLoading({
			title: '图片加载中...',
			mask:true,
		})

		wx.getImageInfo({
			src: _this.data.imageSrc,
			success: function success(res) {
				DRAW_IMAGE_W = IMG_REAL_W = res.width
				IMG_REAL_H = res.height
				IMG_RATIO = IMG_REAL_W / IMG_REAL_H
				let minRange = IMG_REAL_W > IMG_REAL_H ? IMG_REAL_W : IMG_REAL_H
				INIT_DRAG_POSITION = minRange > INIT_DRAG_POSITION ? INIT_DRAG_POSITION : minRange
				// 根据图片的宽高显示不同的效果   保证图片可以正常显示
				if (IMG_RATIO >= 1) {
					_this.setData({
						cropperW: SCREEN_WIDTH,
						cropperH: SCREEN_WIDTH / IMG_RATIO,
						// 初始化left right
						cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
						cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2),
						cutL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2),
						cutT: Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2),
						cutR: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2),
						cutB: Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2),
						// 图片缩放值
						scaleP: IMG_REAL_W / SCREEN_WIDTH,
						qualityWidth: DRAW_IMAGE_W,
						innerAspectRadio: IMG_RATIO
					})
				} else {
					_this.setData({
						cropperW: SCREEN_WIDTH * IMG_RATIO,
						cropperH: SCREEN_WIDTH,
						// 初始化left right
						cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2),
						cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),

						cutL: Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2),
						cutT: Math.ceil((SCREEN_WIDTH - INIT_DRAG_POSITION) / 2),
						cutB: Math.ceil((SCREEN_WIDTH - INIT_DRAG_POSITION) / 2),
						cutR: Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2),
						// 图片缩放值
						scaleP: IMG_REAL_W / SCREEN_WIDTH,
						qualityWidth: DRAW_IMAGE_W,
						innerAspectRadio: IMG_RATIO
					})
				}
				_this.setData({
					isShowImg: true,
				})
				wx.hideLoading()
			}
		})
	},

	/**
	 * 拖动时候触发的touchStart事件
	 */
	contentStartMove(e) {
		PAGE_X = e.touches[0].pageX
		PAGE_Y = e.touches[0].pageY
	},

	/**
	 * 拖动时候触发的touchMove事件
	 */
	contentMoveing(e) {
		var _this = this
		var dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
		var dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO

		/**
		 * 这里有一个小的问题
		 * 移动裁剪框 ios下 x方向没有移动的差距
		 * y方向手指移动的距离远大于实际裁剪框移动的距离
		 * 但是在有些机型上又是没有问题的，小米4测试没有上下移动产生的偏差，模拟器ok，但是iphone8p确实是有的，虽然模拟器也ok
		 * 小伙伴有兴趣可以找找原因
		 */

		// 左移右移
		if (dragLengthX > 0) {
		if (this.data.cutL - dragLengthX < 0) dragLengthX = this.data.cutL
		} else {
		if (this.data.cutR + dragLengthX < 0) dragLengthX = -this.data.cutR
		}


		// 上移下移
		if (dragLengthY > 0) {
		if (this.data.cutT - dragLengthY < 0) dragLengthY = this.data.cutT
		} else {
		if (this.data.cutB + dragLengthY < 0) dragLengthY = -this.data.cutB
		}
		this.setData({
		cutL: this.data.cutL - dragLengthX,
		cutT: this.data.cutT - dragLengthY,
		cutR: this.data.cutR + dragLengthX,
		cutB: this.data.cutB + dragLengthY
		})

		// console.log('cutL', this.data.cutL)
		// console.log('cutT', this.data.cutT)
		// console.log('cutR', this.data.cutR)
		// console.log('cutB', this.data.cutB)

		PAGE_X = e.touches[0].pageX
		PAGE_Y = e.touches[0].pageY
	},

	contentTouchEnd() {

	},

	/**
	 * 获取图片
	 */
	getImageInfo() {
		var _this = this
		wx.showLoading({
			title: '图片处理中...',
			mask:true,
		})
		// 将图片写入画布
		const ctx = wx.createCanvasContext('myCanvas')
		console.log(  _this.data.imageSrc )
		ctx.drawImage(_this.data.imageSrc, 0, 0, IMG_REAL_W, IMG_REAL_H);
		ctx.draw(true, () => {
			// 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题
			var canvasW = ((_this.data.cropperW - _this.data.cutL - _this.data.cutR) / _this.data.cropperW) * IMG_REAL_W
			var canvasH = ((_this.data.cropperH - _this.data.cutT - _this.data.cutB) / _this.data.cropperH) * IMG_REAL_H
			var canvasL = (_this.data.cutL / _this.data.cropperW) * IMG_REAL_W
			var canvasT = (_this.data.cutT / _this.data.cropperH) * IMG_REAL_H
			// 生成图片
			wx.canvasToTempFilePath({
				x: canvasL,
				y: canvasT,
				width: canvasW,
				height: canvasH,
				destWidth: canvasW,
				destHeight: canvasH,
				quality: 0.3,
				canvasId: 'myCanvas',
				success: function (res) {
					// 成功获得地址的地方
					console.log(_this)
          console.log(666)
					console.log(res.tempFilePath)
          //获取第一张图片地址 
          var filep = res.tempFilePath;
          //向服务器端上传图片 
          // getApp().data.servsers,这是在app.js文件里定义的后端服 务器地址 
          wx.uploadFile({
            url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Fileimage&act=filePost',
            // url: 'https://www.liupinshuyuan.com/index.php?app=dakaprogram&mod=Fileimage&act=filePost',
            filePath: filep,
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: function (res) {
              console.log(res.data);
              var returnurl = JSON.parse(res.data);
              console.log(returnurl);
              _this.data.temimgurl= returnurl['return_url'];
              _this.useruploadimg = returnurl['return_url'];
              wx.hideLoading()
              //输出图片地址
              // this.temimgurl = newdatassa;
              // console.log("ddddddddddd");
              // newdatass.push(newdatassa)
              // t.setData({
              //   newdatass: newdatass
              // })

              //do something  
            }, fail: function (err) {
              console.log(err)
            }
          });
					_this.setData({
						imageSrc: res.tempFilePath,
						UpImg: false,
					});

					// wx.previewImage({
					// 	current: '', // 当前显示图片的http链接
					// 	urls: [res.tempFilePath] // 需要预览的图片http链接列表
					// })
				}
			})
		})
	},

	/**
	 * 设置大小的时候触发的touchStart事件
	 * 存数据
	 */
	dragStart(e) {
		T_PAGE_X = e.touches[0].pageX
		T_PAGE_Y = e.touches[0].pageY
		CUT_L = this.data.cutL
		CUT_R = this.data.cutR
		CUT_B = this.data.cutB
		CUT_T = this.data.cutT
	},

	/**
	 * 设置大小的时候触发的touchMove事件
	 * 根据dragType判断类型
	 * 4个方向的边线拖拽效果
	 * 右下角按钮的拖拽效果
	 */
	dragMove(e) {
		var _this = this
		var dragType = e.target.dataset.drag
		switch (dragType) {
		case 'right':
			var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
			if (CUT_R + dragLength < 0) dragLength = -CUT_R
			this.setData({
			cutR: CUT_R + dragLength
			})
			break;
		case 'left':
			var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
			if (CUT_L - dragLength < 0) dragLength = CUT_L
			if ((CUT_L - dragLength) > (this.data.cropperW - this.data.cutR)) dragLength = CUT_L - (this.data.cropperW - this.data.cutR)
			this.setData({
			cutL: CUT_L - dragLength
			})
			break;
		case 'top':
			var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
			if (CUT_T - dragLength < 0) dragLength = CUT_T
			if ((CUT_T - dragLength) > (this.data.cropperH - this.data.cutB)) dragLength = CUT_T - (this.data.cropperH - this.data.cutB)
			this.setData({
			cutT: CUT_T - dragLength
			})
			break;
		case 'bottom':
			var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
			if (CUT_B + dragLength < 0) dragLength = -CUT_B
			this.setData({
			cutB: CUT_B + dragLength
			})
			break;
		case 'rightBottom':
			var dragLengthX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
			var dragLengthY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
			if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
			if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
			this.setData({
			cutB: CUT_B + dragLengthY,
			cutR: CUT_R + dragLengthX
			})
			break;
		default:
			break;
		}
	},

// ================================================

	// 引导提示
	tipss(){
		// var current = 'https://test.liupinshuyuan.com/data/upload/2018/0828/13/5b84deee91857.png';
		var current = this.data.scoreinfo.js_pinfen;
		wx.previewImage({
			current: current,
			urls: [current]
		})
	},
	onClose() {
		this.setData({ TipsShow: false });
	},
	// 图片预览
	previewImage: function (e) {
		var current = e.target.dataset.src
		wx.previewImage({
			current: current,
			urls: [current]
		})
	},
	//删除图片
	deleteImg: function (e) { 
		Dialog.confirm({
			title: '',
			message: '确定要删除这张练习照片？'
		}).then(() => {

			var that = this;

			that.setData({
				imageSrc: '',
				imgBoolean: true
			});
		}).catch(() => {

			console.log('点击了取消')
		});
	},
	// 取消
	CancelImg: function (e) {
		console.log(IMG_REAL_W, IMG_REAL_H)
		const ctx = wx.createCanvasContext('myCanvas')
		ctx.clearRect(0, 0, IMG_REAL_W, IMG_REAL_H);
		ctx.draw()

		this.setData({
		UpImg: false,
		imageSrc: '',
		imgBoolean: true
		});
	},



	//提交 图片评分
	submits: function (e) {
    var __this =this;
    __this.data.uid = wx.getStorageSync('mid');
    console.log(__this.useruploadimg);
    //显示 加载中
    wx.showLoading({
	  title: '正在提交中',
	  mask:true,
    });
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Pingfen&act=pf',
      data: { uid: __this.data.uid, imgurl: __this.useruploadimg, lid: __this.lxid},
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //隐藏 加载中
        wx.hideLoading();
        console.log(res.data);
        console.log("=========================");
        console.log(__this.lxid);
        if(res.data.status==1){
			wx.redirectTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
				url: "/pages/myGradeResult/myGradeResult?uid=" + __this.data.uid + "&lid=" + __this.lxid + "&pf_resid=" + res.data.data
			})
        }else{
			__this.setData({
				imgrquestinfo: res.data.info,
				show:true
			})
        }
        // })

      },

    })

	},

  //上传后不合格提示
  dialogUp(event) {
    if (event.detail === 'confirm') {
      // 异步关闭弹窗
      setTimeout(() => {
        this.setData({
          show: false,
          imageSrc: '',
          imgBoolean: true
        });
      }, 1000);
      console.log('点击了重新上传')
    } else {
      this.setData({
        show: false
      });
    }
  },


})