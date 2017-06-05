//Directive to now if ng-repeat have finished to load
app.directive('onFinishRenderFilter', function ($timeou) {
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


//Get hexa
function getHexAtIndex(index){
    return colorData[index].hexa;
}
//Get hexa
function getNameAtIndex(index){
    return colorData[index].nickname;
}
//AddFilter function
function addFilter(index){

    var btnFilter = document.getElementsByClassName('btnpopup')[0];
    var popupFilter = document.getElementsByClassName('popupfilter')[0];
    var colorName = document.getElementById("colorfilter_content--name");
    var colorBorder = document.getElementById("colorfilter_content");
    var addFilter = document.getElementsByClassName("blend_more")[0];

    var listAllEl = $('.filtercolors_el');
    var hexa = getHexAtIndex(index-1);
    var nickname = getNameAtIndex(index-1);
    colorBorder.style.borderColor = hexa;
    colorName.innerHTML = nickname;
    addFilter.innerHTML = hexa;
    addFilter.style.backgroundColor = hexa;
    
    listAllEl.removeClass("filtercolors_el--active");
    btnFilter.classList.remove("btnpopup--active");
    popupFilter.classList.remove("popupfilter--active");

}

//Verify in colorData if the filter is already selected
function verifyFilter(){ 
    var getFilterHex = $(".blend_more").text();
    var start = $("#colorinfo_content--name").text();
    var btnAdd = $('#colorinfo_add');
    var listEl = document.getElementsByClassName('filtercolors_el');
    for (var i in colorData){
        var color = colorData[i];
        var hexa = color.hexa;

        if(getFilterHex == hexa){
            listEl[i].classList.add("filtercolors_el--active");
    
        }
    }
}

//Setup of the table
function Color(hexa, nickname, name, red, green, blue){
    this.hexa = hexa;
    this.nickname = nickname;
    this.name = name;
    this.red = red;
    this.green = green;
    this.blue = blue; 
}

app.controller('filterCtrl', function($timeout, $scope, hexaIndex) {

  //First time on this screen
  var filterFirst = window.localStorage.getItem('filterfirst');
  if(filterFirst){
      
  }else{
    window.localStorage.setItem('filterfirst', 1);
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

  //ng-repeatto get json data
  $scope.colorData = colorData;


  //Listen if ng-repeat have finished to load
  $scope.$on('ngRepeatFinishedFilter', function(ngRepeatFinishedEvent) {


    var btnFilter = $('.btnpopup');
    var popupFilter = $('.popupfilter');
    btnFilter.on("click", function(e){
        btnFilter.toggleClass("btnpopup--active");
        popupFilter.toggleClass("popupfilter--active");

        verifyFilter(); 
    });

  });

  //Get hexa from colors.html passing by actionsCtrl.js
    if(hexaIndex.getIndex() != null && hexaIndex.getIndex() != -1){
      var index = hexaIndex.getIndex();
      addFilter(index);
      hexaIndex.addIndex(-1);
    } 

});


app.controller('addFilter', function($timeout, $scope) {
           
    //AddFilter
    var nbList = document.getElementsByClassName("filtercolors_el");
    //Loop listcolors_el and get the include id
    for (var i = 0; i < nbList.length; i++) {

        $scope.pickfilter = function(){ 
            addFilter(i);
        }
    }

});
