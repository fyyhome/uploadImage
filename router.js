let url = require('url')
let uploadImage = require('./src/uploadImage')

const router = (req, res) => {
  switch(url.parse(req.url).pathname) {
    case '/api/uploadImage':
      uploadImage(req, res)
      break;
    default:
      console.log('no matched')
  }
}

module.exports = router;