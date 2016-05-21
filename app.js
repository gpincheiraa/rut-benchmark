var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

// add tests
function classical_rut(_value){
  if(typeof _value !== 'string') return false;
  var t = parseInt(_value.slice(0,-1), 10), m = 0, s = 1;
  while(t > 0) {
    s = (s + t%10 * (9 - m++%6)) % 11;
    t = Math.floor(t / 10);
  }
  var v = (s > 0) ? (s-1)+'' : 'K';
  return (v === _value.slice(-1));
}

function cleanFormat(rut){
  return rut.match(/[0-9Kk]+/g).join('');
}

function verifyFormat(rut){
  return (typeof rut === 'string') && (/^(\d{7,8}\-(\d|k))$|^(\d{1,2}\.\d{3}\.\d{3}\-(\d|k){1})$|^(\d{8,9})$/i).test(rut);
}

function myRutValidate(rut){
  rut = rut.trim();
  
  if(!verifyFormat(rut)) return false;
  
  rut = cleanFormat(rut);

  var f = 2,
      s = 0,
      l = rut.length - 1,
      d = rut.slice(-1).toLowerCase(),
      dc;
   
  while(l--){
    s += +rut[l]*f;
    f = f === 7 ? 2
                : ++f;
  }
  dc = 11 - (s % 11);
  dc =  dc === 11 ? 0
                  : ( dc === 10? 'k' : dc);
  return (''+dc) === d;
}

suite
  .add('My Rut validator', function() {
    myRutValidate('162992228');
  })
  .add('Classical', function() {
    classical_rut('162992228');
  })
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));

  })
  // run async
  .run({ 'async': true });
