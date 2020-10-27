const Router = require('koa-router')
const router = new Router()
const utils = require('../tools/utils')

// 引入数据模型
const User = require('../db/model/users')

router.get('/test', async ctx => {
    // ctx.query拿到get请求传过来的参数
    ctx.status = 200
    ctx.body = {
        code: 200,
        msg: 'test'
    }
})

// 注册接口
router.post('/reg', async ctx => {
    let {name, password, email} = ctx.request.body
    const findResult = await User.find({name})
    if (findResult.length > 0) {
        ctx.status = 201
        ctx.body = {
            code: 200,
            msg: '用户名已注册！'
        }
    } else {
        // 第一种插入方式
        // await User.insertMany({name, password, email})
        // .then(res => {
        //     ctx.status = 200
        //     ctx.body = {
        //         code: 200,
        //         data: res,
        //         msg: '注册成功！'
        //     }
        // })
        // .catch(err => {
        //     ctx.status = 501
        //     ctx.body = {
        //         code: 200,
        //         data: err,
        //         msg: '注册失败！'
        //     }
        // })

        // 第二种插入方式
        const newUser = new User({name, password: utils.encryption(password), email})
        // 存入数据库
        await newUser.save()
        .then(res => {
            ctx.status = 200
            ctx.body = {
                code: 200,
                data: res,
                msg: '注册成功！'
            }
        })
        .catch(err => {
            ctx.status = 501
            ctx.body = {
                code: 200,
                data: err,
                msg: '注册失败！'
            }
        })
    }
})

// 登录接口
router.post('/login', async ctx => {
    let {name, password} = ctx.request.body
    let findResult = await User.find({name})
    if (findResult.length === 0) {
        ctx.status = 402
        ctx.body = {msg: '用户不存在！'}
    } else {
        // 解密password
        let result = utils.decrypt(password, findResult[0].password)
        if (result) {
            let payload = {id: findResult[0].id, name: findResult[0].name}
            let token = utils.createToken(payload) 
            ctx.status = 200
            ctx.body = {code: 200, token: token, msg: '登录成功！'}
        } else {
            ctx.status = 403
            ctx.body = {msg: '密码错误！'}
        }
    }
})

// 获取用户信息
router.post('/current', ctx => {
    let {token} = ctx.request.body
    utils.checkToken(token)
    .then(res => {
        ctx.body = {code: 200, data: res, msg: 'token验证成功！'}
    })
    .catch(err => {
        ctx.body = {code: 401, msg: err.message}
    })
})

module.exports = router.routes()