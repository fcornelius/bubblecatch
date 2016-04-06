

/***********************************************************/
/*  Projekt:    Bubble-Catch, EMI WS 15/16                 */
/*  Autor:      Felix Cornelius                            */
/*  Matr.Nr.:   4543504                                    */
/*                                                         */
/*  Dateien:    /index.html                                */
/*              /bc.js                                     */
/*              /bc_style.css                              */
/*              /favicon.ico                               */
/*              /fonts                                     */
/*                  /icomoon.ttf                           */
/*                  /Pacifico-regular.ttf                  */
/*                  /Play-regular.ttf                      */
/*                  /Share-Tech-Mono-regular.ttf           */
/***********************************************************/


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
  var reduced_bar;
  var combo_bar;
  var combos;
  var time_bar;
  var current;
  var mills;
  var time;
  var score;
  var score_shown;
  var score_total;
  var fullscr;
  var menues;
  var main_menu;
  var levels_menu;
  var settings_menu;
  var left_panel;
  var right_panel;
  var overlay;
  var level_running;
  var paused;
  var fullscr_btn;
  var ingame_menu;
  var ingame_menu_title;
  var ingame_menu_sub;
  var ingame_menu_items;
  var back_button;
  var countdown;
  var countdown_mills;
  var combo_time;
  var gameover;
  var over_at;
  var sec_limit;
  var won_at;
  var num_blink;
  var num_hide;
  var diffcs;
  var slide_sett;
  var icn_setts;
  var icn_continue;
  var icn_repeat;
  var icn_home;
  var icn_levels;
  var icn_next;
  var str_setts;
  var str_continue;
  var str_repeat;
  var str_home;
  var str_levels;
  var str_next;
  var str_won_tit;
  var str_won_sub;
  var str_ovr_tit;
  var str_ovr_sub;
  var str_pau_tit;
  var str_pau_sub;
  var str_fin_tit;
  var difficulty;
  var sett_inputs;
  var sett_sliders;
  var header;
  var nav;
  var wrapper;
  var lvls_unlocked;
  var lvl_btns;
  var lock_info;
  var multiplier;

}

/* Icon entities */

icn_setts    = '<i>&#xe903;</i>';
icn_continue = '<i>&#xe908;</i>';
icn_repeat   = '<i>&#xe901;</i>';
icn_home     = '<i>&#xe900;</i>';
icn_levels   = '<i>&#xe90d;</i>';
icn_locked   = '<i class="lvl">&#xe911;</i>';
icn_unlocked = '<i class="lvl">&#xe913;</i>';
icn_played   = '<i class="lvl">&#xe915;</i>';

/* Strings */

str_setts    = icn_setts    + 'Einstellungen';
str_continue = icn_continue + 'Fortsetzen';
str_repeat   = icn_repeat   + 'Wiederholen';
str_home     = icn_home     + 'Hauptmenü';
str_levels   = icn_levels   + 'Level wählen';
str_next     = icn_continue + 'Nächstes Level';

str_won_tit = 'Booyaa!';
str_won_sub = 'Das war wohl zu leicht...';
str_ovr_tit = 'Ooops..!';
str_ovr_sub = 'Game Over';
str_fin_tit = 'Whoop Whoop!';
str_fin_sub = '"Great kid, don\'t get cocky now!" -Han Solo';
str_pau_tit = 'Level  ';
str_pau_sub = 'Pausiert';
str_locked  = 'Level {lvl} noch nicht freigeschaltet!';


/* Schwierigkeits Grade */

diffcs = [
            //bubbles, seconds, minspeed, maxspeed, minrad, maxrad
/* easy */  [5,        90,      1,        3,        30,     40],
/* med */   [10,       60,      1,        4,        20,     30],
/* hard */  [30,       50,      1,        5,        20,     30],
/* pro */   [60,       50,      1,        6,        17,     30],
];

