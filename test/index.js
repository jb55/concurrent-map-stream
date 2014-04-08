
var assert = require('better-assert')
var through = require('through');
var reduce = require('stream-reduce');
var queue = require('../');

var consume = reduce(function(items, val){
  items.push(val);
  return items;
}, []);

function worker(n, done) {
  setTimeout(function(){ done(null, n); }, n);
}

describe('concurrent-map-stream', function(){
  it('works', function(done){
    var stream = through()

    stream
    .pipe(queue(worker, 4))
    .pipe(consume)
    .pipe(through(function(items){
      assert(items[0] === 80);
      assert(items[1] === 50);
      assert(items[2] === 5);
      assert(items[3] === 2);
      assert(items[4] === 3);
      assert(items[5] === 25);
      assert(items[6] === 60);
      assert(items[7] === 15);
      done();
    }));

    [80, 50, 5, 2, 3, 25, 60, 15].forEach(function(n){
      stream.write(n);
    });

  });
});
