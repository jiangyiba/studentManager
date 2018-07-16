//引入模板
let express = require('express');
let svgCaptcha = require('svg-captcha');
let path = require('path');

let app = express();
//设置静态资源托管
app.use(express.static('static'));
//设置路由1 访问登入页面直接读取返回页面
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'static/views/login.html'));
})
//路由2 生成图片验证码
app.get('/login/captchaImg',(req,res)=>{
    var captcha = svgCaptcha.create();
    // req.session.captcha = captcha.text;
    
    res.type('svg');
    res.status(200).send(captcha.data);
})

//开启
app.listen(8848,'127.0.0.1',()=>{
    console.log('开启');
})