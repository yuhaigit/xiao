/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://test.liupinshuyuan.com';
var dates = new Date();
var getMonth = dates.getMonth() + 1;
var systemdate = dates.getFullYear() + "-" + getMonth + "-" + dates.getDate();
var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
      token:"liupinsy",
      systemdate,
        // 上传图片 上传视频
      upFiles: host+`/index.php?app=dakaprogram&mod=Fileimage&act=filePost`,
    }
};

module.exports = config;
