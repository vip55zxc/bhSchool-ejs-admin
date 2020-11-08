var express = require('express');
const request = require('./../utils/request');
var router = express.Router();
const gateway = 'http://localhost:7001';
/* 公告页面 */
router.get('/', async function(req, res, next) {
  const token = req.session.token;
  // 2.检测token是否合法或token是否过期
 const auth = await request(`${gateway}/api/user/access/current`,'GET',{}, {
    'Authorization': `Bearer ${token}`
  })
  if(auth.code != 0) {
    //res.send('您没有权限或令牌过期!')
    res.redirect('/login?error=您没有权限或令牌过期!')
  }
  
  // 3.获取公告列表
  const list = await request('http://localhost:7001/api/gg?isPaging=false','GET',{}, {
    'Authorization': `Bearer ${token}`
  })
  
  if(list.code === 0) {
    res.render('gg', { pageData: {
          token:token,
          title: '公告页 - 渤海学院小程序管理端',
          error: req.query.error,
          list: list.data.list
    }});
  }else res.redirect('/login?error=您没有权限或令牌过期!')

});

/**
 * 添加公告
 */
router.post('/create',async function(req,res,next) {
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

  // 拿着token,content跟服务器接口交换数据 //request(url,method,参数，headers)
  const createRes = await request(`http://localhost:7001/api/gg`,'POST', params, {
     'Authorization': `Bearer ${token}`
  })
  console.log('添加结果:', createRes )
  if(createRes===0){
    res.json({
      data: {
        code: 0,
        msg: '添加成功！'
      }
    })
  }else 

  res.json({
    data: {
      code: 1,
      msg: '添加失败！'
    }
  })
})


/**
 * 根据ID删除公告
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
 const delRes = await request(`http://localhost:7001/api/gg/${_id}`,'DELETE', {}, {
  'Authorization': `Bearer ${token}`
})

   console.log('删除结果:', delRes )

   res.redirect(`/gg`)
})

/**
 * 根据ID修改公告
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
  const updateRes = await request(`http://localhost:7001/api/gg/${params.id}`,'PUT', params, {
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
