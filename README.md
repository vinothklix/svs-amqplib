# svs-amqplib

Utilities for working with the [amqplib](https://www.npmjs.org/package/amqplib).

## Example

```js
var amqp = require('svs-amqplib')(config.url)

/**
 * Create a new amqp connection and create a new channel
 * Subsequent calls to amqp.getChannel will return the same channel
 * (No new connection, unless connection is disconnected)
 */
amqp.getChannel(function (er, chan) {
  // `chan` is a amqplib channel
})

/**
 * Create a new amqp connection and create a new _confirm_ channel
 * Subsequent calls to amqp.getConfirmChannel will return the same channel
 * (No new connection, unless connection is disconnected)
 */
amqp.getConfirmChannel(function (er, chan) {
  // `chan` is an amqplib confirm channel
})

/**
 * Ensure a persistent connection to the amqp server
 * setupChannel called initially and on every disconnect
 * setupChannel should connect, setup and return a channel
 * customise timeout between re-connection retries
 */
amqp.reconnect('ID', setupChannel, {retryTimeout: 5000}, function (er, rc) {
  console.log('Connected')
  // In the future you can call rc.stop() to stop trying to reconnect
})

function setupChannel (cb) {
  amqp.getChannel(function (er, chan) {
    chan.assertQueue('queue', {}, function (er) {
      chan.bindQueue('queue', 'exchange', 'route', {}, function (er) {
        chan.consume('queue', onMessage, {}, function (er) {
          cb(null, chan) // Ready!
        })
        function onMessage () { /* Eat some messages! */ }
      })
    })
  })
}
```