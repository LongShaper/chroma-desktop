//Directive to now if ng-repeat have finished to load
app.directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit(attr.onFinishRender);
        });
      }
    }
  }
});

app.controller('colorsCtrl', function($timeout, $scope, $rootScope, $compile){

  //First time on this screen
  var colorFirst = window.localStorage.getItem('colorfirst');
  if(colorFirst){
      
  }else{
    window.localStorage.setItem('colorfirst', 1);
    var screen = document.getElementsByClassName("first")[0];
    screen.classList.add("first--active");

    var btnFirst = document.getElementsByClassName("btnFirst")[0];
    btnFirst.addEventListener("click", function(){
      screen.classList.remove("first--active");
      screen.classList.add("first--out");
    });
  }
  //cancel swipe during first time
  $scope.cancelSwipe = function($event){
      $event.stopPropagation();     
  }
  //ng-repeat: colorData Json to display on HTML
  $scope.colorData = colorData;

  //Listen if ng-repeat have finished to load
  $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
 
  //Setup of the table
  function Color(hexa, nickname, name, red, green, blue){
    this.hexa = hexa;
    this.nickname = nickname;
    this.name = name;
    this.red = red;
    this.green = green;
    this.blue = blue; 
  }

  //Add a color
  function addColor(hexa, nickname, name, red, green, blue){
    var add = new Color(hexa, nickname, name, red, green, blue);
    colorData.push(add);
    saveColor();
  }

  //Remove a color
  function removeColor(index){
    colorData.splice(index, 1);
    saveColor();
  }

  //Get a color
  function getColorAtIndex(index){
    return colorData[index];
  }

  //Save data to localstorage
  function saveColor(){
    var str = JSON.stringify(colorData);
    window.localStorage.setItem("colors", str);
  }


  //Count number of color--el opened
  var nbOpen = 0;

  //Hammer interactions
  $('.listcolors_el').each(function(){
    var $this = $(this);

    //Add or Delete Anime for actions buttons
    var addAnime = function(){
     $this.find(".listcolors_el--actions").addClass("listcolors_el--anime");
    }    
    var deleteAnime = function(){
     $this.find(".listcolors_el--actions").removeClass("listcolors_el--anime");
    }   
    var deleteAllAnime = function(){
     $(".listcolors_el--actions").removeClass("listcolors_el--anime");
    }    

    //Add or Delete Anime for load buttons
    var addLoad = function(){
     $this.find(".listactions").addClass("listactions--active");
    }    
    var deleteLoad = function(){
     $this.find(".listactions").removeClass("listactions--active");
    }
    var deleteAllLoad = function(){
     $this.find(".listactions").removeClass("listactions--active");
    }

    //Add or remove Transition timing
    var addTransition = function(){
     $this.find(".listcolors_el--color").addClass("transition");
    }
    var deleteTransition = function(){
     $this.find(".listcolors_el--color").removeClass("transition");
    }
    var deleteAllTransition = function(){
     $(".listcolors_el--color").removeClass("transition");
    }

    //Mode active when color_sample is full PANRIGHT 
    var addActive = function(){
     $this.find(".listcolors_el--color_sample").addClass("listcolors_el--color_sample--active");
    }
    var deleteActive = function(){
     $this.find(".listcolors_el--color_sample").removeClass("listcolors_el--color_sample--active");
    }    
    var deleteAllActive = function(){
     $(".listcolors_el--color_sample").removeClass("listcolors_el--color_sample--active");
    }        

    //Show popup on TAP WHEN el--color is closed
    var showPopup = function(){
       $(".colorpopup").addClass("colorpopup--actif");
       $(".screen--colors").append("<span class='close'></span>");
    }
    var notshowPopup = function(){
       $(".colorpopup").removeClass("colorpopup--actif");
       $(".screen--colors").children("span").remove();
    }

    // Init hammer
    var hammer = new Hammer(this);

    //Child element of $this
    var el = $this.find(".listcolors_el--color");
    var elAll = $(".listcolors_el--color");
    var list = $(".listcolors");

    var Open = 0;

    //All Range for Panmove to delect
    var screenWidth = $(".ngIncludeItem").width();
    var maxRange = screenWidth-68;
    var minRange = 68;




    //Pan panright events
    hammer.on('panright', function(e){
       deleteTransition();
       //Stop e.deltaX when going out of rang
       if(e.deltaX <= 0){
           e.deltaX = 0;
       }

       //Stop e.deltaX when going out of rang
       if(e.deltaX >= minRange){
          addLoad();
          el.css({'-webkit-transform' : 'translate3d(' + maxRange +'px, 0,0)'});
       }
       if(e.deltaX >= maxRange){
          el.css({'-webkit-transform' : 'translate3d(' + maxRange +'px, 0,0)'});
       }else{
          el.css({'-webkit-transform' : 'translate3d(' + e.deltaX +'px, 0,0)'});

       }
       //if there is more than 1 color--el opened, close it before open new one
       if(nbOpen >= 1){
           nbOpen = 0;
           deleteAllActive();
           deleteAllAnime();
           $(".listcolors_el--color").css({'-webkit-transform' : 'translate3d(0,0,0)'});                
       }
    });


    //Panend events
    hammer.on('panend', function(e){
      if(e.deltaX < minRange){
        addTransition();
        el.css({'-webkit-transform' : 'translate3d(0, 0,0)'});
      }else{
        if(e.deltaX >= minRange){       
          e.deltaX = maxRange;
          addTransition();
          addActive();
          addAnime();
          deleteLoad();
          el.css({'-webkit-transform' : 'translate3d(' + e.deltaX +'px, 0,0)'});
        }
      }

      if(e.deltaX >= minRange){
        //Count that there is a color--el opened
        nbOpen++;
        // When el--color is full deploid, allow users to tap to close
        el.hammer().on('tap', function(e){
          el.css({"-webkit-transform":"translate3d(0,0,0)"});
          deleteActive();
          deleteAnime();
          deleteLoad();

        });
      }
      $scope.close = function(){
          el.css({"-webkit-transform":"translate3d(0,0,0)"});
          deleteActive();
          deleteAnime();
          deleteLoad();
      }
      //Disable Parent swipe and allow swipe to children only if 1 child is open
      $scope.cancelSwipe = function($event){
          if(nbOpen >= 1){

            elAll.css({"-webkit-transform":"translate3d(0,0,0)"});
            deleteAllActive();
            deleteAllAnime();
            deleteAllLoad();

            nbOpen = 0;
            $event.stopPropagation();
          }
          
      }
    });

    //Prevent case if color picked is white
    $('.listcolors_el').each(function(){
      var $this = $(this);
      var verify = $this.find(".listcolors_el--color_name");
      var txt = verify.text();

      if(txt.indexOf('Blanc') >= 0){
        $this.find(".listcolors_el--color_sample").addClass("sample--white");
        $this.find(".listactions_el--info").addClass("icon--white");
        $this.find(".colorsample").addClass("sampleinfo--white");
      }
    });


  });//End $('.listcolors_el').each(function(){});



  });// End $scope.$on('ngRepeatFinished'
});
