//引入模板
let express = require('express');
let svgCaptcha = require('svg-captcha');
let path = require('path');
let session = require('express-session');
let bodyParser = require('body-parser');

let myT = require(path.join(__dirname,'./tools/myT.js'));
let app = express();
//设置静态资源托管
app.use(express.static('static'));

//把生成的验证码值存起来
app.use(session({
    secret: 'keyboard cat nihao a hahahaha dabudaowoba hahahahazhuabudao wo ba',
}))
// 使用 bodyParser 中间件
app.use(bodyParser.urlencoded({
    extended: false
}))




//设置路由1 访问登入页面直接读取返回页面
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'static/views/login.html'));
})
//登入判断
app.post('/login',(req,res)=>{
    //接收传递过来的值
    let userName = req.body.userName;
    let password = req.body.password;
    let code = req.body.code;
    //判断验证码
    //正确-验证账号密码
    if(code == req.session.captcha) {
        console.log('进来了');
        req.session.userInfo = {
            userName,
            password
        }
        //跳转到主页
        res.redirect('/index');
    }else{
        //错误--回退并提示验证码错误
        console.log('错了');
        res.setHeader('content-type', 'text/html');
        res.send('<script>alert("验证码失败");window.location.href="/login"</script>');

    }
})

//路由2 生成图片验证码
app.get('/login/captchaImg',(req,res)=>{
    var captcha = svgCaptcha.create();
    //把验证码存起来
    req.session.captcha = captcha.text.toLocaleLowerCase();
    // console.log(captcha.text);
    res.type('svg');
    res.status(200).send(captcha.data);
})

//进入主页判断是否有字段
app.get('/index',(req,res)=>{
    if(req.session.userInfo){
        res.sendFile(path.join(__dirname,'static/views/index.html'));
    }else{
        //打回去
        res.setHeader('content-type', 'text/html');
        res.send('<script>alert("请登入");window.location.href="/login"</script>');
    }
})

//登出操作
app.get('/logout',(req,res)=>{
    //删除userInfo
    delete req.session.userInfo;
    res.redirect('/login');
})
//注册
app.get('/register',(req,res)=>{
    //直接读取展示文件
    res.sendFile(path.join(__dirname,'static/views/register.html'));
})
app.post('/register',(req,res)=>{
    // 接收数据
    let username = req.body.username;
    let password = req.body.password;
    //判断有没有值
    myT.find('accountInfo',{username},(err,docs)=>{
        console.log(docs);
        // console.log(docs);

        if(docs.length != 0){
            myT.mess(res,'已被注册,请重新注册','/register');
        }else{
            myT.insert('accountInfo',{username,password},(err,result)=>{
                myT.mess(res,'注册成功','/login');
            })
        }
    })
})

//开启
app.listen(8848,'127.0.0.1',()=>{
    console.log('开启');
})