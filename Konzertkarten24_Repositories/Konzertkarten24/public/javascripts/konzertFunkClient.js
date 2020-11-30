window.onload = function(){
    carousel();
}

var n = 0;
var slideIndex = 0;
var x = document.getElementsByClassName("mySlides");

function caroplus(n) {
  if(slideIndex<1) {
    x[slideIndex=x.length].style.display = "block";   // anzeigen 
     setTimeout(carousel, 10); 
    
  } 
  if (slideIndex>=1){
   x[slideIndex-1+n].style.display = "block";   // anzeigen 
  setTimeout(carousel, 10); 
  }
  carousel();
}


function carousel() {
  var i;
  //var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  // nicht sichtbar  {01 02 03 ... 07}
}
  slideIndex++;
  if (slideIndex > x.length) {slideIndex = 1}    //Dauerschleife erzeugen!

  if (slideIndex > x.length) {slideIndex = 1} 
  //alert(slideIndex) ;   //1 2 3 4 5 6 7

    x[slideIndex-1].style.display = "block";   // anzeigen 
    setTimeout(carousel, 9000); 
}


