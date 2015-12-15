var canvas;
var graphics;
var width;
var height;
var bubbles;
var fades;
var del_bubble;
var del_alpha;
var bubbles_count;
var minrad;
var maxrad;
var minspeed;
var maxspeed;
var game_timer;
var clock_timer;
var interval;
var current;
var mills;
var time;
var fullscr;
var buttons;
var levels;
var left_panel;
var right_panel;
var overlay;
var level_running;
var paused;
var pause_menu;
canvas = document.getElementById("canvas");
if (document.body['offsetWidth'] < 1250)
    fullscreen();
setOverlay();
window.addEventListener("resize", function () {
    if (fullscr)
        resize_canvas;
    setOverlay();
});
window.onload = function () {
    buttons = document.getElementById("buttons");
    levels = document.getElementById("levels");
    left_panel = document.getElementById("left_panel");
    right_panel = document.getElementById("right_panel");
    overlay = document.getElementById("overlay");
    pause_menu = document.getElementById("pause");
    document.addEventListener("keydown", togglePause, false);
    buttons.classList.add("buttons_in");
};
function newGame() {
    buttons.classList.remove("buttons_in");
    levels.classList.add("buttons_in");
}
function leaderboard() {
    buttons.classList.remove("buttons_in");
}
function settings() {
    buttons.classList.remove("buttons_in");
}
function menu() {
    levels.classList.remove("buttons_in");
    buttons.classList.add("buttons_in");
}
function lvl1() {
    levels.classList.remove("buttons_in");
    hide_panels();
    init();
    level_running = 1;
}
function togglePause(event) {
    if (level_running && ((event.which == 27) || (event == 1))) {
        if (paused) {
            hide_panels();
            pause_menu.classList.remove("buttons_in");
            game_timer = setInterval(draw, interval);
            paused = false;
        }
        else {
            clearInterval(game_timer);
            show_panels(true);
            pause_menu.classList.add("buttons_in");
            paused = true;
        }
    }
}
function hide_panels() {
    left_panel.classList.add("flat");
    right_panel.classList.add("flat");
    overlay.classList.add("hide_overlay");
}
function show_panels(transp) {
    if (transp) {
        left_panel.classList.add("transp_panel");
        right_panel.classList.add("transp_panel");
    }
    overlay.classList.remove("hide_overlay");
    left_panel.classList.remove("flat");
    right_panel.classList.remove("flat");
}
function fullscreen() {
    var header = document.getElementById("header");
    var nav = document.getElementById("navbar");
    var wrapper = document.getElementById("wrapper");
    header.classList.add("hide");
    nav.classList.add("hide");
    wrapper.classList.add("fullscreen");
    canvas.classList.add("big");
    fullscr = true;
    resize_canvas();
}
function resize_canvas() {
    var wrapper = document.getElementById("wrapper");
    var doc_width = parseInt(window.getComputedStyle(wrapper, null).getPropertyValue("width"));
    var doc_height = parseInt(window.getComputedStyle(wrapper, null).getPropertyValue("height"));
    canvas.width = doc_width;
    canvas.height = doc_height;
    if (bubbles) {
        for (var i = 0; i < bubbles.length; i++) {
            var b = bubbles[i];
            console.log("Bubble " + i + " old x: " + b.x + " old width: " + width + " new width: " + canvas.width);
            b.x = (b.x / width) * canvas.width;
            b.y = (b.y / height) * canvas.height;
            console.log("new X: " + b.x + "\n");
        }
    }
    width = canvas.width;
    height = canvas.height;
    setOverlay();
}
function setOverlay() {
    var overlay = document.getElementById("overlay");
    var rect = canvas.getBoundingClientRect();
    console.log(rect);
    overlay.style.cssText = "top:" + rect.top + "px; left:" + rect.left + "px; width:" + canvas.width + "px; height:" + canvas.height + "px;";
}
function init() {
    clearInterval(game_timer);
    del_bubble = null;
    canvas.addEventListener("mousedown", getBubble, false);
    graphics = canvas.getContext("2d");
    bubbles_count = 20;
    minrad = 20;
    maxrad = 30;
    minspeed = 1;
    maxspeed = 4;
    interval = 25;
    del_alpha = 0;
    mills = 0;
    time = "";
    width = canvas.width;
    height = canvas.height;
    bubbles = new Array();
    fades = new Array();
    erzeugeBubbleMenge(bubbles_count);
    current = 0;
    game_timer = setInterval(draw, interval);
}
var Bubble = function (id, x, y, rgb) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.diffX = Math.floor(Math.random() * (maxspeed - minspeed + 1)) + minspeed;
    this.diffY = Math.floor(Math.random() * (maxspeed - minspeed + 1)) + minspeed;
    this.dirx = 1;
    this.diry = 1;
    this.alpha = 100;
    this.rgb = rgb;
    this.radius = Math.floor(Math.random() * (maxrad - minrad + 1)) + minrad;
    this.wert = Math.ceil(Math.random() * 100 % 10) + 1;
    this.x += this.radius;
    this.y += this.radius;
    this.col = function () {
        return "rgba(" + this.rgb + "," + this.alpha / 100 + ")";
    };
    this.text = function () {
        return "rgba(255,255,255," + this.alpha / 100 + ")";
    };
    this.update = function () {
        if ((this.x + this.diffX < this.radius) || (this.x + this.diffX > width - this.radius))
            this.dirx *= -1;
        if ((this.y + this.diffY < this.radius) || (this.y + this.diffY > height - this.radius))
            this.diry *= -1;
        if (del_bubble) {
            if (mills % 200 == 0) {
                if (this.diffX > 1)
                    this.diffX--;
                if (this.diffY > 1)
                    this.diffY--;
            }
        }
        this.move();
    };
    this.fade = function (f) {
        this.alpha -= f;
    };
    this.fadegrow = function (f, g) {
        this.radius += g;
        this.fade(f);
        this.move();
    };
    this.move = function () {
        this.x += this.diffX * this.dirx;
        this.y += this.diffY * this.diry;
    };
};
function erzeugeBubbleMenge(anzahl) {
    bubbles.splice(0, bubbles.length);
    for (var i = 0; i < anzahl; i++) {
        erzeugeEinzelneBubble(i);
    }
}
function erzeugeEinzelneBubble(id) {
    var newX = Math.floor(Math.random() * (width - 2 * 20 + 1));
    var newY = Math.floor(Math.random() * (height - 2 * 20 + 1));
    var rgb = randRGB();
    var bubble = new Bubble(id, newX, newY, rgb);
    bubbles.push(bubble);
}
function draw() {
    function drawBubble(b) {
        graphics.fillStyle = b.col();
        graphics.font = b.radius + "px Verdana";
        graphics.beginPath();
        graphics.arc(b.x, b.y, b.radius, 0, 2 * Math.PI);
        graphics.fill();
        graphics.closePath();
        graphics.fillStyle = b.text();
        graphics.fillText((b.id + 1), b.x - ((b.id + 1).toString().length) * ((b.radius) / 4.0 + b.radius / 16.0), b.y + (b.radius) / 2 - (b.radius) / 10);
    }
    function drawBlack(b) {
        if (del_alpha <= 0.7)
            del_alpha += 0.1;
        graphics.fillStyle = "rgba(0,0,0," + del_alpha + ")";
        graphics.beginPath();
        graphics.arc(b.x, b.y, b.radius, 0, 2 * Math.PI);
        graphics.fill();
        graphics.closePath();
    }
    graphics.clearRect(0, 0, width, height);
    for (var i = 0; i < bubbles.length; i++) {
        drawBubble(bubbles[i]);
        if (del_bubble) {
            if (bubbles[i] == del_bubble)
                continue;
            else {
                bubbles[i].fade(3);
            }
        }
        bubbles[i].update();
    }
    for (var i = 0; i < fades.length; i++) {
        drawBubble(fades[i]);
        fades[i].fadegrow(8, 6);
    }
    if (del_bubble) {
        drawBlack(del_bubble);
        del_bubble.move();
    }
    else
        mills += 25;
    drawTime();
}
function drawTime() {
    time = ("00" + (Math.floor(mills / (1000)) % 60)).toString().substr(-2, 2) + ":";
    time += ("00" + mills).toString().substr(-3, 2);
    graphics.fillStyle = "rgba(0,0,0,0.4)";
    graphics.font = "50px Share Tech Mono, sans-serif";
    graphics.fillText(time, width - 180, 70);
}
function randRGB() {
    function val() {
        return Math.floor(Math.random() * (200 - 0 + 1) + 0);
    }
    return val() + "," + val() + "," + val();
}
function getBubble(event) {
    var mX = event.x - canvas.offsetLeft;
    var mY = event.y - canvas.offsetTop;
    for (var i = 0; i < bubbles.length; i++) {
        var b = bubbles[i];
        if ((Math.abs(b.x - mX) > maxrad) || (Math.abs(b.y - mY) > maxrad))
            continue;
        else {
            console.log((b.id) + " clicked, current is " + (current));
            if (b.id == current) {
                bubbles.splice(bubbles.indexOf(b), 1);
                current++;
                fades.push(b);
                console.log(b.id + " hit, current is " + current);
            }
            else {
                del_bubble = b;
                console.log("Wrong, " + b.id + " was hit, current is " + current);
            }
        }
    }
}