window.onload = function () {

    canvas            = document.getElementById("canvas");
    menues            = document.getElementsByClassName('menu');
    main_menu         = document.getElementById("main");
    about_menu        = document.getElementById("about");
    levels_menu       = document.getElementById("levels");
    ingame_menu       = document.getElementById("ingame");
    ingame_menu_title = document.getElementById("ingame_title");
    ingame_menu_sub   = document.getElementById("ingame_sub");
    ingame_menu_items = document.getElementsByName("ingame_item");
    settings_menu     = document.getElementById("settings");
    sett_inputs       = document.getElementsByName("sett_inputs");
    sett_sliders      = document.getElementsByName("sett_sliders");
    back_button       = document.getElementsByClassName('back');
    left_panel        = document.getElementById("left_panel");
    right_panel       = document.getElementById("right_panel");
    overlay           = document.getElementById("overlay");
    header            = document.getElementsByClassName("header")[0];
    wrapper           = document.getElementById("wrapper");
    fullscr_btn       = document.getElementById("fullscr");
    lvl_btns          = document.getElementsByClassName("level");
    lock_info         = document.getElementsByClassName("lock_info")[0];


    /* Vollbild bei kleinen Bildschirmen/Fenstern */

    if (document.body.offsetWidth < 1250)
        fullscreen();
    else
        setOverlay();

    /* Event Listener */

    for (var k = 0; k<sett_sliders.length; k++) setInputEvents(k);

    function setInputEvents(i) {
      sett_sliders[i].oninput = function() {
        if ((i==2) || (i==3)) sett_inputs[i].value = parseInt(this.value/10);
        else sett_inputs[i].value = this.value;
      };
    }

    window.addEventListener("resize", function () {
        resize_canvas();
    });
    document.addEventListener("keydown", togglePause, false);


    menu(main_menu);
    draw_about();
    lvls_unlocked = 1;
};



/*--------------------------- UI ----------------------------*/




function menu(mn) {
  hide_menues();
  mn.classList.add("menu_in");
}

function main() {
    menu(main_menu);
    set_backbtn("main_menu");
}

function about()    { menu(about_menu);    }
function settings() { menu(settings_menu); }

/* Prüfen bis zu welchem Level freigeschaltet */

function levels() {
  for (var i=0; i<lvl_btns.length; i++) {

    if ((i+1)<lvls_unlocked)
      lvl_btns[i].innerHTML = icn_played+"<br>Level "+(i+1);
    else if ((i+1)==lvls_unlocked)
      lvl_btns[i].innerHTML = icn_unlocked+"<br>Level "+(i+1);
    else
      lvl_btns[i].innerHTML = icn_locked+"<br>Level "+(i+1);
  }
  score_total = 0;
  menu(levels_menu);
}

function hide_menues() {
  for (var i=0; i<menues.length; i++)
    menues[i].classList.remove("menu_in");
  lock_info.classList.remove("locked");
}

function lvl(the_lvl) {
    if (the_lvl>lvls_unlocked) {
      lock_info.innerHTML = str_locked.replace("{lvl}", the_lvl);
      lock_info.classList.add("locked");
    }
    else {
      hide_menues();
      hide_panels();

/* Level Parameter für Zeit, Nummern Blinken/Verstecken...      */
/* init(blink, hide, count_t, combo_t, mult)                    */
/*         |     |      |       |        |                      */
/*         |     |      |       |        Punkte Multiplikator   */
/*         |     |      |       Zeit für Combo in ms            */
/*         |     |      Zeit pro Bubble in ms                   */
/*         |     Verstecke Nummern jede x-te Bubble             */
/*         Zeige Nummern nur alle x ms                          */

      switch (the_lvl) {
         case 1:
          init(1,1,10000,1500,1);     break;
         case 2:
          init(200,1,6000,1500,2);    break;
         case 3:
          init(1,2,5000,1500,4);      break;
         case 4:
          init(1,3,5000,1500,8);      break;
         case 5:
          init(200,3,4000,1500,15);   break;
    }
    level_running = parseInt(the_lvl);
    }
}

