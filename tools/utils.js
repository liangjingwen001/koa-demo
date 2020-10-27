const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const screat = 'qwerty'

// 加密方法
function encryption(val) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(val, salt);
    return hash
}

// 解密
function decrypt(beforeVal, afterValue) {
    return bcrypt.compareSync(beforeVal, afterValue)
}

// 生成token
function createToken(payload) {
    //过期时间60秒
    return jwt.sign(payload, screat, {expiresIn: 60})
}

// 验证token
function checkToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, screat, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

module.exports = {
    encryption,
    decrypt,
    createToken,
    checkToken
}