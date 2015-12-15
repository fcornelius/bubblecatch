
{
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
  var main_menu;
  var levels_menu;
  var settings_menu;
  var left_panel;
  var right_panel;
  var overlay;
  var level_running;
  var paused;
  var ingame_menu;
  var ingame_menu_title;
  var ingame_menu_sub;
  var ingame_menu_items;
  var over_at;
  var won_at;
  var i_setts;
  var i_continue;
  var i_repeat;
  var i_home;
  var i_levels;
  var i_next;
  var difficulty;
  var sett_inputs;
  var sett_sliders;

}

canvas = document.getElementById("canvas");
if (document.body.offsetWidth < 1250)
    fullscreen();
setOverlay();
window.addEventListener("resize", function () {
    if (fullscr)
        resize_canvas();
    setOverlay();
});


i_setts = '<i class="icon icon-cog icon-fw"></i>';
i_continue = '<i class="icon icon-arrow-circle-right icon-fw"></i>';
i_repeat = '<i class="icon icon-undo icon-fw"></i>';
i_home = '<i class="icon icon-home icon-fw"></i>';
i_levels = '<i class="icon icon-ellipsis-h icon-fw"></i>';
i_next = '<i class="icon icon-chevron-circle-right icon-fw"></i>'


var diffcs = [
            //bubbles, seconds, minspeed, maxspeed, minrad, maxrad
/* easy */  [10,       90,      1,        3,        30,     40],
/* med */   [20,       60,      1,        4,        20,     30],
/* hard */  [30,       50,      1,        5,        15,     30],
/* pro */   [40,       50,      1,        6,        10,     20],
];

window.onload = function () {

    main_menu = document.getElementById("buttons");
    levels_menu = document.getElementById("levels");
    settings_menu = document.getElementById("settings");
    left_panel = document.getElementById("left_panel");
    right_panel = document.getElementById("right_panel");
    overlay = document.getElementById("overlay");
    ingame_menu = document.getElementById("ingamemenu");
    ingame_menu_title = document.getElementById("ingamemenu_title");
    ingame_menu_sub = document.getElementById("ingamemenu_sub");
    ingame_menu_items = document.getElementsByName("ingamemenu_item");
    sett_inputs = document.getElementsByName("sett_inputs");
    sett_sliders = document.getElementsByName("sett_sliders");

    function setInputEvent(i) {
      sett_sliders[i].oninput = function() {
        if ((i==2) || (i==3)) sett_inputs[i].value = parseInt(this.value/10);
        else sett_inputs[i].value = this.value;
      };
    }
    for (var k = 0; k<sett_sliders.length; k++) setInputEvent(k);


    document.addEventListener("keydown", togglePause, false);
    buttons.classList.add("buttons_in");
};

function menu(from, to) {
  from.classList.remove("buttons_in");
  to.classList.add("buttons_in");
}

function lvl(the_lvl, menu) {
    menu.classList.remove("buttons_in");
    hide_panels();
    init();
    level_running = parseInt(the_lvl);

}
function togglePause(event) {
    if (level_running && ((event.which == 27) || (event == 1))) {
        if (paused) {
            hide_panels();
            ingame_menu.classList.remove("buttons_in");
            levels_menu.classList.remove("buttons_in");
            settings_menu.classList.remove("buttons_in");
            main_menu.classList.remove("buttons_in");
            game_timer = setInterval(draw, interval);
            paused = false;
        }
        else {
            clearInterval(game_timer);
            show_panels(true);
            set_ingamemenu("Level 1", "Pausiert",
                          [i_continue + "Fortsetzen", i_levels + "Level wählen", i_setts + "Einstellungen"],
                          ["togglePause(1)", "menu(ingame_menu, levels_menu)", "menu(ingame_menu, settings_menu)"]);
            ingame_menu.classList.add("buttons_in");
            paused = true;
        }
    }
}
var slide_sett;

