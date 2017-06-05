//On initialise Angular 
var app = angular.module('App', ['ngAnimate', 'ngTouch']);

//Initialise ColorData base
var colorData = [];

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
//Save data to localstorage
function saveColor(){
  var str = JSON.stringify(colorData);
  window.localStorage.setItem("colors", str);
}

//Get data from localstorage & convert into an object
function getColor(){
  var str = window.localStorage.getItem("colors");
  colorData = JSON.parse(str);
  if(!colorData){
    //Setting default colors 
    colorData = [];
  }
}
getColor();

//Spotlight

var getHex = $("#screenWapper");
var filter = $(".filter");

getHex
  .mouseenter(function() {
    filter.addClass("filter--active");
  })
  .mouseleave(function() {
    filter.removeClass("filter--active");
  });



//On vérifie si c'est pas la 1er fois qu'on lance l'app
var applaunchCount = window.localStorage.getItem('launchCount');

if(applaunchCount){
    
}else{
  window.localStorage.setItem('launchCount',1);
  location.replace("index.html");

  //We add delfaut color for the first time
  addColor("#F5E500","Jaune Banane","Jaune clair","96","90","0");
  addColor("#77B5FE","Bleu de Papa","Bleu ciel","47","71","100");
  addColor("#BF3030","Rouge Fraise","Rouge froncé","75","19","19");
}


