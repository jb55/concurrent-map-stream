
var SimpleQueue = require('SimpleQueue');
var through = require('through');

var nop = function nop(){};

module.exports = function(worker, concurrency) {
  var queue = new SimpleQueue(worker, processed, end, concurrency);
  var stream = through(write);

  function write(datum) {
    queue.push(datum);
  }

  function end() {
    stream.queue(null);
  }

  function processed(err, result) {
    if (err != null) stream.emit('error', err);
    stream.queue(result);
  }

  return stream;
}
