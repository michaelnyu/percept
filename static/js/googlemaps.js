//var googleAPIKey = 'AIzaSyBwKBKyAShWReGhQTtNbiiCmfQ5wPSgg_8';
var googleAPIKey = 'AIzaSyCl5jHA0l1jcGZVnR39Dt6Y0eovgRTXLfY';
// var googleAPIKey = 'AIzaSyACXU2N3NjrEYu2zhU7vsL-g7sd5-WYICU';
// var googleAPIKey = 'AIzaSyAf6RxPv0Hh1nCCCTA3ik8gGALwEY9f1-Q';


$("#inputlocation").on('input', function(){
  console.log('test');
  var str = $(this)[0].value;
  var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='
  + str + '&key=' + googleAPIKey;
  var list = [];
  $.post("/autocomplete",{url: url}, function(data) {

    data = JSON.parse(data);
    //console.log(typeof(data));
    //console.log(data.predictions);
    for (var i = 0; i < data.predictions.length; i++) {
      list.push(data.predictions[i]['description']);
    }
    $("#locationAutofill").empty();
    for (var i = 0; i < list.length; i++) {
      $("#locationAutofill").append('<li><a class="inputText" id="addedLocation" href="#">'+ list[i] + '</a></li>');
    }
    $("a").click(function(){
      var str = $(this)[0].innerHTML;
      $("#locationAutofill").empty();
      $('#inputlocation')[0].value = str;
      var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='
      + str + '&key=' + googleAPIKey;
      $.post('/getlocation',{url: url}, function(data) {
        data = JSON.parse(data);
        $("#lat")[0].value = data.results[0].geometry.location.lat;
        $("#lon")[0].value = data.results[0].geometry.location.lng;
      });
           $("#locationAutofill").empty();
    });
  });
});
