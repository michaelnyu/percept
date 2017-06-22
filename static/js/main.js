var taglist = [];

/*
  styles {
  width: 100%; height: 100%; position: absolute; z-index: 2; background-color: rgba(0,0,0,0.7);
}
*/

function fetchData(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if (xhttp.status == 200 && xhttp.readyState == 4){
      var mountPoint = document.getElementById('mountPoint');
      mountPoint.innerHTML = ""; //empties result list

      var imgSrcArr = JSON.parse(xhttp.response);
      //console.log(imgSrcArr.tags);
      for ( var key in imgSrcArr.images) {
        var newimgcontainer = document.createElement('div');
        var newimg = document.createElement('img');
        newimg.src = imgSrcArr.images[key].url
        newimgcontainer.setAttribute('tags', tagData(imgSrcArr.images[key].tags));
        newimgcontainer.style.display = 'inline-block';
        newimgcontainer.style.position = 'relative';
        newimgcontainer.style.margin = '20px';
        newimgcontainer.className = 'img-container';
        newimgcontainer.style.overflow = 'hidden';
        //console.log("tags : " + imgSrcArr.images[key].tags);
        newimgcontainer.appendChild(newimg);
        mountPoint.appendChild(newimgcontainer);

        var newdiv = document.createElement('div');
        height = $(newimgcontainer).height();
        console.log(height);
        newdiv.style.height = 'height';
        $('newdiv').css({
          'background-color' : 'gray',
          'z-index' : '2',
          'width' : '100%',
          'display' : 'none',
          'position' : 'absolute',
          'top' : '0',
          'transition' : '.5s ease'
        });
        newimgcontainer.appendChild(newdiv);
        $(".img-container").hover(function(){
          newdiv.style.display = 'block';
        },function(){
          newdiv.style.display = 'none';
        });

      }
      document.getElementById("pills").innerHTML = "";
      for (var tag in imgSrcArr.tags){
          var pill = document.createElement('li');
          var link = document.createElement('a');
          link.innerHTML = imgSrcArr.tags[tag];
          pill.appendChild(link);
          pill.addEventListener("click", handlePillClick.bind(pill));
          document.getElementById("pills").appendChild(pill);
      }
    }
  };


  var latParam = document.getElementsByName('lat')[0].value;
  var lonParam = document.getElementsByName('lon')[0].value;
  var radParam = document.getElementsByName('radius')[0].value;
  var tagsParam = document.getElementsByName('tags')[0].value;
  xhttp.open("GET", "/feed?" + "lat=" + latParam + "&lon=" + lonParam + "&radius=" + radParam + "&tags=" + tagsParam);
  xhttp.send();
}






function tagData(arr){
  var returnString = "";
  for ( i in arr ){
    returnString += arr[i].name + '-';
  }
  //console.log(returnString);
  return returnString;
}


function toggleClass(clickedItem, targetCategory){
  clickedItem.classList.toggle('active');
  if(clickedItem.classList[0] == 'active'){
    taglist.push(targetCategory);
  } else {
    var index = taglist.indexOf(targetCategory);
    taglist.splice(index, 1);
  }
}

// param 1 is for filtering normally and 0 is for showing all
function filter(){
  var images = document.getElementsByClassName('img-container');
  for ( var i = 0; i < images.length; i++ ) {
    images[i].style.display = "none";
    if ( taglist.length == 0 ) {
      images[i].style.display = "inline-block";
    } else {
      for ( var y in taglist) {
        if ( (images[i].getAttribute('tags').includes(taglist[y] + '-')) ) {
          images[i].style.display = "inline-block";
        }
      }
    }
  }
}


function handlePillClick(e){
    var targetCategory = e.target.innerHTML;
    var clickedItem = this;
    //toggle active for class of clickedItem and push to taglist
    toggleClass(clickedItem, targetCategory);
    filter();
}


window.onload =
  function(){
    document.getElementById('search').addEventListener('click',
      function(){
        fetchData();
      });
  };




