app.controller('pickerCtrl', function($timeout, $scope) {

//First time on this screen
var pickerFirst = window.localStorage.getItem('pickerfirst');
if(pickerFirst){
    
}else{
  window.localStorage.setItem('pickerfirst', 1);
  var screen = document.getElementsByClassName("first")[0];
  screen.classList.add("first--active");

  var btnFirst = document.getElementsByClassName("btnFirst")[0];
  btnFirst.addEventListener("click", function(){
    screen.classList.remove("first--active");
    screen.classList.add("first--out");
  });
}
//Cancel swipe during first time
$scope.cancelSwipe = function($event){
    $event.stopPropagation();     
}

var canvas = document.getElementById("canvas");
canvas.width = $('#canvas').width();
canvas.height = $('#canvas').height();


function getEventLocation(element,event){
    var x = event.pageX - $('#canvas').offset().left;
    var y = event.pageY - $('#canvas').offset().top;
    return {
        x: (x),
        y: (y)
    };
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function drawImageFromWebUrl(sourceurl){
      var img = new Image();

      img.addEventListener("load", function () {
          // The image can be drawn from any source
          canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

      });

      img.setAttribute("src", sourceurl);
}
// Draw a base64 image because this is a fiddle, and if we try with an image from URL we'll get tainted canvas error
// Read more about here : http://ourcodeworld.com/articles/read/182/the-canvas-has-been-tainted-by-cross-origin-data-and-tainted-canvases-may-not-be-exported

//Convert to base
function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

toDataURL('img/tag.jpg', function(dataUrl) {
    drawImageFromWebUrl(dataUrl);
})

canvas.addEventListener("click",function(e){
    var eventLocation = getEventLocation(this,e);
    var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
    
    // Get the data of the pixel according to the location generate by the getEventLocation function
    var context = this.getContext('2d');
    var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 16, 16).data; 

    // If transparency on the image
    if((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)){
                coord += " (Transparent color detected, cannot be converted to HEX)";
    }
    
    var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
    
    //Get RGB
    var rouge = Math.floor((pixelData[0]/255)*100);
    var vert = Math.floor((pixelData[1]/255)*100);
    var bleu = Math.floor((pixelData[2]/255)*100);

    // Find color name with ntc.js
    var n_match = ntc.name(hex);
    var n_name = n_match[1];
    // Change preview piker info in HTML
    document.getElementById("colorinfo_content").style.borderColor = hex;
    document.getElementsByClassName("pickerzone_preview")[0].style.borderColor = hex;
    document.getElementById("colorinfo_content--sample").style.backgroundColor = hex;
    document.getElementById("colorinfo_content--name").innerHTML = n_name;
    document.getElementById("colorinfo_content--sample").innerHTML = hex;
    document.getElementById("red").innerHTML = rouge;
    document.getElementById("green").innerHTML = vert;
    document.getElementById("blue").innerHTML = bleu;

    verifykHex();
},false);



    //Setup of the table
    function Color(hexa, nickname, name, red, green, blue){
        this.hexa = hexa;
        this.nickname = nickname;
        this.name = name;
        this.red = red;
        this.green = green;
        this.blue = blue; 
    }

    //Allow add btn only when color hexa is not duplicated
    function verifykHex(){ 
        var getHex = $("#colorinfo_content--sample").text();
        var start = $("#colorinfo_content--name").text();
        var btnAdd = $('#colorinfo_add');

        for (var i in colorData){
            var color = colorData[i];
            var hexa = color.hexa;
            
            if(getHex == hexa || start == "Prélève"){
                btnAdd.removeClass("colorinfo_add--actif");
            }else{
                btnAdd.addClass("colorinfo_add--actif");
            }
        }
    }
    verifykHex();

    function notif(){
        var color = colorData[colorData.length-1];
        var nickname = color.nickname;
        var name = color.name;
        var hexa = color.hexa;

        document.getElementById("notifadd_color").style.backgroundColor = hexa;
        document.getElementById("notifadd_name").innerHTML = name;
        document.getElementById("notifadd_color").innerHTML = hexa;
        
    }



    //Add a color
    function addColor(hexa, nickname, name, red, green, blue){
        var add = new Color(hexa, nickname, name, red, green, blue);
        colorData.push(add);
        saveColor();
        notif();
    }

    //Click to add color
    var btnAdd = document.getElementById('colorinfo_add');
    btnAdd.addEventListener('click', function(e){
        var getHex = $("#colorinfo_content--sample").text();
        var getName = $("#colorinfo_content--name").text();
        var getRed = $("#red").text();
        var getGreen = $("#green").text();
        var getBlue = $("#blue").text();
        addColor(getHex, getName, getName, getRed, getGreen, getBlue);

        verifykHex();
        $('#colorinfo_add').addClass("colorinfo_add--animeAdd");
        $('#notifadd').addClass("notifadd--animeAdd");
        $timeout(function() {
            $('#colorinfo_add').removeClass("colorinfo_add--animeAdd");
        }, 1000);
        $timeout(function() {
            $('#notifadd').removeClass("notifadd--animeAdd");
        }, 2100);

        preventWhite();

    }, false);

    //Prevent case if color picked is white
    function preventWhite(){
      var verify = $("#notifadd_name");
      var txt = verify.text();

      if(txt.indexOf('Blanc') >= 0){
        $("#notifadd_color").addClass("sampleinfo--white");
      }
    }

    //Save data to localstorage
    function saveColor(){
        var str = JSON.stringify(colorData);
        window.localStorage.setItem("colors", str);
    }


      


});
