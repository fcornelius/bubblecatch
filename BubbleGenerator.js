
var canvas;
var graphics;
var width;
var height;
var bubbles;

function init() {
    canvas = document.getElementById("canvas");
    graphics = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    bubbles = new Array();

    erzeugeBubbleMenge(10);
    setInterval(draw, 26);
}

function erzeugeBubbleMenge(anzahl) {

  bubbles.splice(0, bubbles.length);
  for (i = 0; i < anzahl; i++) {
    erzeugeEinzelneBubble();

  }

}

function erzeugeEinzelneBubble() {
    var newX = Math.floor(Math.random() * (width+1));
    var newY = Math.floor(Math.random() * (height+1));
    var col = "red";

    var bubble = new Bubble(newX, newY, col);
    bubbles.push(bubble);

}

function draw() {
  graphics.clearRect(0,0,width,height);

}
var Bubble = function(x, y, col)
{
    this.x = x;
    this.y = y;
    this.col = col;
    this.radius = Math.random() * 100 % 11 + 10;
    this.wert = Math.ceil(Math.random() * 100 % 10) + 1;
};