function togglePause(event) {
    if (level_running && ((event.which == 27) || (event == 1))) {
        if (paused) {
            hide_panels();
            hide_menues();
            game_timer = setInterval(draw, interval);
            paused = false;
        }
        else {
            clearInterval(game_timer);
            show_panels(true);
            set_ingamemenu(str_pau_tit+level_running, str_pau_sub,
                          [str_continue, str_levels, str_home, str_setts],
                          ["togglePause(1)","levels()","main()","settings()"]);
            set_backbtn("ingame");
            menu(ingame);
            paused = true;
        }
    }
}

/* Zurück Button auf voriges Menü anpassen */

function set_backbtn(menu) {
  back_button[0].setAttribute("onclick", "menu(" + menu + ")");
  back_button[2].setAttribute("onclick", "menu(" + menu + ")");
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
    set_ingamemenu(str_ovr_tit, str_ovr_sub,
                [str_repeat, str_levels, str_home, str_setts],
                ["lvl(1)","levels()","main()","settings()"]);

    level_running = false;
    score_total = 0;
    clearInterval(game_timer);
    show_panels(true);
    menu(ingame);
}

function game_won() {
    if (level_running==lvl_btns.length)
      game_finish();
    else {
      score_total += score;
      set_ingamemenu(str_won_tit, "Level Score: " + score + " Gesamt: " + score_total+
                  "<br>" + str_won_sub,
                  [str_next, str_levels, str_home, str_setts],
                  ["lvl("+(level_running+1)+")","levels()","main()","settings()"]);
      lvls_unlocked = level_running + 1;
      level_running = false;
      clearInterval(game_timer);
      show_panels(true);
      menu(ingame);
  }
}

function game_finish() {
  score_total += score;
  for (var i=1; i<ingame_menu_items.length; i++)
    ingame_menu_items[i].classList.add("hide");

  set_ingamemenu(str_fin_tit, str_fin_sub + "<br><br>Level Score: " + score +
              "<br>Gesamt:<div id='score'>" + score_total + "</div>",
              [str_home, "", "", ""],
              ["game_reset()","","",""]);
  lvls_unlocked = level_running + 1;
  level_running = false;
  clearInterval(game_timer);
  show_panels(true);
  menu(ingame);
}

