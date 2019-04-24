//获取应用实例
var webim = require('../../utils/webim_wx.js');
var webimhandler = require('../../utils/webim_handler.js');

global.webim = webim;

var app = getApp()
Page({
  data: {
    bgColor: '#fff', //顶部导航背景颜色,
    showIcon: true,
    bgColor: '#fff',
    identifier: '', // 当前用户身份标识，必选
    userSig: '', // 当前用户签名，必选
    nickName: '', // 当前用户昵称，选填
    avChatRoomId: '', // 群ID, 必选
    motto: 'Hello World',
    msgs: [],
    msgContent: "",
    msgContentLength: 0,
    isTopRefresh: false,
    tbodyHeight:0,  //内容高度
    botHeight:0 , //底部发送表单高度,
    seq:0 , //漫游消息最大seq
    groupTitle:"",
    topHeight: 0,
    preCid:"", //上一级页面的圈子ID
    keyboardH:0,
    isFinished: false, //是否还有历史消息
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  clearInput: function () {
    this.setData({
      msgContent: "",
      msgContentLength: 0
    })
  },

  bindConfirm: function (e) {
    var that = this;
    var content = e.detail.value;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    webimhandler.onSendMsg(content, function () {
      that.clearInput();
    })
  },
  confirmClick: function () {
    var that = this;
    var content = this.data.msgContent;
    if (!content.replace(/^\s*|\s*$/g, '')) return;
    wx.request({
      url: app.globalData.config_host + '/index.php?app=basic&mod=TencentCloud&act=hiddenDirtyWord',
      data: {
        text:content
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        webimhandler.onSendMsg(res.data.text, function () {
          that.clearInput();
        })
      }
    })
    // setTimeout(()=>{
    //   that.log()
    // },500)
  },
  getInputVal: function (e) {
    if(!e.detail.value.replace(/^\s*|\s*$/g, '')){
      this.setData({
        msgContentLength: 0
      })
      return;
    }
    this.setData({
      msgContent: e.detail.value,
      msgContentLength: e.detail.value.length
    })
  },
  bindTap: function () {
    webimhandler.sendGroupLoveMsg();
  },
  clickHead: function(e){  //点击头像进入个人主页
    let uid = e.currentTarget.dataset.uid;
    wx.redirectTo({
      url: '/pages/homePersonal/homePersonal?uid='+uid
    })
  },
  topend: function () {
    var that = this;
    if (that.data.isTopRefresh) {
      return;
    }
    that.setData({
      isTopRefresh: true
    })

    setTimeout(() => {
      that.setData({
        isTopRefresh: false
      })
    }, 1000)
  },

  receiveMsgs: function (data) {
    console.log('haha', data);
    var msgs = this.data.msgs || [];
    msgs.push(data);
    //最多展示10条信息
    // if (msgs.length > 10) {
    //     msgs.splice(0, msgs.length - 10)
    // }

    this.setData({
      msgs: msgs
    })
  },

  initIM: function () {
    var that = this;
    var avChatRoomId = that.data.avChatRoomId;

    webimhandler.init({
      accountMode: 0,//帐号模式，0-表示独立模式，1-表示托管模式(已停用，仅作为演示)
      accountType: app.globalData.accountType,
      sdkAppID: app.globalData.sdkappid,
      avChatRoomId: avChatRoomId, //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
      selType: webim.SESSION_TYPE.GROUP,
      selToID: avChatRoomId,
      selSess: null //当前聊天会话
    });
    //当前用户身份
    var loginInfo = {
      'sdkAppID': app.globalData.sdkappid, //用户所属应用id,必填
      'appIDAt3rd': app.globalData.sdkappid, //用户所属应用id，必填
      'accountType': app.globalData.accountType, //用户所属应用帐号类型，必填
      'identifier': that.data.identifier, //当前用户ID,必须是否字符串类型，选填
      'identifierNick': that.data.nickName || '', //当前用户昵称，选填
      'userSig': that.data.userSig, //当前用户身份凭证，必须是字符串类型，选填
    };
    //监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
    var onGroupSystemNotifys = {
      "5": webimhandler.onDestoryGroupNotify, //群被解散(全员接收)
      "11": webimhandler.onRevokeGroupNotify, //群已被回收(全员接收)
      "255": webimhandler.onCustomGroupNotify //用户自定义通知(默认全员接收) 
    };

    //监听连接状态回调变化事件
    var onConnNotify = function (resp) {
      switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
          //webim.Log.warn('连接状态正常...');
          break;
        case webim.CONNECTION_STATUS.OFF:
          webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
          break;
        default:
          webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
          break;
      }
    };


    //监听事件
    var listeners = {
      "onConnNotify": webimhandler.onConnNotify, //选填
      "onBigGroupMsgNotify": function (msg) {
        webimhandler.onBigGroupMsgNotify(msg, function (msgs) {
          that.receiveMsgs(msgs);
        })
      }, //监听新消息(大群)事件，必填
      "onMsgNotify": webimhandler.onMsgNotify, //监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
      "onGroupSystemNotifys": webimhandler.onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
      "onGroupInfoChangeNotify": webimhandler.onGroupInfoChangeNotify //监听群资料变化事件，选填
    };

    //其他对象，选填
    var options = {
      'isAccessFormalEnv': true, //是否访问正式环境，默认访问正式，选填
      'isLogOn': false //是否开启控制台打印日志,默认开启，选填
    };

    webimhandler.sdkLogin(loginInfo, listeners, options, avChatRoomId);
  },

  onUnload: function () {
    // 登出
    webimhandler.logout();
    //webimhandler.quitBigGroup();
  },
  onReady: function () {
    let _this = this;
    let topHeight = app.globalData.statusBarHeight + app.globalData.titleBarHeight;
    wx.createSelectorQuery().select('.replayBox').boundingClientRect(function (rect) {
      wx.getSystemInfo({
        success: function (res) {
          _this.setData({
            topHeight: topHeight,
            tbodyHeight: res.windowHeight - topHeight - rect.height
          })
        }
      })
    }).exec();   
  },
  onLoad: function (options) {  
    wx.showLoading({
      title: '拼命加载中',
      mask: true
    })  
    this.setData({
      userSig: options.userSig,
      identifier: options.identifier,
      nickName: options.uname,
      avChatRoomId: options.GroupId,
      groupTitle: options.groupTitle,
      preCid: options.id
    });
    this.initIM();
    this.histroyMsg(0)
  },
  log: function(){
    let _this = this;
    wx.createSelectorQuery().select('.msgs-wrapper').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: 300
      })
      _this.setData({
        scroll: rect.height
      })
    }).exec((res) => {
      console.log(res)
    })
  },
  onPullDownRefresh: function () {  
    let seq = this.data.seq;
    wx.showLoading({
      title: '拼命加载中',
      mask: true
    })
    if(this.data.isFinished){
      setTimeout(()=>{
        wx.hideLoading()
        wx.stopPullDownRefresh();
      },500)
    }else{
      this.histroyMsg(seq)
    }
    // setTimeout(() => {
    //   wx.stopPullDownRefresh();
    //   this.histroyMsg(seq)
    // }, 2000)
  },
  histroyMsg: function (seq) {   //拉取群组历史消息
    let that = this;
    let mid = wx.getStorageSync('mid');
    wx.request({
      url: app.globalData.config_host+'/index.php?app=basic&mod=TencentCloud&act=getGroupHistoryMessage',
      data: {
        ReqMsgNumber: 20,
        ReqMsgSeq: seq,   //消息对应的seq，最近的消息seq越大
        uid: mid,
        GroupId: that.data.avChatRoomId
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        let data = res.data.data;
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if(data.data.length == 0){
          that.setData({
            isFinished: true
          })
          return;
        }
        that.setData({
          msgs: [...data.data, ...that.data.msgs],
          seq: data.MsgSeq
        })
      }
    })
  },
  outRoom: function(){   //暂时离开房间
    wx.navigateBack({
      delta: 1
    })
  },
  bindFocus(event) {
    this.setData({
      keyboardH: event.detail.height ? event.detail.height : 0,
    })
  },
  bindBlur(event) {
    let _this = this;
    _this.setData({
      keyboardH: 0,
    })
  },
})