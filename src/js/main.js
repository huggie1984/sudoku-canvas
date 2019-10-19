/*
-Add on keypress events for numbers only when keypad is active.
-Refactor and comment code,
-publish js doc
Complete...
*/
var myApp = myApp || {};

myApp.init = function () {
    var w = window.innerWidth, h = window.innerHeight;
    myApp.props.boardSize = (w > h) ?  Math.floor(h - (h/100*20)) : Math.floor(w - (w/100*12.5));
    myApp.props.cellSize = myApp.props.boardSize/9;
    myApp.props.cellFontSize = myApp.props.cellSize/100*80;
    myApp.props.menuBtnSize = (w > h) ?  Math.floor(h - (h/100*85)) : Math.floor(w - (w/100*90));
    myApp.props.menuTitleSize = (w > h) ?  Math.floor(h - (h/100*85)) : Math.floor(w - (w/100*90));
    myApp.props.menuBtnFontSize = myApp.props.menuBtnSize/100*25;
    myApp.props.orientation = (w > h)? "landscape" : "portrait";
    myApp.theme = myApp.props.themes.default;
    this.canvas = document.getElementById( 'mycanvas' );
    this.canvas.style.backgroundColor = myApp.theme.one;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.stage = new createjs.Stage(this.canvas);
    this.stage.enableMouseOver(10);
    createjs.Ticker.addEventListener("tick", this.stage);
    createjs.Ticker.setFPS(30);
    createjs.Touch.enable(this.stage);
    this.menu = new myApp.Menu(this.canvas, this.stage);
    this.game = new myApp.Sudoku(this.canvas, this.stage);
    this.puzzle = new myApp.Puzzle();
    this.menu.init();
    this.puzzle.init();
};

myApp.props = {
    orientation: null,
    boardSize:0,
    cellSize:0,
    cellFontSize:0,
    menuBtnSize:0,
    menuTitleSize:0,
    menuBtnFontSize:0,
    themes:{
        default:{
            one: '#FFFFFF',
            two:'#363636',
            three:'#FFFFFF',
            btn:'#57ab59',
            txt:'#72c8c8',
            txtError:'#b42b1e'
        },
        dark:{
            one: '#363636',
            two:'#cc527a',
            three:'#aba7ab',
            btn:'#57ab59',
            txt:'#498945',
            txtError:'#b42b1e'
        },
        bright:{
            one: '#a6206a',
            two:'#f7d969',
            three:'#ec1c4b',
            btn:'#2f9395',
            txt:'#f7e8ca',
            txtError:'#f7beb4'
        }
    },
    keyPad:[
        {value:'1'},
        {value:'2'},
        {value:'3'},
        {value:'4'},
        {value:'5'},
        {value:'6'},
        {value:'7'},
        {value:'8'},
        {value:'9'},
        {value:'c'}
    ]
};

