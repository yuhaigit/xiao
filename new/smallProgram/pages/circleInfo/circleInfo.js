//获取应用实例
var Wxmlify = require('../../components/wxmlify/wxmlify')
const app = getApp()
let component = null;
let components = null;
var page = 0; 	//分页初始值 精选
var pages = 0 ;	//最新
Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff",			//顶部导航背景颜色
    		isVideo: 0,	
    code: 0,	
		navH:'',
        imgUrls: [
        'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png',
        'https://test.liupinshuyuan.com/data/upload/2018/0914/18/5b9b8f91d24dc_720_300_720_300.png'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,

        imgUrls_2: [
            'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png',
            'https://test.liupinshuyuan.com/data/upload/2018/0914/18/5b9b8f91d24dc_720_300_720_300.png',
            'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png',
            'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png'
        ],
        isCourse: true , //是否有课
        CourseImg: [
            'https://test.liupinshuyuan.com/data/upload/2018/0829/09/5b85fbbbaeb73_720_300_720_300.png',
            'https://test.liupinshuyuan.com/data/upload/2018/0914/18/5b9b8f91d24dc_720_300_720_300.png'
        ],


        brick_option: { //瀑布流内容设置
            // showFullContent: true,
            // backgroundColor:"#16A085",
            // forceRepaint: true,
            defaultExpandStatus: true,
            // imageFillMode:'aspectFill'
            // columns: 3
            // icon: {
            //   fill: 'https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg',
            //   default:'https://images.ifanr.cn/wp-content/uploads/2018/08/640-90-1024x576.jpeg',
            // },
            // fontColor:'black'
        },

		active: 0 ,		//默认精选
    imgLists:[],	//精选
		imgLists2:[],	//最新
		open : 'all',	//激活
		opens : '',	//激活2
    noText: '正在加载中',	//激活2
		// remenList:[],	//页数
		list: [],

		tbodyHeight:0 ,	//高度


	},
	
  onReady:function(){
		var tbodyHeight = app.globalData.windowHeight - 160; //90为头部固定高度 
		console.log(tbodyHeight)
		this.setData({
			tbodyHeight: tbodyHeight.toFixed(0)
		})
	},
  navHeight: function () {
    this.setData({
      navH: app.globalData.navHeight
    })
  },
  initInfocircle: function (e) {
    this.infoCirlce(e);
    this.navHeight();
  },
  isnetworkType: function () {
    var that =this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：@lee
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        if (networkType == 'wifi') {
          that.setData({
            isVideo: 1
          })
        }
      }
    })
  },
  onLoad(e){
    var that = this;
    that.isnetworkType();
    var source = e.source;
  if(source == undefined || source == null){
    this.initInfocircle(e);
  }else{
    var mid = wx.getStorageSync('mid');
    if(mid == ''){
      this.initInfocircle(e);
    }else{
      wx.request({
        url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=incircle',
        data: {mid: mid, id:e.id,token: app.globalData.token },
        header: {"Content-Type": "application/x-www-form-urlencoded"  },
        method: 'POST',
        success: function (res) {
          if(res.data.data.in_circle == 0){
            that.initInfocircle(e);
          }else{
            wx.redirectTo({
              url: "/pages/circleInfoCard/circleInfoCard?id=" + e.id
            })
          }
        }

      })
  }
}
    //@lee 圈子详情

    // if (app.globalData.islogin && app.globalData.islogin != '') {
    //    this.initInfocircle(e);
    // } else {
    //   app.isloginCallback = (gointo) => {
    //     console.log('查看得到的数据:', gointo)
    //     this.initInfocircle(e);
    //   }
    // }

   


		
	},

  // 取消关注圈主，吊炸天@lee
  quxiaoQuanzhu: function (event) {
    var that = this;
    var infocirclecard = that.data.infocirclecard;
    var mid = wx.getStorageSync('mid');
    var fid = event.currentTarget.dataset.fid;
    console.log(infocirclecard);
    console.log(mid);
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=unFollow',
      data: { fid: fid, mid: mid,token: app.globalData.token },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })

        that.setData({
          ['infocircle.isfollow']: 0
        })
      }

    })
  },
  // 关注圈主，吊炸天@lee
  guanzhuQuanzhu: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var infocircle = that.data.infocircle;
    var mid = wx.getStorageSync('mid');
    //授权登录
    var isloginOauth=app.loginOauth('2', '/pages/circleInfo/circleInfo?id='+id);
    if (isloginOauth==0){
          return;
      }
    //if(a == "") {
    //   var urlArray = {
    //     urlmodel: '2',
    //     urlAll: '/pages/circleInfo/circleInfo?id='+id
    //   }
    //   wx.setStorageSync('urlArray', urlArray);
    //   wx.navigateTo({
    //     url: "/pages/loginUser/loginUser",
    //   });
    //   return;
    // }
    var fid = event.currentTarget.dataset.fid;
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=doFollow',
      data: { fid: fid, mid: mid,token: app.globalData.token },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })

        that.setData({
          ['infocircle.isfollow']: 1
        })
      }

    })
  },
  //替换函数，无限可能@lee
  srcUrlreplace: function (str1) {
    var str = str1 +"";
    // var str = "this is test string <img src=\"http:yourweb.com/test.jpg\" width='50' > 123 and the end <img src=\"所有地址也能匹配.jpg\" /> 33! <img src=\"/uploads/attached/image/20120426/20120426225658_92565.png\" alt=\"\" />"
    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var imgReg = /<img.*?(?:>|\/>)/gi;
    var length = 0;
    var arr = str.match(imgReg);
    if (!arr){
      length=0;
    }else
    {
      var length = arr.length;
    }
    console.log(length);
      for (var i = 0; i < length; i++) {
      var src = arr[i].match(srcReg);
       if (src[1]) {
         console.log(src[1]);
         str=str.replace(src[1], app.globalData.config_host+src[1])
       }
    
    }
   // console.log(str);
    return str;
  },
  //@lee 圈子详情还没加入的页面接口
  infoCirlce: function (e) {
    var that = this;
    var id=e.id;
    var code = e.code;
    
    if(code==1){
      that.setData({
        code: code
      })
    }
    if(id==''){
      wx.switchTab({
        url: '/pages/circle/circle'
      })
    }
    var mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=infoJoinNo&id='+id,
      data: { mid: mid,token: app.globalData.token },
      success: function (res) {
        var infocircle = res.data.data;

        var infocirclepro = infocircle.circle_pro;
        var infocirclepro = that.srcUrlreplace(infocirclepro);
        that.setData({
          infocircle: infocircle, noText:"暂无打卡日记"
        })
        var wxmlify = new Wxmlify(infocirclepro, that, {
          preserveStyles: ['fontSize', 'fontWeight', 'fontStyle', 'color', 'textDecoration', 'textAlign', 'backgroundColor', 'background'],
          dataKey: 'nodes',
          disableImagePreivew: false,
          onImageTap: function (evt) {
            console.log(evt)
          }
        })

        console.log(wxmlify.getFullNodes())
      }

    }) //wx.request
    console.log(mid);
  },
    //点击喜欢
    likes:function(event){
        wx.showToast({
            title: '收藏成功',
			icon: 'none'
        })
    },
	//立即加入圈子
	gotoCireText:function(){
		wx.switchTab({
			url: '/pages/circle/circle'
		})
	},
  //@lee 加入圈子神操作
  gotoCireBtns: function (event) {
    var that = this;
    var id=event.currentTarget.dataset.id;
    var mid = wx.getStorageSync('mid');
    var isloginOauth = app.loginOauth('2', '/pages/circleInfo/circleInfo?id=' + id);
    if (isloginOauth == 0) {
      return;
    }
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=joinCircle',
      data: { mid: mid,cid:id ,token: app.globalData.token},
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })
        wx.navigateTo({
          url: "/pages/circleInfoCard/circleInfoCard?id=" + id
        })
      }

    }) //wx.request
  },
	//预览图片
    imgView:function(event){
		console.log(event)

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
	// 改变卡片展开状态事件的回调
	// handleExpand: function(event) {
	// 	console.log(event.detail)
	// 	console.log('expand call back')
	// },

	// // 点击卡片
	// tapCard: function(event) {
	// 	console.log(event.detail)
	// 	console.log('tap card!')
	// },

	// 点赞
	handleLike: function(event) {
		console.log(event.detail)
		console.log('like!')
	},
  //@lee 抄袭首页的收藏功能
  collectionButtonX: function (e) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    var circle = e.currentTarget.dataset.circle;
    var isloginOauth = app.loginOauth('2', '/pages/circleInfo/circleInfo?id=' + circle);
    if (isloginOauth == 0) {
      return;
    }
    var subid = e.currentTarget.dataset.index;
    var xiabiao = e.currentTarget.dataset.xiabiao;
    var iscollection = e.currentTarget.dataset.iscollection;
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=collection',
      method: 'POST',
      data: { mid: mid, subid: subid ,token: app.globalData.token},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //本地处理即可。不需要调用接口@lee
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })
        if (iscollection == 0) {
          that.setData({
            ['infocircle.submit_limit[' + xiabiao + '].iscollection']: 1
          })
        } else {
          that.setData({
            ['infocircle.submit_limit[' + xiabiao + '].iscollection']: 0
          })

        }
      }//wx.reque

    })
  },
  //@lee播放视频
  playsVideo: function () {
    this.setData({
      isVideo: 1
    })
  },
  imgViewByidX:function (event) {
    var id = event.currentTarget.dataset.id;//获取data-src
    var src = event.currentTarget.dataset.src;//获取data-src

    // var imgList = event.currentTarget.dataset.list;//获取data-list
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homesubmit&act=info',
      data: { id: id ,token: app.globalData.token},
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

  // 回复
  replys(){
    console.log('88888888888888')
  },

  // 点赞@lee 改造点赞
  handleZanX: function (event) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    var circle = event.currentTarget.dataset.circle;
    //授权登录
    var isloginOauth = app.loginOauth('2', '/pages/circleInfo/circleInfo?id=' + circle);
    if (isloginOauth == 0) {
      return;
    }
    var id = event.currentTarget.dataset.id;
    var xiabiao = event.currentTarget.dataset.xiabiao;
    var values = event.currentTarget.dataset.values;
    var iszan = event.currentTarget.dataset.iszan;
    var iszanadd = parseInt(values - 1 + 2);
    var iszandelete = parseInt(values - 1);
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=praise',
      data: { subid: id, mid: mid ,token: app.globalData.token},
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
            ['infocircle.submit_limit[' + xiabiao + '].ispraise']: 1,
            ['infocircle.submit_limit[' + xiabiao + '].zan_count']: iszanadd
          })
        } else {
          that.setData({
            ['infocircle.submit_limit[' + xiabiao + '].ispraise']: 0,
            ['infocircle.submit_limit[' + xiabiao + '].zan_count']: iszandelete
          })
        }
      }

    })
  },
})