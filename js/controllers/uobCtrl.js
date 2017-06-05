// Transition swipe User on boarding
app.controller('uobCtrl', function swipeCtrlFn($timeout) {
  var page = this;
  page.ngInclude = [
    { index: 0, name: 'first', url: 'includes/uob1.html'}, 
    { index: 1, name: 'second', url: 'includes/uob2.html' }, 
    { index: 2, name: 'third', url: 'includes/uob3.html' }, 
    { index: 3, name: 'fourth', url: 'includes/uob4.html' }, 
    { index: 4, name: 'fifth', url: 'includes/uob5.html' }, 
  ];
  page.selectScreen = selectScreen;

  // On initialise la 1er page à charger
  page.ngIncludeSelected = page.ngInclude[0];

  // On retire l'animation pour que la 1er page ne swipe pas
  if(page.ngIncludeSelected == page.ngInclude[0]){
    page.Transition = true;
    $timeout(function(){
        page.Transition = false;
    },500);
  }
      
  // Fonction pour activer ou non le swipe left
  //on vérifie si la page courante est bien plus petite que la page appelée 
  //et donc on désactive le swipe left pour laisser le swipe right agir
  function selectScreen(indexSelected) {
    //On récupère la class indicator
    var indicator = document.getElementsByClassName('indicator')[0];
    var currentPos;

    if (page.ngInclude[indexSelected].index > page.ngIncludeSelected.index) {
      page.moveToLeft = false;
      
      var currentPos = indexSelected*18;
      indicator.style.transform = 'translate3d('+currentPos+'px,0,0)';
    }else{
      if (page.ngInclude[indexSelected].index < page.ngIncludeSelected.index) {
        page.moveToLeft = true;
    
        var currentPos = ((indexSelected+1)*18) - 18;
        indicator.style.transform = 'translate3d('+currentPos+'px,0,0)';
      }
    }
    page.ngIncludeSelected = page.ngInclude[indexSelected];
  }

});