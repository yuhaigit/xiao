//获取应用实例
const app = getApp()
Page({
    data: {
		showIcon: true, //顶部导航是否显示左侧按钮
		bgColor:"#fff", //顶部导航背景颜色

        uid:'',//登陆uid
        checked: false , //开关
		times:'19:00', //时间
        mid:'',
        cid:'',
		// disabled: true,
		// buttonType: 'default',
		phoneNum: '',
		disableds:false,	//默认可点
        yanse:false,
        
        isShow: false,//是否显示时间选择
        remind:'0',//提醒时间展示。0：否。1：展示。
        // columns: ['00:00', '00:30', '01:00', '01:30', '02:00'],

        columns:[
            {
                values: ['00:00', '00:30', '01:00', '01:30', '02:00']   ,
                defaultIndex: 3
            }
        ],

        seValue:'38',//当前选中值

	},
	onLoad:function(e){
        let mid = wx.getStorageSync('mid');
        console.log(mid);
        // let times = this.getHalfTime() ;
        this.setData({
            // columns : times ,
            mid:mid,
            cid:e.cid,
        })

        console.log(this.data.cid);
        var that = this;
        wx.request({
            url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Clock&act=select_clock',
            data: {mid:this.data.mid,cid:this.data.cid,token: app.globalData.token},
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res.data.data);
                console.log(res.data.data.remind_time);
                console.log(res.data.data.select_suoyin);
                if(res.data.status == 1 ){
                    that.setData({
                        times : res.data.data.remind_time ,
                        seValue : res.data.data.select_suoyin ,
                    })
                    if(res.data.data.clock_status == 1){
                        that.setData({
                            checked : true ,
                            remind:'1'
                        })
                    }
                    if(res.data.data.clock_status == 2){
                        that.setData({
                            checked : false ,
                            remind:'0'
                        })
                    }
                }

            },

        })

    },
    
    //服务提醒开关
    selectBtn({ detail }) {
        console.log('操作')
        console.log( detail  )
        this.setData({ checked: detail });
        if(detail == true){
            this.setData({ remind: '1' });
        }else{
            this.setData({ remind: '0' });
        }
    },


    //设置时间
    bindTimeChange(e) {
        console.log(e)

        let times = this.getHalfTime() ;
        this.setData({
            ['columns[0].values']: times ,
            ['columns[0].defaultIndex']:  this.data.seValue ,
        })

        this.setData({
        //   times: e.detail.value
            isShow:true
        })
    },

    //确定 选中
    onConfirm(event) {
        console.log(event)
        const { picker, value, index } = event.detail;
        console.log( `当前值：${value}, 当前索引：${index}`   )
        this.setData({
            times: value,
            isShow:false,
            seValue:index,  //选中索引
        })
        
    },
    
    onChange(event) {
        console.log( event   )
        const { picker, value, index } = event.detail;


    },





    //取消 选中
    onCancel() {
        console.log( '取消'  )
        this.setData({
            isShow:false
        })
    },

    //计算时间
    getHalfTime(){
        let time = [];
        for (let i = 0; i < 25; i++){
            let hour = ( i < 10 ? '0' + i : i );
            time.push(hour + ':00');
            i < 24 && time.push(hour + ':30')
        }
        return time
        // console.log(time);
    },
    saveClock(){
        var times = this.data.times;
        var checked = this.data.checked;
        var cid = this.data.cid;
        var clock_status = 0;
        if(checked == false){
            clock_status = 2;
        }
        if(checked == true){
            clock_status = 1;
        }
        console.log(this.data.seValue)
        wx.request({
            url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Clock&act=save_clock',
            data: {mid:this.data.mid,clock_status:clock_status,times:this.data.times,select_suoyin:this.data.seValue,cid:this.data.cid,token: app.globalData.token},
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
                                    url: "/pages/circleInfoCard/circleInfoCard?id=" + cid
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
    },
    getUsersFormid_2sk(e){
        app.getUsersFormid_2sk_er3(e)
    },
})
