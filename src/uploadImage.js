let fs = require('fs')

const uploadImage = (req, res) => {
  let chunks = []
  let totalBuffer,indexArray = []
  let totalSize = 0
  req.on('data', (chunk) => {
    chunks.push(chunk)
    totalSize += chunk.length
  })
  req.on('end', () => {
    totalBuffer = Buffer.concat(chunks, totalSize)
    for(let i = 0; i < totalBuffer.length; i++) {
      // the ascii value, 13 is '\r', 10 is '\n'
      if(totalBuffer[i] === 13 && totalBuffer[i+1] === 10) {
        indexArray.push(i+2) // next line begin pos
      }
    }
    let messageLine = totalBuffer.slice(indexArray[0], indexArray[1]).toString()
    if (!messageLine.match(/filename="(.*)"/)) {
      res.writeHead(200)
      res.end(JSON.stringify({
        status: 1,
        message: '上传失败',
        data: {
          reason: '字段错误!'
        }
      }))
      return;
    }
    let filename = messageLine.match(/filename="(.*)"/)[1]
    let newName = generateFileName('bbs', filename);
    let filebegin;
    for(let index = 0; index < indexArray.length; index++) {
      let str = totalBuffer.slice(indexArray[index], indexArray[index+1]).toString()
      if (str.length === 2 && str.includes('\r\n')) {
        filebegin = index + 1
        break
      }
    }
    let filedata = totalBuffer.slice(indexArray[filebegin], indexArray[indexArray.length - 2])
    writeFile(newName, filedata)
    res.writeHead(200)
    res.end(JSON.stringify({
      status: 0,
      message: '上传成功',
      data: {
        url: `http://127.0.0.1:8082/images/${newName}`
      }
    }))
  })
}

const generateFileName = (prefix, originName) => {
  let wrap = originName.split('.')
  let type = '.' + wrap.pop()
  let newName = prefix + wrap.join('')
  newName += Date.now()
  newName += type
  return newName
}

const writeFile = (filename, data) => {
  fs.writeFileSync(`/home/fyy/fyy/collogeStudy/nginx-file/images/${filename}`, data, (err) => {
    if (err) {
      throw err
    } else {
      return true
    }
  })
}

module.exports = uploadImage