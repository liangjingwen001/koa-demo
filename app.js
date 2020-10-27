const Koa = require('koa')
const Router = require('koa-router')
const db = require('./db/connection')
const koaBody = require('koa-body');
const path = require('path')
const render = require('koa-ejs')
const passport = require('koa-passport')
const app = new Koa()
const router = new Router()

// 处理post请求数据
app.use(koaBody());
// token、邮箱验证
app.use(passport.initialize())
app.use(passport.session())
// require('./tools/passport')(passport)

// 配置路由模块
app.use(router.routes()).use(router.allowedMethods())

// 引入模块
let users = require('./routes/users')

// 使用模块
router.use('/api/user', users)

// 配置ejs模板
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
})
router.get('/', async ctx => {
    await ctx.render('index', {
        title: 'hello'
    })
})

app.listen(3000, () => {
    console.log('server ok')
})