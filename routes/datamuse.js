var router = require('express').Router();
var request = require('request');


module.exports.search = function (word, res){
  /*	/words?rel_trg=  */
  var result = request('https://api.datamuse.com/words?rel_trg=' + word, function(e, r, b) {
    res.send(filter(JSON.parse(b)));
  });

}

// change the # to another thing if you want more searches
function filter(obj) {
  var top20 = [];

  //console.log(obj);
  for (var i = 0; i < obj.length; i++) {
    for (var key in obj[i]) {
      if (key == 'score') {
        continue;
      }
      top20.push(obj[i][key]);
      if (top20.length >= 20) {
        return top20;
      }
    }
  }
  return top20;
}

module.exports.compare = function(word1, word2, res) {
  var result1 = request('https://api.datamuse.com/words?ml=' + word1, function(e1, r1, b1) {
    var result2 = request('https://api.datamuse.com/words?ml=' + word2, function(e2, r2, b2) {
      var parse1 = {};
      var parse2 = {};
      json1 = JSON.parse(b1);
      json2 = JSON.parse(b2);
      for (var i = 0; i < json1.length; i++) {
        parse1[json1[i]['word']] = json1[i]['score'];
      }
      for (var i = 0; i < json2.length; i++) {
        parse2[json2[i]['word']] = json2[i]['score'];
      }
      //console.log(parse1);
      //console.log(parse2);

      var status = {};

      if (parse1.hasOwnProperty(word2) || parse2.hasOwnProperty(word1)){
        status['related'] = true;
        var a = 0;
        var b = 0;
        if (parse1[word2] != null) {
          a = parse1[word2];
        }
        if (parse2[word1] != null) {
          b = parse2[word1];
        }
        status['score'] = Math.max(a, b);
      }
      else {
        status['related'] = false;
        status['score'] = 0;
      }
      res.send(status);
    });
  });
}
