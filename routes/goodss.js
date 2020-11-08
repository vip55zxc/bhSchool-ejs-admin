var express = require('express');
const request = require('./../utils/request');
var router = express.Router();
const gateway = 'http://localhost:7001';
/* 商品详情页面 */
router.get('/', async function(req, res, next) {
  //拿到分类名称和id
  categoryName = req.query.categoryName;
  //拿到token
  const token = req.session.token;
  // console.log(`从URL里拿到的token: ${token}`)
  // console.log(`session token: ${req.session.token}`)

  // 2.检测token是否合法或token是否过期
 const auth = await request(`${gateway}/api/user/access/current`,'GET',{}, {
    'Authorization': `Bearer ${token}`
  })
  if(auth.code != 0) {
    //res.send('您没有权限或令牌过期!')
    res.redirect('/login?error=您没有权限或令牌过期!')
  }
  
  // 3.获取该商店下的商品
  const list = await request('http://127.0.0.1:7001/api/goods/?isPaging=false','GET',{}, {
    'Authorization': `Bearer ${token}`
  })
  if(list.code === 0) {
    res.render('goodss', { pageData: {
          title: '商品管理页 - 渤海学院小程序管理端',
          name: '全部商品',
          error: req.query.error,
          list: list.data.list
    }});
  }else res.redirect('/login?error=您没有权限或令牌过期!')

});


/**
 * 根据ID删除商品
 */
router.get('/del', async  function(req, res, next) {
  const _id = req.query.id
  const params = {}
  if(_id) {
    params.id = _id
  }
  const token = req.session.token
  // 2.检测token是否合法或token是否过期
 const auth = await request(`${gateway}/api/user/access/current`,'GET',{}, {
  'Authorization': `Bearer ${token}`
})
if(auth.code != 0) {
  //res.send('您没有权限或令牌过期!')
  res.redirect('/login?error=您没有权限或令牌过期!')
}

 // 拿着token,id跟服务器接口交互删除
 const delRes = await request(`http://localhost:7001/api/goods/${_id}`,'DELETE', {}, {
  'Authorization': `Bearer ${token}`
})

   console.log('删除结果:', delRes )

   res.redirect(`/goodss`)
})

/**
 * 根据ID修改商品
 */
router.post('/update',async function(req,res,next) {
  //拿到页面传的id和content
  const params = req.body
  console.log("params",params)
  const token = req.session.token;
    // 2.检测token是否合法或token是否过期
 const auth = await request(`${gateway}/api/user/access/current`,'GET',{}, {
  'Authorization': `Bearer ${token}`
})
if(auth.code != 0) {
  //res.send('您没有权限或令牌过期!')
  res.redirect('/login?error=您没有权限或令牌过期!')
}

  // 拿着token,id,content跟服务器接口交换数据 //request(url,method,参数，headers)
  const updateRes = await request(`http://localhost:7001/api/goods/${params.id}`,'PUT', params, {
     'Authorization': `Bearer ${token}`
  })

  //todo if(updateRes.code)

  console.log('修改结果:', updateRes )

  if(updateRes===0){
    res.json({
      data: {
        code: 0,
        msg: '修改成功！'
      }
    })
  }else 

  res.json({
    data: {
      code: 1,
      msg: '修改失败！'
    }
  })
})


module.exports = router;
