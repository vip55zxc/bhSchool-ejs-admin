const request = require('request')
// require('request').debug = true
const chalk = require('chalk')
const moment = require('moment')

Request = function (options) {
      this.uri = options.uri,
      this.method = options.method,
      this.form = options.formData || {},
      this.headers = options.headers || { 'Content-Type': 'application/x-www-form-urlencoded' }
}

Request.prototype.call = function (callback) {
  request(this, function (error, response, body) {
    if (body) {
      callback(error, body)
    } else {
      console.log(error || "There was a problem placing your request")
      callback(error)
    }
  })
}

function startApiCall (uri,method,formData,headers,callback) {
  // console.log("4MDataReceiver:" + JSON.stringify(formData))

  options = {
    uri: uri,
    method: method,
    formData: formData,
    headers: headers
  };

  var myRequest = new Request(options);

  myRequest.call(function(error, body) {
    //check the error and body here;
    //do the logic
    //you can also pass it through to the caller
    callback && callback(error, body)
  });

}

module.exports =  (uri, method, formData, headers) => {
  return new Promise((resolve, reject) => {
    startApiCall(uri, method, formData, headers, (error, body) => {
      const consequence = JSON.parse(body)
      // 如果请求服务端出现服务端错误，code = 500 则打印
      if (consequence.code === 500) {
        console.log(`${moment(new Date).format('YYYY-MM-DD hh:mm:ss')} ${chalk.red(`ERROR# ${uri}`)}`)
        console.log(`                    ${chalk.red(`Debug# ${consequence.msg}`)}`)        
      }else{
        console.log(`${moment(new Date).format('YYYY-MM-DD hh:mm:ss')} ${chalk.green(`Success# ${uri}`)}`)
      } 
      resolve(consequence)
    })
  })
}

