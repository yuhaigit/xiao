
const app = getApp()
import CTB from '../../utils/canvas-text-break.js';
import wxp from '../../utils/wxp.js';
import Dialog from '../../dist/dialog/dialog';

var ctx = null;

Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

		NEW_WIDTH: 750  ,
		NEW_HEIGHT: 1148  ,
		WIDTH: 750,
		HEIGHT: 1148,
		NavHeight: 0 ,
		windowWidth: 0,
		windowHeight: 0 ,
		loaded:false,
productDetail: {
	TxImg:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2369419058,1797305489&fm=27&gp=0.jpg', //头像，必须是正方形头像
	TxImg2: 'https://www.liupinshuyuan.com/data/upload/dakaprogram/2019/0212/15/5c627c3db587d.jpg',     //头像
	TxImg3: 'https://www.liupinshuyuan.com/data/upload/dakaprogram/bg.jpg',
	bjImg:'https://www.liupinshuyuan.com/data/upload/dakaprogram/bg.jpg',   //背景图
	imageUrl:'https://www.liupinshuyuan.com/data/upload/dakaprogram/bg.jpg',  //内容图
	artistName:'佳基洛夫斯卡',
	courseName:'硬笔书法楷书-基本笔基本基本…' ,//推荐课程名
},
		nickName:'列申斯卡',
		daysNum:99 ,   //打卡天数

		localImageUrl:'',	//
		sharesubmitinfo:'',
		
		IMGT: 0 , 
		// IMGT2: 0 ,
		IMGB: 35 ,

	},
	onShareAppMessage: function (e) {
    var id = this.data.idK;
		var that = this;
    var id = e.target.dataset.id;
    var img = e.target.dataset.img;
    var title = e.target.dataset.title;
		return {
			title: title,
      path: '/pages/circleSignInfo/circleSignInfo?id=' + id,
      imageUrl: img,
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	},
    onReady:function(){
		let _this = this ;
		let NavHeight = app.globalData.statusBarHeight + app.globalData.titleBarHeight ;
		console.log( NavHeight )
		wx.getSystemInfo({
			success(res) {
				_this.setData({
					NavHeight :  NavHeight ,
					windowWidth: res.windowWidth ,
					windowHeight : res.windowHeight ,
				});
			}
		});
	// console.log('初始设置：'+ _this.data.NavHeight ,_this.data.windowWidth,_this.data.windowHeight  )
			
		if ( _this.data.windowHeight > 810 ) {
			console.log('Iphone x系列')
			_this.setData({
				IMGT: 100 ,
				IMGB: 110 ,
			})
		}

	},
  	onLoad(e) {
    	this.sharesubmit(e.id);
  	},
	//@lee 打卡提交
	sharesubmit: function (id) {
   
		var that = this;
		that.setData({
			idK:id,
		})
		wx.request({
			url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Ranks&act=submitByid&id='+id,
			data: {token: app.globalData.token},
			success: function (res) {
				console.log(res)
				var sharesubmitinfo = res.data.data;
				that.setData({
					['productDetail.imageUrl']: sharesubmitinfo.imageindex,
					['productDetail.artistName']: sharesubmitinfo.uname,
					['productDetail.TxImg']: sharesubmitinfo.img_avatar,
					// ['productDetail.TxImg3']:app.globalData.config_host+"/data/upload/dakaprogram/logo.png",
					['daysNum']: sharesubmitinfo.tol_days,
          ['circletitle']: sharesubmitinfo.circletitle,
          ['iscircle']: sharesubmitinfo.iscircle,
          ['uname']: sharesubmitinfo.uname,
					sharesubmitinfo: sharesubmitinfo,
				})
				if(sharesubmitinfo.qr_canshu == 0){
					that.setData({
						// ['productDetail.TxImg3']:app.globalData.config_host+"/data/upload/dakaprogram/logo.png",
						['productDetail.TxImg3']:app.globalData.config_host+"/data/upload/dakaprogram/logo2.jpg",
					})
				}else{
					that.setData({
						['productDetail.TxImg3']:sharesubmitinfo.qr_img,
					})
				}
				//加载完再绘制
				that.draw();
			}

		})

	},

	draw() {
		wx.showLoading({
			title: '图片加载中...',
			mask:true,
		});
		const {
			WIDTH,
			HEIGHT,
			productDetail
		} = this.data;
		ctx = wx.createCanvasContext('myCanvas');

		// 为了显示canvas的边框阴影 宽高都加了40px 然后进行移动位置 20 20
		// ctx.translate(20, 20);

		//0. 获取图片信息
		Promise.all([
			wxp.getImageInfo({
				src: this.data.productDetail.TxImg //头像
			}),
			wxp.getImageInfo({
				src: this.data.productDetail.imageUrl //分享内容图
// src: "https://test.liupinshuyuan.com/data/upload/dakaprogram/2019/0315/14/5c8b47f917fa6.jpg"///600*600

// src:"https://test.liupinshuyuan.com/data/upload/dakaprogram/2019/0314/08/5c89a7214e353.jpg" //600*400
// src:'https://test.liupinshuyuan.com/data/upload/dakaprogram/2019/0322/13/5c9471acbaf47.jpg' //1920*1080
// src:"https://test.liupinshuyuan.com/data/upload/dakaprogram/2019/0312/09/5c8710b21bb0a.png" //3859*2899

// src:"http://www.liupintang.com/data/attachment/forum/201812/17/220331bfjl66rac8c93tfs.jpeg" //1125*1500
// src:"https://test.liupinshuyuan.com/data/upload/dakaprogram/2019/0311/17/5c86272d6e0c5.jpg" //3000*4000
// src:'https://test.liupinshuyuan.com/data/upload/dakaprogram/2019/0322/15/5c948f7051163.jpg' //1080*1653
// src:"https://test.liupinshuyuan.com/data/upload/dakaprogram/2019/0323/11/5c95aa4f1ce1d.jpg" //1080*1624
// src:'https://test.liupinshuyuan.com/data/upload/dakaprogram/2019/0322/15/5c9493729430d.jpg' //540*960
// src:'https://test.liupinshuyuan.com/data/upload/dakaprogram/2019/0322/13/5c9471f664689.jpg' //1080*1440
			}),
			wxp.getImageInfo({
				src: this.data.productDetail.bjImg //背景图
			}),
			wxp.getImageInfo({
				src: this.data.productDetail.TxImg2 //简介图
			}),
			wxp.getImageInfo({
				src: this.data.productDetail.TxImg3 //二维码
			})
		]).then(res => {
			console.log(res)
			var daysNum=this.data.daysNum;
			var iscircle = this.data.iscircle;
			var circletitle = this.data.circletitle;
			const imgTx = res[0].path ;	//头像
			const imgCont = res[1].path ; //分享内容图
			const imgContW = res[1].width ; //宽
			const imgContH = res[1].height ; //高
			const imgBj = res[2].path ;	//背景图
			const imgJJ = res[3].path ;	//简介图
			const imgEwm = res[4].path ;	//二维码
			
			let bjHeight = HEIGHT * 0.8 ;
			// console.log('背景图高度'+ bjHeight )
			// console.log( '内容区图片的尺寸：'+ imgContW, imgContH )

			//1. 图片背景
			ctx.save();
			ctx.setFillStyle('#fff');
			ctx.fillRect(0, 0 , WIDTH, HEIGHT);
				// console.log('屏幕尺寸是：' + WIDTH, HEIGHT)
			ctx.drawImage(imgBj  ,0 , 0 , WIDTH, bjHeight );
			ctx.restore();

			//2. 天数
			ctx.save();
			ctx.setFillStyle('rgba(255,255,255,0.8)'); 
			ctx.fillRect(0, 0, 110 , 160 );  
			ctx.font = 'bold 38px arial';
			ctx.fillStyle = '#333333';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			/**
			 * w=21
			 */
			let metrics1 = ctx.measureText( this.data.daysNum )
			let vNums1 =  (metrics1.width/21).toFixed() ;
			let textEndW1 = '' ;
			if ( vNums1 == 1 ) {
				textEndW1 =  vNums1 * 21 + 21   ;
			} 
			if ( vNums1 == 2 ) {
				textEndW1 =  vNums1 * 21 - 12   ;
			}
			if( vNums1 == 3 ){
				textEndW1 = 12 ;
			}
			if( vNums1 >3 ){
				textEndW1 = 12 ;
				ctx.font = 'bold 30px arial';
			}
			ctx.fillText( this.data.daysNum ,  textEndW1 , 35 );//打卡坚持天数 x y
			ctx.restore();


			ctx.save();
			ctx.font = 'normal 24px arial';
			ctx.fillStyle = '#666666';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'right';
			ctx.fillText( '天' , 100, 45 );
			ctx.restore();

			ctx.moveTo(20, 100)
			ctx.lineTo(90, 100)
			ctx.stroke()

			ctx.save();
			ctx.font = 'normal 20px arial';
			ctx.fillStyle = '#666666';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.fillText( '坚持打卡' , 15, 120 );
			ctx.restore();


			//3. 内容图--旧版
			const scale1 = imgContW / imgContH;
			// const scale2 = 521 / 668;
			let drawW =0 ,drawH=0,
				mt=0,ml=0,
				lineL=0,lineT=0,lineW=0,lineH=0,
				boxL=0,boxT=0,boxW=0,boxH = 0;

			console.log('图片原始尺寸' + imgContW +'*'+ imgContH )
			if (scale1 == 1) {
				// console.log('----正图----')
				drawW =( imgContW*0.5>630)  ?  630  :  630 ;
				drawH = 630 ;
				ml = 60 ; // x
				mt = 190 ; // y
				lineL = ml ;
				lineT = mt ;
				lineW = 0 ;
				lineH = 0 ;
				boxL = ml ;
				boxT = mt ;
				boxW = drawW ; 
				boxH = drawH ;
				
				// console.log('方法000计算尺寸'+ drawW, drawH,  ml, mt , lineL , lineT)
			}
			if (scale1 > 1) {
				if ( imgContW > 2500 ) {
					// console.log('----大宽图----')
					drawW = imgContW * 0.16 ;
					drawH = imgContH * 0.165 ;
					ml = 60  ; // x
					mt = (630 - drawH) / 2 + 141 ; // y
					lineL = ml ;
					lineT = mt ;
					lineW = 0 ;
					lineH = 0 ;
					boxL = 60 ;
					boxT = 192 ;
					boxW = 630 ; 
					boxH = 500 ;
					// console.log('方法11计算尺寸'+  drawW, drawH, ml, mt , lineL , lineT)
				}else if( imgContW > 629 ) { 
					// console.log('----小宽图尺寸----')
					drawW =  (imgContW * 0.5)>630 ?  imgContW * 0.5 : 630 ;
					let vW = drawW - 630 ;
					console.log(vW)
					drawH = 497 ;
					ml = 60 ; // x
					mt = (630 - drawH) / 2 + 141 ; // y
					lineL = ml  ;
					lineT = mt  ;
					lineW = -vW ;
					lineH = 0 ;
					boxL = lineL ;
					boxT = lineT ;
					boxW = 630  ; 
					boxH = drawH ;

					// console.log('方法2222计算尺寸'+  drawW, drawH, ml, mt , lineL , lineT)
				}else{
					// console.log('----小小小宽图尺寸----')
					drawW = 630 ;
					drawH = 497 ;
					ml = 60 ; // x
					mt = (630 - drawH) / 2 + 141 ; // y
					lineL = ml ;
					lineT = mt ;
					lineW = 0 ;
					lineH = 0 ;
					boxL = lineL ;
					boxT = lineT ;
					boxW = drawW  ; 
					boxH = drawH ;
					// console.log('方法3333计算尺寸'+  drawW, drawH, ml, mt , lineL , lineT)
				}
				// console.log('图片计算的尺寸' +drawW , drawH )
			}
			if (scale1 < 1) {
				// console.log('长图片原始尺寸:' + imgContW , imgContH , scale1 )
				if ( imgContH > 1600 ) {
					// console.log('--大长图--')
					drawW = 473;
					drawH = 762;
					ml = 139 ;
					mt = (762 - drawH) / 2 + 80 ;
					lineL = ml ;
					lineT = mt ;
					lineW = 0 ;
					lineH = 0 ;
					boxL = ml ;
					boxT = mt ;
					boxW = drawW ; 
					boxH = drawH ;

				}else{
					// console.log('*******小图尺寸******')
					drawW = 473;
					drawH = 762;
					ml = 139 ;
					mt = (762 - drawH) / 2 + 80 ;
					lineL = ml ;
					lineT = mt ;
					lineW = 0 ;
					lineH = 0 ;
					boxL = ml ;
					boxT = mt ;
					boxW = drawW ; 
					boxH = drawH ;
				}
				// console.log('方法22计算尺寸'+ drawW, drawH,  ml, mt , lineL , lineT)
			}
			ctx.save();
			ctx.beginPath();
			ctx.strokeStyle = "rgba(0,0,0,0)";
			ctx.rect( boxL , boxT , boxW , boxH );	// x y w h
			ctx.closePath();
			ctx.stroke();
			ctx.clip();	//裁剪图
			ctx.drawImage(imgCont, ml , mt , drawW, drawH); //img x y w h
			ctx.restore();

			ctx.save();
			ctx.setStrokeStyle('#BDA485')
			ctx.setLineWidth(12)
			ctx.strokeRect( lineL , lineT , drawW + lineW , drawH + lineH  )	//描边  x y w h
			ctx.restore();


			//4. 课程名
			ctx.save();
			ctx.font = 'normal 30px arial';
			ctx.fillStyle = '#333333';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.fillText('我正在', 20 , bjHeight + 40 );   
			ctx.restore();

			// circletitle = '窝草窝草窝草窝草窝草窝草窝草窝草' ; 
			let textW = 360 ;
			CTB({
				ctx,
				text: `           「 ${this.getSub(circletitle,13)} 」` ,//此处不可动
				x: 20,
				y:  bjHeight + 40 ,
				w: textW ,
				fontStyle: {
					lineHeight: 40,
					textAlign: 'left',
					textBaseline: 'top',
					font: 'normal bold 30px arial',//此处bug问题需设置normal bold
					fontSize: 30,
					fillStyle: '#333333'
				}
			});
			/**
			 * w=26 s=26px 
			 * w=30 s=30px
			 */
			let metrics = ctx.measureText( this.getSub(circletitle,15) )
			console.log( metrics.width  )
			let vNums =  metrics.width/30 ;
			console.log( vNums  )
			let textEndW = '' ;
			if (metrics.width > 400 ) {
				textEndW = (vNums-8)*30 + 15 ;
				console.log(textEndW )
			} else if( metrics.width > 238 ){
				textEndW = (vNums-8)*30 + 60 ;
				console.log(textEndW )
			} else {
				textEndW = 20 ;
			}
			ctx.save();
			ctx.font = 'normal 30px arial';
			ctx.fillStyle = '#333333';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			if (iscircle == 1) {
				ctx.fillText('圈子内学习', textEndW , bjHeight + 80  );  
			} else {
				ctx.fillText('小程序', 305 , bjHeight + 40  );  
				ctx.fillText('学习书法', 20 , bjHeight + 80  ); 
			}
			ctx.restore();


			//5. 头像
			let avatarurl_width = 60; //绘制的头像宽度
			let avatarurl_heigth = 60; //绘制的头像高度
			let avatarurl_x = 20; //绘制的头像在画布上的位置
			let avatarurl_y = bjHeight + 130 ; //绘制的头像在画布上的位置
			ctx.save();
			ctx.beginPath();  
			ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
			ctx.clip();
			ctx.drawImage( imgTx , avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth); 
			ctx.restore(); 


			//6. 用户名
			ctx.save();
			ctx.font = 'normal 24px arial';
			ctx.fillStyle = '#333333';
			ctx.textBaseline = 'top';
			ctx.textAlign = 'left';
			ctx.fillText(this.getSub(this.data.uname, 10), 95 , bjHeight + 146 );
			ctx.restore();


			//7. 二维码
			ctx.save();
			ctx.drawImage(imgEwm, WIDTH - 200 , bjHeight + 30 , 160, 160);
			ctx.restore();


			ctx.draw(false, () => {
				setTimeout(() => {
					// 生成图片
					wxp.canvasToTempFilePath({
						canvasId: 'myCanvas',
					}).then(({
						tempFilePath
					}) => {
						this.setData({
							cardCreateImgUrl: tempFilePath
						});
						wx.hideLoading();
					});
				}, 500);
			});


		});
		
	},

	// 保存到相册
	saveLoca:function(){
		// 获取授权：图片保存到相册
		var imgs = this.data.cardCreateImgUrl;
		wx.saveImageToPhotosAlbum({
			filePath: imgs,
			success(res) {
				console.log(res)
				wx.showToast({
					icon:'none',
					title: '图片已保存至相册,快去发朋友圈吧',
				});
			},
			fail(err) {
				console.log(err)
				wx.hideLoading();
				//授权
				Dialog.alert({
					title: '提示授权',
					message: '请您前往设置授权，否则无法保存图片到本地',
					confirmButtonText:'前往设置',
					confirmButtonOpenType: 'openSetting',
					closeOnClickOverlay: true,
				}).then(() => {
				// on close
				});
			}
		})
	},


	//关闭
	closeBox:function(e){
		var cid = e.target.dataset.cid;
    var mid = wx.getStorageSync('mid')
		if (cid>0){
			wx.redirectTo({
        url: '/pages/circleInfoCard/circleInfoCard?id=' + cid
			})
		}else{
      wx.redirectTo({
        url: '/pages/myCardRecord/myCardRecord?uid=' + mid
			})
		}
	
	},



	/**
	 * @desc 获取当前日期
	 */
	getToday() {
		const date = new Date();
    console.log(date);
		const zeroize = n => n < 10 ? `0${n}` : n;
		return `${date.getFullYear()}-${zeroize(date.getMonth() + 1)}`;
	},
	/**
	 * @desc 获取当前日
	 */
	getDays() {
		const date = new Date();
		const zeroize = n => n < 10 ? `0${n}` : n;
		return `${zeroize(date.getDate())}`;
	},
	/**
	 * @desc 获取裁剪后的字符串
	 */
	getSub(str='',max=1){
		return str.length > max ? `${str.substr(0, max)}...` : str;
	}


})