function setDifficulty(diffc, el) {
  difficulty = parseInt(diffc);
  document.getElementsByClassName('ch_selected')[0].classList.remove('ch_selected');
  el.classList.add('ch_selected');

  var intv;
  slide_sett = new Array();
  for (var i=0; i<sett_sliders.length; i++) {
    if ((i==2) || (i==3))
      intv = 300/(Math.abs(diffcs[difficulty][i]*10 - sett_sliders[i].value));
    else
      intv = 300/(Math.abs(diffcs[difficulty][i] - sett_inputs[i].value));
    slide_sett[i] = (setInterval(slideSetting, intv, i));
  }
}

function slideSetting(i) {
  if (parseInt(sett_inputs[i].value) != diffcs[difficulty][i]) {
    var incr = diffcs[difficulty][i] > sett_inputs[i].value ? 1 : -1;
    sett_sliders[i].value = parseInt(sett_sliders[i].value) + incr;
    if ((i==2) || (i==3))
      sett_inputs[i].value = (incr>0) ? parseInt(parseInt(sett_sliders[i].value)/10) :
                                      Math.ceil(parseInt(sett_sliders[i].value)/10);
    else
      sett_inputs[i].value = sett_sliders[i].value;

  } else  clearInterval(slide_sett[i]);
}


function set_ingamemenu(title, sub, items, events) {
    ingame_menu_title.innerHTML = title;
    ingame_menu_sub.innerHTML = sub;
    for (var i=0; i<items.length; i++) {
      ingame_menu_items[i].innerHTML = items[i];
      ingame_menu_items[i].setAttribute("onclick", events[i]);
    }
}
function game_over() {
  set_ingamemenu("Ooops..!","Game Over",[i_repeat + "Wiederholen", i_levels + "Level wählen", i_home + "Hauptmenü"],
  ["lvl(1, ingame_menu)", "menu(ingame_menu, levels_menu)", "menu(ingame_menu, main_menu)"]);

    level_running = false;
    clearInterval(game_timer);
    show_panels(true);
    ingame_menu.classList.add("buttons_in");
}
function game_won() {
  set_ingamemenu("Booyaa!","Das war wohl zu leicht...",[i_next + "Nächstes Level", i_levels + "Level wählen", i_home + "Hauptmenü"],
  ["lvl(1, ingame_menu)", "menu(ingame_menu, levels_menu)", "menu(ingame_menu, main_menu)"]);

    level_running = false;
    clearInterval(game_timer);
    show_panels(true);
    ingame_menu.classList.add("buttons_in");
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
    paused = false;
    canvas.addEventListener("mousedown", getBubble, false);
    graphics = canvas.getContext("2d");
    bubbles_count = 20;
    minrad = 20;
    maxrad = 30;
    minspeed = 1;
    maxspeed = 4;
    interval = 25;
    over_at = null;
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
            if (mills % 200 === 0) {
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
    for (i = 0; i < fades.length; i++) {
        drawBubble(fades[i]);
        fades[i].fadegrow(8, 6);
    }
    if (del_bubble) {
        drawBlack(del_bubble);
        del_bubble.move();
    }
    mills += 25;
    if (over_at == mills) game_over();
    if (won_at == mills) game_won();

    drawTime();
    drawInfo();
}
function drawTime() {
    time = ("00" + (Math.floor(mills / (1000)) % 60)).toString().substr(-2, 2) + ":";
    time += ("00" + mills).toString().substr(-3, 2);
    graphics.fillStyle = "rgba(0,0,0,0.4)";
    graphics.font = "50px Share Tech Mono, sans-serif";
    graphics.fillText(time, width - 180, 70);
}
function drawInfo() {
    graphics.fillStyle = "rgba(0,0,0,0.4)";
    graphics.font = "15px Share Tech Mono, sans-serif";
    graphics.fillText("Pause: <ESC>", width - 180 + 6, 100);
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
                if (bubbles.length==0) won_at = mills + 500;
                current++;
                fades.push(b);
                console.log(b.id + " hit, current is " + current);
            }
            else {
                del_bubble = b;
                over_at = mills + 1000;
                console.log("Wrong, " + b.id + " was hit, current is " + current);
            }
        }
    }
}
