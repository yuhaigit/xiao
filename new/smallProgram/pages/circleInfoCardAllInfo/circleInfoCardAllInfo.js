//获取应用实例
var Wxmlify = require('../../components/wxmlify/wxmlify')
// var sample = require('../../sample')

const app = getApp()
Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
    	isVideo: 0, //视频默认没
		bgColor:"#fff", //顶部导航背景颜色
    	noText:'正在加载中...',
      	xid:'',//练习id
        cid:''
	},
    onLoad(e){
      console.log(e);
		//@lee 获取ID调用
		var id= e.id;
		this.setData({
          xid:id
        })
      // console.log(this.data.xid)
      // @yang 判断是否是扫练习码进来的
      var source = e.source;
      if(source == undefined || source == null){
        this.infoPractise(id);
        this.infoCircleCardhwlist(id);
      }else{
        var that = this;
        wx.request({
          url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=seacircle',
          data: {xid:e.id,token: app.globalData.token },
          header: {"Content-Type": "application/x-www-form-urlencoded"  },
          method: 'POST',
          success: function (res) {
            console.log(res.data.data.cid);
            that.setData({
              cid:res.data.data.cid
            })
			console.log(that.data.cid);
			// setTimeout(()=>{

				that.jumpcircle(id);//跳转页面

			// },200)
          }
        })
        console.log(that.data.cid);
        // setTimeout(()=>{
        //   that.jumpcircle(id);
        // },200)

      }
		// this.infoPractise(id);
    	// this.infoCircleCardhwlist(id);
	},
  //练习扫码页
  jumpcircle:function(id){
      var that = this;

      console.log(that.data.cid);
      var mid = wx.getStorageSync('mid');
      if(mid == ''){
        if(that.data.cid != 0){
          console.log(8888)
          wx.redirectTo({
            url: "/pages/circleInfo/circleInfo?id=" + that.data.cid
          })
        }else{
          console.log(99999)
          that.infoPractise(id);
          that.infoCircleCardhwlist(id);
        }
      }else{
        console.log(that.data.cid);
        wx.request({
          url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=incircle',
          data: {mid: mid, id:that.data.cid,token: app.globalData.token },
          header: {"Content-Type": "application/x-www-form-urlencoded"  },
          method: 'POST',
          success: function (res) {
            if(res.data.data.in_circle == 0){
              wx.redirectTo({
                url: "/pages/circleInfo/circleInfo?id=" + that.data.cid
              })
            }else{
              wx.redirectTo({
                url: "/pages/circleInfoCard/circleInfoCard?xid=" + id+"&id="+that.data.cid
              })
            }
          }

        })
      }
    },
  //@lee 抄袭首页的收藏功能
  collectionButtonX: function (e) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    if (mid == "") {
      var urlArray = {
        urlmodel: '2',
        urlAll: '/pages/circleInfoCardAllInfo/circleInfoCardAllInfo?id='+this.data.xid
      }
      wx.setStorageSync('urlArray', urlArray);
      wx.redirectTo({
        url: "/pages/loginUser/loginUser",
      });
      return;
    }
    var subid = e.currentTarget.dataset.index;
    var xiabiao = e.currentTarget.dataset.xiabiao;
    var iscollection = e.currentTarget.dataset.iscollection;
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=collection',
      method: 'POST',
      data: { mid: mid, subid: subid,token: app.globalData.token },
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
            ['infoCircleCardhomesubmitlist[' + xiabiao + '].iscollection']: 1
          })
        } else {
          that.setData({
            ['infoCircleCardhomesubmitlist[' + xiabiao + '].iscollection']: 0
          })

        }
      }//wx.reque

    })
  },
  imgViewByidX: function (event) {
    var id = event.currentTarget.dataset.id;//获取data-src
    var src = event.currentTarget.dataset.src;//获取data-src

    // var imgList = event.currentTarget.dataset.list;//获取data-list
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homesubmit&act=info',
      data: { id: id ,token: app.globalData.token },
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
    if (mid == "") {
      var urlArray = {
        urlmodel: '2',
        urlAll: '/pages/circleInfoCardAllInfo/circleInfoCardAllInfo?id='+this.data.xid
      }
      wx.setStorageSync('urlArray', urlArray);
      wx.redirectTo({
        url: "/pages/loginUser/loginUser",
      });
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
      data: { subid: id, mid: mid ,token: app.globalData.token },
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
            ['infoCircleCardhomesubmitlist[' + xiabiao + '].ispraise']: 1,
            ['infoCircleCardhomesubmitlist[' + xiabiao + '].zan_count']: iszanadd
          })
        } else {
          that.setData({
            ['infoCircleCardhomesubmitlist[' + xiabiao + '].ispraise']: 0,
            ['infoCircleCardhomesubmitlist[' + xiabiao + '].zan_count']: iszandelete
          })
        }
      }

    })
  },
  //替换函数，无限可能@lee
  srcUrlreplace: function (str1) {
    var str = str1 + "";
    // var str = "this is test string <img src=\"http:yourweb.com/test.jpg\" width='50' > 123 and the end <img src=\"所有地址也能匹配.jpg\" /> 33! <img src=\"/uploads/attached/image/20120426/20120426225658_92565.png\" alt=\"\" />"
    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    var imgReg = /<img.*?(?:>|\/>)/gi;
    var length = 0;
    var arr = str.match(imgReg);
    if (!arr) {
      length = 0;
    } else {
      var length = arr.length;
    }
    for (var i = 0; i < length; i++) {
      var src = arr[i].match(srcReg);
      if (src[1]) {
        console.log(src[1]);
        str = str.replace(src[1], app.globalData.config_host + src[1])
      }

    }
    // console.log(str);
    return str;
  },


	// 播放
	plays:function(){
		console.log('点击了播放')
	},
  //@lee 圈子练习单个的作业列表
  infoCircleCardhwlist: function (id) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Practises&act=homeworksubmitByid',
      data: { id: id,mid:mid,token: app.globalData.token },
      success: function (res) {
        var infoCircleCardhomesubmitlist = res.data.data;
        that.setData({
          infoCircleCardhomesubmitlist: infoCircleCardhomesubmitlist, noText: '暂无打卡日记',
          
		})
		if(res.data.data==''){
			that.setData({
				noText: '暂无打卡信息'
			})
		}
      }

    }) //wx.request

  },
  //@lee 打卡
  gotoCireBtnsCard: function (event) {
    var mid = wx.getStorageSync('mid');
    if (mid == "") {
      var urlArray = {
        urlmodel: '2',
        urlAll: '/pages/circleInfoCardAllInfo/circleInfoCardAllInfo?id='+this.data.xid
      }
      wx.setStorageSync('urlArray', urlArray);
      wx.redirectTo({
        url: "/pages/loginUser/loginUser",
      });
      return;
    }
    var xid = event.currentTarget.dataset.xid;//获取data-src
    var that = this;
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Circles&act=princiecle',
      data: {mid: mid,xid:xid,token: app.globalData.token },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.data);
        if(res.data.data.in_circle == 0){
          wx.showToast({
            title: '请先加入该圈子，再打卡',
            icon: 'none',
            duration: 2000,
            success:function(){
              setTimeout(function () {
                wx.redirectTo({
                  url: "/pages/circleInfo/circleInfo?id=" + res.data.data.cid
                })
              }, 2000) //延迟时间
            }
          })
        }else{
          wx.navigateTo({
            url: "/pages/circleSign/circleSign?xid="+xid
          })
        }
      }

    })


    // var xid = event.currentTarget.dataset.xid;//获取data-src
    // wx.navigateTo({
    //   url: "/pages/circleSign/circleSign?xid="+xid
    // })
  },


  //@lee 圈子详情还没加入的页面接口
  playsVideo: function () {
    this.setData({
            isVideo: 1
    })
  },
  //@lee 圈子详情还没加入的页面接口
  infoPractise: function (id) {
    var that = this;
    var id =id;
    console.log(id);
    var mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Practises&act=infoByid&id=' + id,
      data: { id: id, mid:mid ,token: app.globalData.token },
      success: function (res) {
        var infoPractise = res.data.data;
        var as=infoPractise.prompt;
        // console.log(as);
        as= that.srcUrlreplace(as);
        that.setData({
          infoPractise:infoPractise
        })
        // 富文本解析
        var wxmlify = new Wxmlify(as, that, {
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


    
  //当个图片查看@lee 接口调用
  //@lee 首页基本信息获取和推荐圈子样式配置
  imgViewByid1: function (event) {
    var id = event.currentTarget.dataset.id;//获取data-src
    var src = event.currentTarget.dataset.src;//获取data-src
    this.setData({
      loadingImage: 1
    })
		// var imgList = event.currentTarget.dataset.list;//获取data-list
    wx.request({
      url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Homesubmit&act=info',
      data: { id: id ,token: app.globalData.token },
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









})