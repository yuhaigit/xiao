var config = require('config.js')
var chooseImage = (t, count) =>{
	// console.log('----用户在选择图片---')
    wx.chooseImage({
        count: count,
        sizeType: ['compressed'],
	//sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
			// console.log(res)
			var imgArr = t.data.upImgArr || [];
			var newdatass = t.data.newdatass || [];
			let arr = res.tempFiles;
			let arrA = res.tempFilePaths;
			//获取第一张图片地址 
          	var filep = res.tempFilePaths[0];
			arrA.forEach(item => {
				//向服务器端上传图片 
				// getApp().data.servsers,这是在app.js文件里定义的后端服 务器地址 
				wx.uploadFile({
					url: config.service.host + '/index.php?app=dakaprogram&mod=Fileimage&act=filePost',
					filePath: item,
					name: 'file',
					formData: {
						'user': 'test'
					},
					success: function (res) {
						var returnurl = JSON.parse(res.data)
						var return_url_one = returnurl['return_url'];
						//输出图片地址
						newdatass.push(return_url_one)
						t.setData({
							newdatass: newdatass, 
							disableds: newdatass.length,
							upImgArr:  newdatass ,
						})
						console.log(  t.data.disableds  )
						if (t.data.disableds>=t.data.maxUploadLen) {
							console.log('不能继续传图了')
							t.setData({
								upFilesBtn: false,
							})
						}
						if (arrA.length == newdatass.length) {
							let upFilesArr = getPathArr(t);
							if (upFilesArr.length > count-1) {
								let imgArr = t.data.upImgArr;
								let newimgArr = imgArr.slice(0, count)
								// console.log(imgArr  )
								console.log( newimgArr  )
								t.setData({
									upFilesBtn: false,
									upImgArr: newimgArr,
								})
							}
						}
						//do something  
					}, fail: function (err) {
						console.log(err)
					}
				});

			})

        },
    });
}
var chooseImageCard = (t, count) => {
	console.log('----用户在选择图片020---')
  wx.chooseImage({
    count: count,
    sizeType: ['compressed'],
    //sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      t.setData({
        imgReload:0
      })
      wx.showLoading({
        title: '图片正在上传中',
        mask:true,
      })
      var imgArr = t.data.upImgArr || [];
      var newdatass =  [];
      var xid = t.data.xid || 0;
      let arr = res.tempFiles;
      let arrA = res.tempFilePaths;
      //获取第一张图片地址 
      var filep = res.tempFilePaths[0];
      arrA.forEach(item => {
        //向服务器端上传图片 
        // getApp().data.servsers,这是在app.js文件里定义的后端服务器地址 
        wx.uploadFile({
          url: config.service.host + '/index.php?app=dakaprogram&mod=Fileimage&act=filePost',
          filePath: item,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var returnurl = JSON.parse(res.data)
            var return_url_one = returnurl['return_url'];
            //输出图片地址
            newdatass.push(return_url_one)
            t.setData({
              newdatass: newdatass, disableds: newdatass.length
            })
            wx.setStorageSync('img', newdatass);
            wx.setStorageSync('imgcount', newdatass.length);
            console.log(newdatass.length);
            if (arrA.length == newdatass.length) {
             
              wx.navigateTo({
                url: '/pages/circleSign/circleSign?xid=' + xid,
              })
              wx.hideLoading();
              t.setData({
                imgReload: 0
              })
            }
            //do something  
          }, fail: function (err) {
            console.log(err)
          }
        });
      })
      // console.log(res)
      arr.map(function (v, i) {
        v['progress'] = 0;
        imgArr.push(v)
      })
      t.setData({
        upImgArr: imgArr
      })
	  let upFilesArr = getPathArr(t);
	//   console.log( upFilesArr )
	//   console.log('最大上传限制张数：'+ count )
      if (upFilesArr.length > count - 1) {
        let imgArr = t.data.upImgArr;
		let newimgArr = imgArr.slice(0, count)
		// console.log('----图片张数获取----')
		// console.log( imgArr  )
		// console.log( newimgArr  )
		// console.log(t)
        t.setData({
          upFilesBtn: false,
          upImgArr: newimgArr
        })
      }
      // let sendData = t.data.newdatass ;
      // sendData.forEach((val)=>{
      // })
      // setTimeout(()=>{
      //   console.log(t.data.newdatass)
      // },1000)
	  console.log(arrA.length); 
	  console.log(3333);
	  console.log(newdatass.length);
      
      
    },
  });
}
var chooseVideo = (t,count) => {
    wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        compressed:true,
        camera: 'back',
        success: function (res) {
            let videoArr = t.data.upVideoArr || [];
            let videoInfo = {};
            videoInfo['tempFilePath'] = res.tempFilePath;
            videoInfo['size'] = res.size;
            videoInfo['height'] = res.height;
            videoInfo['width'] = res.width;
            videoInfo['thumbTempFilePath'] = res.thumbTempFilePath;
            videoInfo['progress'] = 0;
            videoArr.push(videoInfo)
            t.setData({
                upVideoArr: videoArr
            })
            let upFilesArr = getPathArr(t);
            if (upFilesArr.length > count - 1) {
                t.setData({
                    upFilesBtn: false,
                })
            }
            // console.log(res)
        }
    })
}

