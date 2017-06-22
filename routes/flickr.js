var router = require('express').Router();
var Flickr = require("flickrapi"),
// flickrOptions = {
//     api_key: "9111068fce2142966353d1ee3177a77d",
//     secret: "776ab24b2fa7cd68"
// };
flickrOptions = {
    api_key: "ccab854fc82c1ef10369fbd9c56e5f0b",
    secret: "6c16af8f08f282a1"
};

// api_key: fcb96a20a97bb7c19a48ec27bbaf1dec
// secret: 98ca2f1f07546a81
var PriorityQueue = require("js-priority-queue");
var request = require('request');
var datamuse = require('./datamuse')
var msft = require('./microsoft')

function removeDuplicateOwners(photos){
    var owners = new Set();
    var clean = [];
    photos.forEach(function(photo){
        if(owners.has(photo.owner)){
            return;
        }
        clean.push(photo);
        owners.add(photo.owner);
    })
    return clean;
}
function compare(a, b){
    if(a.views > b.views){
        return -1;
    }
    else{
        return 1;
    }
    return 0
}


router.use(function(req, res, next){
  //console.log('req: ' + req.url);
  next();

});

router.get('/search', function(req, res) {
  var similar = datamuse.search(req.query.term, res);
});

router.get('/compare', function(req, res) {
  var diff = datamuse.compare(req.query.term1, req.query.term2, res);
});

router.get('*', function(req,res){
    if(!req.query.lat){
      req.query.lat = 34.0689;
    }
    if(!req.query.lon){
      req.query.lon = -118.4452;
    }
    if(!req.query.radius){
      req.query.radius = 2;
    }
    if(!req.query.tags) {
      req.query.tags = "";
    }
    //console.log('Req came in for pics at lat: ', req.query.lat, ' long: ', req.query.lon );
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
      // we can now use "flickr" as our API object
      flickr.photos.search({
          api_key: flickrOptions['api_key'],
          lat: req.query.lat,
          lon: req.query.lon,
          radius: req.query.radius,
          page: 1,
          per_page: 10000,
          tags: req.query.tags,
          extras: "views"
      }, function(err, result) {
          if(err) { throw new Error(err); }
          // do something with result
          var photos = [];
          result.photos.photo.forEach(function(element){
              //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
              var url = "https://farm"+element.farm+".staticflickr.com/"+element.server+"/"+element.id+"_"+element.secret+".jpg";
              photos.push({"url": url, "views": parseInt(element.views), "owner": element.owner});
          })

          photos.sort(compare);

          //photos = removeDuplicateOwners(photos);
          photos = photos.splice(0,15);
          var topten = photos;
          var tags = new Set();
          msft(topten, tags, function(){
            //console.log(topten);
            res.send({images: topten, tags: Array.from(tags)});
          });
      });
    });
});

module.exports = router;
