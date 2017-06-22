var request = require('request');

module.exports.autocomplete = function(req, res){
    request.get(req.body.url, function(e, r, body){
        res.json(body);
    })
}

module.exports.getlocation = function(req,res){
    request.get(req.body.url, function(e, r, body){
        res.json(body);
    });
}
