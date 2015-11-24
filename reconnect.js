function noop () {}

/**
 * Keep a persistent connection to the AMQP channel by reconnecting
 * on error or close.
 * @param {String} id ID for this reconnect
 * @param {Function} getAmqpChannel Function to retrieve a connected and configured AMQP channel
 * do any setup work with the channel.
 * @param {Object} [options]
 * @param {Number} [options.retryTimeout] Timeout between reconnect retries
 * @param {Function} [cb] Callback called after initial successful connection
 * and setup.
 */
module.exports = function reconnect (id, getAmqpChannel, opts, cb) {
  if (!cb) {
    cb = opts
    opts = {}
  }

  cb = cb || noop

  getAmqpChannel(function (er, channel) {
    if (er) return setTimeout(function () {
      reconnect(id, getAmqpChannel, cb)
    }, 5000)

    var stopped = false

    function onError (er) {
      console.error(id, 'connection error', er, er.stack)
    }

    function onClose () {
      console.log(id, 'disconnected')

      if (stopped) return

      setTimeout(function () {
        reconnect(id, getAmqpChannel, function () {
          console.log(id, 'reconnected')
        })
      }, 1000)

      channel.connection.removeListener('error', onError)
      channel.connection.removeListener('close', onClose)
    }

    channel.connection.on('error', onError)
    channel.connection.on('close', onClose)

    cb(null, {
      id: id,
      // Stop reconnecting on close/error
      stop: function () {
        stopped = true
      }
    })
  })
}