function game_reset() {
  main();
  set_ingamemenu("","",[],[]);
  for (var i=1; i<ingame_menu_items.length; i++)
    ingame_menu_items[i].classList.remove("hide");
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

function toggle_screen() {
  if (fullscr)
    windowscreen();
  else fullscreen();
}

function windowscreen() {
  header.classList.remove("hide");
  wrapper.classList.remove("fullscreen");
  canvas.classList.remove("big");
  fullscr = false;
  fullscr_btn.innerHTML = "<i>&#xe902;</i>Vollbild";
  resize_canvas();
}

function fullscreen() {
    header.classList.add("hide");
    wrapper.classList.add("fullscreen");
    canvas.classList.add("big");
    fullscr = true;
    fullscr_btn.innerHTML = "<i>&#xe910;</i>Fensterbild";
    resize_canvas();
}

/* Beim verändern der Fenstergröße HTML Overlay und canvas anpassen  */
/* (Canvas wird immer realtiv zum wrapper ausgerichtet)              */
/* Bubble-Koordianten werden bei Canvas Vergrößerung neuberechnet    */

function resize_canvas() {
    wrapper = document.getElementById("wrapper");
    var doc_width = parseInt(window.getComputedStyle(wrapper, null).getPropertyValue("width"));
    var doc_height = parseInt(window.getComputedStyle(wrapper, null).getPropertyValue("height"));
    canvas.width = doc_width;
    canvas.height = doc_height;
    if (!fullscr) { canvas.width -= 50; canvas.height -= 50; }

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

/* HTML Overlay auf Canvas anpassen */

function setOverlay() {
    var overlay = document.getElementById("overlay");
    var rect = canvas.getBoundingClientRect();
    overlay.style.cssText = "top:" + rect.top + "px; " +
                            "left:" + rect.left + "px; " +
                            "width:" + canvas.width + "px; " +
                            "height:" + canvas.height + "px;";
}

/* Beim ändern der Schwierigkeit, Regler verschieben */
/* Geschwindigkeit der Verschiebung hängt vom zu ändernden Unterschied ab, */
/* damit alle Regler gleichzeitig 'ankommen' */

function setDifficulty(diffc, el) {
  if (slide_sett)
    for (var i=0; i<slide_sett.length; i++) clearInterval(slide_sett[i]);

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

/* Bei Min-Speed und Max-Speed das text input nur alle 10 Werte erhöhen, */
/* Slider max ist 10-faches der eigentlichen Einträge, damit flüssiger   */

/* RLY?!  I know... */

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

/* Zweites Canvas für 'Über' Menü */

function draw_about() {
    var about_canvas = document.getElementById("about_canvas");
    graphics = about_canvas.getContext("2d");
    graphics.clearRect(0, 0, 700, 300);

    width=600;
    num_blink=num_hide=current=mills=1;


    maxrad=minrad=20;
    drawBubble(new Bubble(1,50,50,randRGB()));
    maxrad=minrad=25;
    drawBubble(new Bubble(2,150,120,randRGB()));
    drawBubble(new Bubble(0,100,200,randRGB()));

    graphics.fillStyle = "rgba(255,255,255,0.4)";
    graphics.font = "50px 'Share Tech Mono', sans-serif";
    graphics.fillText("05:50", width - 180, 70);

    graphics.strokeStyle = "rgba(0,0,0,0.2)";
    graphics.lineWidth = 5;
    graphics.strokeRect(width - 174, 100, 135, 25);
    graphics.fillStyle = "rgba(200, 31, 31, 0.3)";
    graphics.fillRect(width - 174, 100, 110, 25);
    graphics.fillStyle = "rgba(12, 115, 41,0.5)";
    graphics.fillRect(width - 174 + 110, 100, 25, 25);

    graphics.fillStyle = "#528bff";
    graphics.font = "15px Play, sans-serif";
    graphics.fillText("Hab' die Uhr im Blick!", width - 360, 55);
    graphics.font = "20px icomoon, sans-serif";
    graphics.fillText("", width - 210, 58);

    graphics.font = "15px Play, sans-serif";
    graphics.fillText("Bubble Lebenszeit", width - 340, 117);
    graphics.font = "20px icomoon, sans-serif";
    graphics.fillText("", width - 210, 120);


    graphics.font = "20px icomoon, sans-serif";
    graphics.fillText("", width - 60, 155);
    graphics.font = "15px Play, sans-serif";
    graphics.fillText("Combo Zeit", width - 120, 175);

}



/*--------------------------- Game ----------------------------*/



function init(blink, hide, count_t, combo_t, mult) {

    clearInterval(game_timer);
    del_bubble = null;
    paused = false;
    gameover = false;
    canvas.addEventListener("mousedown", getBubble, false);
    graphics = canvas.getContext("2d");


    /* Settings */

    bubbles_count = parseInt(sett_inputs[0].value);
        sec_limit = parseInt(sett_inputs[1].value);
         minspeed = parseInt(sett_inputs[2].value);
         maxspeed = parseInt(sett_inputs[3].value);
           minrad = parseInt(sett_inputs[4].value);
           maxrad = parseInt(sett_inputs[5].value);

    num_blink = blink;
    num_hide = hide;
    countdown = count_t;
    combo_time = combo_t;
    multiplier = mult;
    interval = 25;
    over_at = sec_limit*1000;
    won_at = null;
    del_alpha = 0;
    mills = 0;
    score = 0;
    score_shown = 0;
    countdown_mills = 0;
    reduced_bar = 0;
    time = "";
    width = canvas.width;
    height = canvas.height;
    bubbles = new Array();
    fades = new Array();
    combos = new Array();

    combo_bar = (135/countdown) * combo_time;
    time_bar = 135 - combo_bar;

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
    this.x += this.radius; //Abstand zum oberen/linken Rand
    this.y += this.radius;
    this.col = function () {
        return "rgba(" + this.rgb + "," + this.alpha / 100 + ")";
    };
    this.text = function () {
        return "rgba(255,255,255," + this.alpha / 100 + ")";
    };
    this.update = function () {

	/* Richtung ändern, beim erreichen des Randes */

        if ((this.x + this.diffX < this.radius) || (this.x + this.diffX > width - this.radius))
            this.dirx *= -1;
        if ((this.y + this.diffY < this.radius) || (this.y + this.diffY > height - this.radius))
            this.diry *= -1;

	/* Bei Game-Over Bubbles langamer werden lassen */

        if (gameover) {
            if (mills % 200 === 0) {
                if (this.diffX > 1)
                    this.diffX--;
                if (this.diffY > 1)
                    this.diffY--;
            }
        }
        this.move();
    };

    /* Bubbles vergrößern und ausblenden wenn gefangen */

    this.fade = function (f) {
        this.alpha -= f;
        if (this.alpha <= 0)
          fades.splice(fades.indexOf(this), 1);
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
    var newX = Math.floor(Math.random() * (width - 2 * maxrad + 1));
    var newY = Math.floor(Math.random() * (height - 2 * maxrad + 1));
    var rgb = randRGB();
    var bubble = new Bubble(id, newX, newY, rgb);
    bubbles.push(bubble);
}



function draw() {

    graphics.clearRect(0, 0, width, height);

    /* Zu löschende Bubble schwarz werden lassen */
    /* und nicht updaten, verlässt das canvas */

    if (del_bubble) {
      drawBubble(del_bubble);
      drawBlack(del_bubble);
      del_bubble.move();
    }
    for (var i = 0; i < bubbles.length; i++) {
        drawBubble(bubbles[i]);
        if (gameover) bubbles[i].fade(3);
        bubbles[i].update();
    }
    for (i = 0; i < fades.length; i++) {
        drawBubble(fades[i]);
        fades[i].fadegrow(8, 6);
    }

    if (mills == over_at) game_over();
    if (mills == won_at)  game_won();

    /* Wenn Zeit pro Bubble abgelaufen, Bubble entfernen */

    if (countdown_mills == countdown) {
      del_bubble = bubbles[0];
      del_alpha = 0;
      bubbles.splice(0,1);
      score -= 100 * multiplier;
      if (bubbles.length==0) {
        if (score==0) game_over();
        else game_won();
      }
      current++;
      countdown_mills = 0;
    }

    /* Punktestand in 5er Schritten hochzählen */

    if (score_shown < score - 5) score_shown += 5;
    else score_shown = score;

    drawScore();
    drawCombos();
    drawTime();
    drawTimeBar();
    drawInfo();

    mills += 25;
    countdown_mills += 25;

    /* Abdeckrechteck für Lebensleiste vergrößern */

    reduced_bar = countdown_mills*(135/countdown);


}

function drawBubble(b) {
    graphics.fillStyle = b.col();
    graphics.font = b.radius + "px Verdana";
    graphics.beginPath();
    graphics.arc(b.x, b.y, b.radius, 0, 2 * Math.PI);
    graphics.fill();
    graphics.closePath();
    graphics.fillStyle = b.text();
    if ((mills%num_blink==0) && (current%num_hide==0)) // Parameter-abhängig Nummern zeigen
      graphics.fillText((b.id + 1),
        b.x - ((b.id + 1).toString().length) * ((b.radius) / 4.0 + b.radius / 16.0),
        b.y + (b.radius) / 2 - (b.radius) / 10);
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

function drawScore() {
  graphics.fillStyle = "rgba(0,0,0,0.4)";
  graphics.font = "30px Share Tech Mono, sans-serif";
  graphics.fillText("Score: " + score_shown, 50, 70);
}

function drawCombos() {
  for (var i=0; i<combos.length; i++) {
    if (combos[i].alpha>0) {

      graphics.fillStyle = "rgba(22, 207, 73,"+ combos[i].alpha +")";
      graphics.font = "40px Share Tech Mono, sans-serif";
      graphics.fillText("COMBO!", 160, combos[i].x);

      combos[i].x--;
      combos[i].alpha -= 0.01;
    } else combos.splice(i,1);
  }
}

function drawTime() {
    time = ("00" + (Math.floor((sec_limit) - (mills / (1000))))).toString().substr(-2, 2) + ":";
    time += ("00" + (sec_limit*1000 - mills)).toString().substr(-3, 2);
    graphics.fillStyle = "rgba(0,0,0,0.4)";
    graphics.font = "50px Share Tech Mono, sans-serif";
    graphics.fillText(time, width - 180, 70);
}


function drawTimeBar() {
    graphics.strokeStyle = "rgba(0,0,0,0.4)";
    graphics.lineWidth = 5;
    graphics.strokeRect(width - 174, 100, 135, 25);

    graphics.fillStyle = "rgba(200, 31, 31, 0.69)";
    graphics.fillRect(width - 174, 100, time_bar, 25);

    graphics.fillStyle = "rgba(22, 207, 73, 0.84)";
    graphics.fillRect(width - 174 + time_bar, 100, combo_bar, 25);

    graphics.fillStyle = "white";
    graphics.fillRect(width - 174 + 135 - reduced_bar, 100, reduced_bar, 25);
}

function drawInfo() {
    graphics.fillStyle = "rgba(0,0,0,0.4)";
    graphics.font = "15px Share Tech Mono, sans-serif";
    graphics.fillText("Pause: <ESC>", width - 180 + 6, 150);
}

var combo = function() {
    this.x = 100;
    this.alpha = 1.0;
};

function randRGB() {
    function val() {
        return Math.floor(Math.random() * (200 - 0 + 1) + 0);
    }
    return val() + "," + val() + "," + val();
}

function getBubble(event) {
    var mX = event.clientX - canvas.offsetLeft;
    var mY = event.clientY - canvas.offsetTop;
    for (var i = 0; i < bubbles.length; i++) {
        var b = bubbles[i];
        var dif = (mX-b.x)*(mX-b.x) + (mY-b.y)*(mY-b.y);
        if (dif > (b.radius*b.radius))
            continue;
        else {

	          /* Bubble wurde getroffen */

            console.log((b.id) + " clicked, current is " + (current));
            console.log("bubbles[0].id=" + bubbles[0].id);

            if (b.id == current) {

 	              /* Richtige Bubble */

                bubbles.splice(bubbles.indexOf(b), 1);
                if (bubbles.length==0) won_at = mills + 500; //Kleine Verzögerung des Menüs
                current++;
                fades.push(b);

		            /* Bei Combo doppelte Punkte */

                if (countdown_mills <= combo_time) {
                  score += 2 * Math.floor((countdown - countdown_mills) / 100) * multiplier;
                  combos.push(new combo());
                } else {
                  score += Math.floor((countdown - countdown_mills) / 100) * multiplier;
                }
                countdown_mills = 0;
                console.log(b.id + " hit, current is " + current);
            }
            else {

	            	/* Falsche Bubble */

                gameover = true
                del_bubble = b;
                bubbles.splice(bubbles.indexOf(b), 1);
                del_alpha = 0;
                over_at = mills + 1000; //Kleine Verzögerung des Menüs
                console.log("Wrong, " + b.id + " was hit, current is " + current);
            }
            break;
        }
    }
}
