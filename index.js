var createGetChannel = require('./channel')
var createGetConfirmChannel = require('./confirm-channel')
var reconnect = require('./reconnect')

var apiCache = {}

module.exports = function (url) {
  apiCache[url] = apiCache[url] || createApi(url)
  return apiCache[url]
}

function createApi (url) {
  return {
    getChannel: createGetChannel(url),
    getConfirmChannel: createGetConfirmChannel(url),
    reconnect: reconnect
  }
}

module.exports.reconnect = reconnect
