//获取应用实例
const app = getApp()
Page({
    data: {
		navH:'',
        personalinfo:[],
        is_me:'', //自己还是别人
        test_circle: '正在加载中...',
        test_daka: '正在加载中...',
        uid:'',//传递过来的uid
        mid:'',//登陆uid
		showHome:true ,
		showNav: true ,

		showIcon: true,				//顶部导航是否显示左侧按钮
		bgColor:"rgba(0,0,0,0)",			//顶部导航背景颜色

        // 打卡记录
        page: 1,
        size: 10,
        tol_days: 0,
        loading: false,
        allloaded: false,
        list: [],
        biaozhi:'',//判断有无打卡记录标志

		tbodyHeight:0 ,	//高度
        NavHeight: 0 ,
        isShowsText:'',
        isShows:false,  //默认不显示
        isloading:false,//默认不显示加载动画
	},

    onReady:function(){
		let _this = this ;
		let NavHeight = app.globalData.statusBarHeight + app.globalData.titleBarHeight ;
        console.log( NavHeight )
        _this.setData({
            NavHeight :  NavHeight ,
        });	
	},
    onLoad: function (e) {
        let mid = wx.getStorageSync('mid');
        if (mid == "") {
            var urlArray = {
                urlmodel: '2',
                urlAll: '/pages/homePersonal/homePersonal?uid='+e.uid
            }
            wx.setStorageSync('urlArray', urlArray);
            wx.redirectTo({
                url: "/pages/loginUser/loginUser",
            });
            return;
        }
        this.setData({
            uid:e.uid,
            mid:mid
        })
        this.onLoadRequest();
        //页面预加载一次数据
        // this.getList();
        this.getList2();

    },
    // 页面进入请求
    onLoadRequest:function(){
        let _this = this;

        wx.request({
            url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Mine&act=homepage',
            data: {uid:_this.data.uid,mid:_this.data.mid,token: app.globalData.token},
            // data: {uid:90216,mid:90216},
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res.data.data);
                let is_me = res.data.data.user.is_me;
                if(res.data.data.circle == ''){
                    _this.setData({
                        test_circle: '暂未加入圈子',
                    })
                }
                console.log(is_me);
                _this.setData({
                    is_me: is_me,
                    personalinfo:res.data.data
                })

            },

        })
    },
	onPageScroll(event) {
		// console.log('======滚动======')
		// console.log(event.scrollTop)

		if ( event.scrollTop > 310 ) {
			this.setData({
                bgColor:'#fff',
                // listHeights: 1500 ,
			});
		}else{
			this.setData({
                bgColor:'rgba(0,0,0,0)',
                // listHeights: '',
			});
		}
		// console.log(this.data.page)
	},

    // 页面下拉刷新回调接口
	onPullDownRefresh: function () {
        this.onLoadRequest();
        wx.stopPullDownRefresh();
        console.log('---操作下拉---')
	},
    // 上拉加载数据
    onReachBottom: function() {
        // console.log( '触发底部了');
        this.setData({
            isShows:true,
            isShowsText:'正在拼命的捞数据',
            isloading:true,
        })
        this.getList2();
    },
    getList2() {
        // console.log('测试第1次页码=='+ this.data.page)
        // console.log( this.data  )
        // console.log('测试页码*'+ this.data.page)
        setTimeout(() => {
            wx.request({
                url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=dakalist',
                data:{
                    yeshu: this.data.page,
                    uid: this.data.uid,
                    mid:this.data.mid,
                    canshu:1,
                    is_me:this.data.is_me,
                    token: app.globalData.token
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (ret) => {
                    let newList = [];
                    //let lists = ret.data;
                    let lists = ret.data.data;
                    console.log(lists);
                    if (lists == null ) {
                        this.setData({
                            allloaded: true,
                            isloading:false,
                            test_daka:'暂无数据',
                            isShowsText:'数据加载完了',
                        })
                        // console.log(this.data.allloaded)
                        // console.log('数据加载完了')
                        // console.log('=====End数据001=====')
                        // resolve();
                    }else{
                        // console.log(ret.data.data);
                        lists.forEach(item=>{
                            newList.push(item)
                        })
                        let Newlist = this.data.list ;
                        let newsData  = Newlist.concat(newList)

                        this.setData({
                            loading: true,//隐藏加载动画图
                            list: newsData,
                            page: this.data.page + 1,
                            isShows:false ,//隐藏
                        })
                        // console.log('=====End数据=====')
                    }

                }

            })
        }, 1000)
     
    },

    //关注
    attention:function(){
        console.log('关注');
        console.log(this.data.uid)
        let mid = wx.getStorageSync('mid');
        wx.request({
            url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=doFollow',
            // url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=doFollow',
            data:{
                fid: this.data.uid,
                mid:mid,
                token: app.globalData.token
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: (ret) => {
                console.log(ret.data);

                wx.showToast({
                    title: ret.data.info,
                    icon: 'none'
                })
                if(ret.data.status == 1){
                    this.setData({
                        ['personalinfo.user.is_guanzhu']:1
                    })
                }
            }
        })
    },

    //取消关注
    unsubscribe:function(){
        console.log('关注');
        console.log(this.data.uid)
        let mid = wx.getStorageSync('mid');
        wx.request({
            url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=unFollow',
            // url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=unFollow',
            data:{
                fid: this.data.uid,
                mid:mid,
                token: app.globalData.token
            },
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: (ret) => {
                console.log(ret.data);

                wx.showToast({
                    title: ret.data.info,
                    icon: 'none'
                })
                if(ret.data.status == 1){
                    this.setData({
                        ['personalinfo.user.is_guanzhu']:2
                    })
                }
            }
        })
    },

	//预览图片
    imgView:function(event){
		// console.log(event)

		var src = event.currentTarget.dataset.src;//获取data-src

        var id = event.currentTarget.dataset.id;
        wx.request({
            url: app.globalData.config_host + '/index.php?app=dakaprogram&mod=Community&act=orimg',
            data: {id: id, token: app.globalData.token},
            success: function (res) {
                var imgList = res.data.data;

                //图片预览
                wx.previewImage({
                    current: src, // 当前显示图片的http链接
                    urls: imgList // 需要预览的图片http链接列表
                })

            }//wx.reque
        })
    },

	// 点赞
	handleLike: function(event) {
        var that = this;
		// console.log(event.detail)
        var id = event.currentTarget.dataset.id;
        let mid = wx.getStorageSync('mid');
        wx.request({
            url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=praise',
            // url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=praise',
            data: {subid:id,mid:mid,token: app.globalData.token},
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res.data.data);
                var zan_status = res.data.data.zan_status;
                wx.showToast({
                    title: res.data.info,
                    icon: 'none'
                })
                if(res.data.status == 1){
                    console.log(zan_status);
                    for (var i = 0; i < that.data.list.length; i++) {
                        if (that.data.list[i].id == id) {
                            // 点赞成功时遍历list对象并获取到当前节点的id
                            that.setData({
                                // 改变list对象 i 节点的值
                                ['list[' + i + '].praise.is_zan']: res.data.data.zan_status,
                                ['list[' + i + '].praise.count']: res.data.data.num
                            })
                        }
                    }

                }

            },

        })
		console.log('like!')
	},
    //收藏与取消收藏
    likes:function(event){
        var that = this;
        console.log(event)
        var id = event.currentTarget.dataset.id;
        console.log(id);
        wx.request({
            url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=collection',
            // url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=collection',
            data: {subid:id,mid:this.data.mid,token: app.globalData.token},
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res.data.data);
                console.log(res.data);
                var status = res.data.data;
                wx.showToast({
                    title: res.data.info,
                    icon: 'none'
                })
                if(res.data.status == 1){
                    console.log(status);
                    for (var i = 0; i < that.data.list.length; i++) {
                        if (that.data.list[i].id == id) {
                            // 点赞成功时遍历list对象并获取到当前节点的id
                            that.setData({
                                // 改变list对象 i 节点的值
                                ['list[' + i + '].collection']: status
                            })
                        }
                    }

                }

            },

        })
    },








    // /**
    //  * 打卡记录
    //  * @param {*} param0
    //  */
    // // 加载更多
    // loadmore({
    //     detail
    // }) {
    //     this.getList().then(res => {
    //         // console.log(res)
    //         detail.success();
    //     });
    // },
    // // 刷新
    // refresh({
    //     detail
    // }) {
    //     this.setData({
    //         loading: false,
    //         allloaded: false,
    //         page: 1 ,
    //         list: [],
    //       test_daka: '正在加载中...',
    //     })
    //     this.getList().then(res => {
    //         detail.success();
    //     });
    // },
    // getList() {
    //     return new Promise((resolve, reject) => {
    //         console.log('=====触发了打卡的请求=====')
    //         console.log('基础状态第1次=='+   this.data.loading)
    //         console.log('基础状态第111次=='+   this.data.allloaded)
    //         if (this.data.loading || this.data.allloaded) {
    //             resolve();
    //             return;
    //         }
    //         console.log('测试第1次页码=='+ this.data.page)
    //         this.setData({
    //             loading: true
    //         })
    //         console.log( this.data  )
    //         console.log('测试页码*'+ this.data.page)
    //         setTimeout(() => {
    //             wx.request({
    //                 url: app.globalData.config_host+'/index.php?app=dakaprogram&mod=Community&act=dakalist',
    //                 // url: 'http://127.0.0.1/index.php?app=dakaprogram&mod=Community&act=dakalist',
    //                 data:{
    //                     yeshu: this.data.page,
    //                     uid: this.data.uid,
    //                     mid:this.data.mid,
    //                     // uid: 90216,
    //                     // mid: 90216,
    //                     canshu:1,
    //                     is_me:this.data.is_me,
    //                     token: app.globalData.token
    //                 },
    //                 method: 'POST',
    //                 header: {
    //                     "Content-Type": "application/x-www-form-urlencoded"
    //                 },
    //                 success: (ret) => {
    //                     let newList = [];
    //                     //let lists = ret.data;
    //                     let lists = ret.data.data;

    //                     if (lists == null ) {
    //                         this.setData({
    //                             allloaded: true,
    //                             test_daka:'暂无数据'
    //                         })
    //                         console.log(this.data.allloaded)
    //                         console.log('数据加载完了')
    //                         console.log('=====End数据001=====')
    //                         resolve();
    //                     }else{
    //                     console.log(ret.data.data);
    //                     lists.forEach(item=>{
    //                         newList.push(item)
    //                     })
    //                     let Newlist = this.data.list ;
    //                     let newsData  = Newlist.concat(newList)

    //                         this.setData({
    //                             loading: false,
    //                             list: newsData,
    //                             page: this.data.page + 1
    //                         })
    //                         console.log('=====End数据=====')
    //                         resolve();
    //                     }

    //                 }

    //             })

    //             // 	resolve();
    //         }, 1000)
    //     })
    // },




})
