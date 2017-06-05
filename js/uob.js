// Transition swipe entre les pages avec Angular
function SwipeCtrlFn($timeout) {
    var page = this;
    page.ngIncludeTemplates = [
        { index: 0, name: 'first', url: 'includes/uob1.html'}, 
        { index: 1, name: 'second', url: 'includes/uob2.html' }, 
        { index: 2, name: 'third', url: 'includes/uob3.html' }, 
        { index: 3, name: 'fourth', url: 'includes/uob4.html' }, 
        { index: 4, name: 'fifth', url: 'includes/uob5.html' }
    ];
    page.selectScreen = selectScreen;


    // On initialise la 1er page à charger
    page.ngIncludeSelected = page.ngIncludeTemplates[0];

    // On retire l'animation pour que la 1er page ne swipe pas
    if(page.ngIncludeSelected == page.ngIncludeTemplates[0]){
        page.noAnime = true;
        $timeout(function(){
            page.noAnime = false;
        },500);
    }
    
    // Fonction pour activer ou non le swipe left
    //on vérifie si la page courante est bien plus petite que la page appelée 
    //et donc on désactive le swipe left pour laisser le swipe right agir
    function selectScreen(indexSelected) {

        //On récupère la class indicator
        var indicator = document.getElementsByClassName('indicator')[0];
        var currentPos;

        if (page.ngIncludeTemplates[indexSelected].index > page.ngIncludeSelected.index) {
            page.moveToLeft = false;

            var currentPos = indexSelected*18;
            indicator.style.transform = 'translate3d('+currentPos+'px,0,0)';
        } else {
            if (page.ngIncludeTemplates[indexSelected].index < page.ngIncludeSelected.index) {
                page.moveToLeft = true;
                
                var currentPos = ((indexSelected+1)*18) - 18;
                indicator.style.transform = 'translate3d('+currentPos+'px,0,0)';
            }
        }
        page.ngIncludeSelected = page.ngIncludeTemplates[indexSelected];
    }

}
var app = angular.module('App', ['ngRoute', 'ngAnimate', 'ngTouch'])
    .controller('SwipeCtrl', SwipeCtrlFn);
    

document.addEventListener('deviceready', function(){
    // Une fois que le device est ready, on désactive le splashscreen
    navigator.splashscreen.hide();
}, false);

document.addEventListener('deviceready', function(){
    // Une fois que le device est ready, on désactive le splashscreen
    navigator.splashscreen.hide();
    //On lance le plugin caméra preview une fois que le device est ready
    CameraPreview.startCamera({
        x: 0, 
        y: 0, 
        width: window.screen.width, 
        height: window.screen.height, 
        camera: "back", 
        toBack: true, 
        previewDrag: false, 
        tapPhoto: false});
    
}, false);