const app = getApp();
import Dialog from '../../dist/dialog/dialog';
Page({
    data: {
        showIcon: true, //顶部导航是否显示左侧按钮
        bgColor:"#fff", //顶部导航背景颜色
        
        contentA:"",    //文本内容
        pText:'写评论' , //输入框默认文字
        confirmtext:'发表评论' , //发表回复内容
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
      var hid=e.hid;
       var postid = e.postid;
      var hasuname = e.hasOwnProperty('uname');
      //判断是否有这个属性啊
      if(hasuname){
        var uname = e.uname; 
        this.setData({
          uname, hasuname, pText:"回复：@" + uname,confirmtext:"发表回复"
        })
      }
       this.setData({
         hid: hid, postid: postid
       })
    },
  // 点赞@lee 改造点赞
  postComment: function (event) {
    var that = this;
    var mid = wx.getStorageSync('mid');
    var content = that.data.contentA;
    if (content==''){
      wx.showToast({
        title: '请上传内容',
        icon: 'none'
      })
      return;
    }
    var postid = that.data.postid;
    var hid = that.data.hid;
    wx.request({
      url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Infosubmit&act=addComment',
      data: { mid: mid, content: content, hid: hid, postid: postid,token: app.globalData.token },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        var status = res.data.status;
        if(status==2){
          Dialog.alert({
            title: '提示',
            message: '检测到您之前在使用过程中有不良行为，该操作已锁住，如需解锁请联系客服。',
            confirmButtonText: '立即联系客服',
			confirmButtonOpenType:"contact",
			closeOnClickOverlay:true,
          }).then(() => {
            // on close
            console.log('跳转客服')
          });
        } else if (status == 3) {
          wx.showToast({
            title: res.data.info,
            icon: 'none'
          })
          return;
        }else if(status == 0){
        wx.showToast({
          title: res.data.info,
          icon: 'none'
        })
          return;
        }else{
          wx.showToast({
            title: res.data.info,
            icon: 'none'
          })
          console.log('6666')
          wx.redirectTo({
          url: '/pages/circleSignInfo/circleSignInfo?id=' + hid,
        })
        }
      }

    })
  },
    //获取用户输入的用户名
    bindTextAreaBlur: function (e) {
        console.log(e)
        this.setData({
            contentA: e.detail
		})
		// console.log(e.detail.length )
		if( e.detail.length > 199 ){
			wx.showToast({
				title: '最大字数限制不能超出255个哦！',
				icon: 'none'
			})
		}
        // console.log( this.data.contentA)
    },
  //获取用户输入的用户名
  gocancels: function (e) {
    wx.navigateBack();
  },


})