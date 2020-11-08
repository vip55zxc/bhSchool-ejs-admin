var express = require('express');
const request = require('./../utils/request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { pageData: {
      title: 'wxAdmin - 渤海学院小程序管理端',
      error: req.query.error
  }});
});


/*登入功能*/
router.post('/access/login', async function(req, res, next) {
    console.log('前端传来的用户名，密码', req.body) // post form:req.body  Get: ?id=wwww&psss=asdsd   req.query
    // todo  wx.request => server => [token]
    // 1.组装参数
    const params = req.body || {}
    // 2.与服务端进行交互,做登录验证
    const loginResult = await request('http://localhost:7001/api/user/access/login','POST', params)
    // console.log(loginResult)
    if(loginResult.code === 0) {
    // 登入成功，跳转公告管理页
    // 把token存在当前框架中
    req.session.token = loginResult.data.token
    //重定向
    res.redirect(`/gg`)
    } else {
    // 清除当前    
        res.redirect('/login?error=用户名或密码')
        req.session.token = null
    }

    if(req.session){
        flag = true
    }else{
        flag = false
    }

})


module.exports = router;