// 获取 图片数组 和 视频数组 以及合并数组
var getPathArr = t => {
	console.log(t.data)
	console.log(  t.data.upImgArr )
	let imgarr = t.data.upImgArr || [];
	console.log(imgarr)

    let upVideoArr = t.data.upVideoArr || [];
    let imgPathArr = [];
    let videoPathArr = [];
    imgarr.map(function (v, i) {
        imgPathArr.push(v.path)
    })
    upVideoArr.map(function (v, i) {
        videoPathArr.push(v.tempFilePath)
    })
	let filesPathsArr = imgPathArr.concat(videoPathArr);
    return filesPathsArr;
}

/**
 * upFilesFun(this,object)
 * object:{
 *    url     ************   上传路径 (必传)
 *    filesPathsArr  ******  文件路径数组
 *    name           ******  wx.uploadFile name
 *    formData     ******    其他上传的参数
 *    startIndex     ******  开始上传位置 0
 *    successNumber  ******     成功个数
 *    failNumber     ******     失败个数
 *    completeNumber  ******    完成个数
 * }
 * progress:上传进度
 * success：上传完成之后
 */

var upFilesFun = (t, data, progress, success) =>{
    let _this = t;
    let url = data.url;
    let filesPath = data.filesPathsArr ? data.filesPathsArr : getPathArr(t);
    let name = data.name || 'file';
    let formData = data.formData || {};
    let startIndex = data.startIndex ? data.startIndex : 0;
    let successNumber = data.successNumber ? data.successNumber : 0;
	let failNumber = data.failNumber ? data.failNumber : 0;
    if (filesPath.length == 0) {
      success([]);
      return;
    }
    const uploadTask = wx.uploadFile({
        url: url,
        filePath: filesPath[startIndex],
        name: name,
        formData: formData,
        success: function (res) {
            var data = res.data
            successNumber++;
            // console.log('success', successNumber)
            // console.log('success',res)
            // 把后台返回的地址链接存到一个数组
            let uploaded = t.data.uploadedPathArr || [];
            var da = JSON.parse(res.data);
            // console.log(da)
            if (da.code == 1001) {
                // ### 此处可能需要修改 以获取图片路径
                uploaded.push(da.data)

                t.setData({
                    uploadedPathArr: uploaded
                })
            }
        },
        fail: function(res){
            failNumber++;
            // console.log('fail', filesPath[startIndex])
            // console.log('failstartIndex',startIndex)
            // console.log('fail', failNumber)
            // console.log('fail', res)
        },
        complete: function(res){

            if (startIndex == filesPath.length - 1 ){
                // console.log('completeNumber', startIndex)
                // console.log('over',res)
                let sucPathArr = t.data.uploadedPathArr;
                success(sucPathArr);
                t.setData({
                    uploadedPathArr: []
                })
                console.log('成功：' + successNumber + " 失败：" + failNumber)
            }else{
                startIndex++;
                // console.log(startIndex)
                data.startIndex = startIndex;
                data.successNumber = successNumber;
                data.failNumber = failNumber;
                upFilesFun(t, data, progress, success);
            }
        }
    })

    uploadTask.onProgressUpdate((res) => {
        res['index'] = startIndex;
        // console.log(typeof (progress));
        if (typeof (progress) == 'function') {
            progress(res);
        }
        // console.log('上传进度', res.progress)
        // console.log('已经上传的数据长度', res.totalBytesSent)
        // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })

}
module.exports = { chooseImage, chooseVideo, upFilesFun, getPathArr, chooseImageCard}