let http = require('http')
let router = require('./router')

const start = () => {
  http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Access-Control-Allow-Origin', '*')
    router(req, res)
  }).listen(8089)
}

module.exports = start