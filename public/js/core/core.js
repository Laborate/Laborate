Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function createRange() {
  var start, end, step;
  var array = [];

  switch(arguments.length){
    case 0:
      throw new Error('range() expected at least 1 argument, got 0 - must be specified as [start,] stop[, step]');
      return array;
    case 1:
      start = 0;
      end = Math.floor(arguments[0]) - 1;
      step = 1;
      break;
    case 2:
    case 3:
    default:
      start = Math.floor(arguments[0]);
      end = Math.floor(arguments[1]) - 1;
      var s = arguments[2];
      if (typeof s === 'undefined'){
        s = 1;
      }
      step = Math.floor(s) || (function(){ throw new Error('range() step argument must not be zero'); })();
      break;
   }

  if (step > 0){
    for (var i = start; i <= end; i += step){
      array.push(i);
    }
  } else if (step < 0) {
    step = -step;
    if (start > end){
      for (var i = start; i > end + 1; i -= step){
        array.push(i);
      }
    }
  }
  return array;
}

$(document).ready(function() {
    //Prevent Rewriting Of Document
    setInterval(function() {
        $("body").attr("contenteditable", "false");
    }, 500);
});
