var request = require('request');


module.exports = function(topten, tags, callback){
    var increment = 0;
    for (var i = 0; i < topten.length; i++) {
      request({
              headers: {'ocp-apim-subscription-key': 'a4c7815f3c0f408b86991eb9c4e92fdb'},
              method: "POST",
              json: true,
              url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Tags",
              body: {"url": topten[i].url}
          }, response.bind(topten[i]));
    }

    function response(e, r, body){
      //console.log(r);
        this.tags = body.tags;
        if(body.tags){
            body.tags.forEach(function(tag){
                if (!tags.has(tag)){
                    tags.add(tag.name);
                }
            })
        }
        increment++;
        if (increment === topten.length) {
          callback();
        }
    }
};
