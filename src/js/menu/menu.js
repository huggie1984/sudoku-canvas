/**
 * @class Menu
 * @param canvas
 * @param stage
 * @constructor
 */
myApp.Menu = function(canvas, stage) {

    this.canvas = canvas;

    this.stage = stage;

    this.init = function() {
        this.menuContainer = new createjs.Container();
        this.stage.addChild(this.menuContainer);
        this.title();
        this.createDifficultyBtns();
        this.createThemePicker();
    };

    this.title = function(){
        var text = new createjs.Text();
        text.text = "sudoku";
        text.color = myApp.theme.two;
        text.font = 'bold ' + myApp.props.menuTitleSize + 'px headers';
        text.textAlign = 'center';
        text.x = this.canvas.width/2;
        text.y = 15;
        this.menuContainer.addChild(text);
    };

    this.createDifficultyBtns = function () {
        var startGame = this.startGame.bind(this);
        var starSize = myApp.props.menuBtnSize/100*10;
        var easyBtn = this.createEasyBtn(starSize, startGame);
        var mediumBtn = this.createMediumBtn(starSize, startGame);
        var hardBtn = this.createHardBtn(starSize, startGame);
        this.menuContainer.addChild(easyBtn, mediumBtn, hardBtn);
    };

    this.createEasyBtn = function(starSize, callback) {
        var easyBtnSettings = {
            x: (this.canvas.width/2) - (myApp.props.menuBtnSize/2) - (myApp.props.menuBtnSize*2 - myApp.props.menuBtnSize/2),
            y: this.canvas.height/2 - myApp.props.menuBtnSize,
            str:"EASY"};
        var btn = this.createBtn(easyBtnSettings, callback);
        var star = createStar({color:myApp.theme.two, x:myApp.props.menuBtnSize/2, y:myApp.props.menuBtnSize - myApp.props.menuBtnFontSize, radius: starSize});
        btn.addChild(star);
        return btn;
    };

    this.createMediumBtn = function (starSize, callback) {
        var mediumBtnSettings = {
            x: (this.canvas.width/2) - (myApp.props.menuBtnSize/2),
            y: this.canvas.height/2 - myApp.props.menuBtnSize,
            str:"MEDIUM"};
        var btn = this.createBtn(mediumBtnSettings, callback);
        var starOne = createStar({color:myApp.theme.two, x:myApp.props.menuBtnSize/2 - starSize, y:myApp.props.menuBtnSize - myApp.props.menuBtnFontSize, radius: starSize});
        var starTwo = createStar({color:myApp.theme.two, x:myApp.props.menuBtnSize/2 + starSize, y:myApp.props.menuBtnSize - myApp.props.menuBtnFontSize, radius: starSize});
        btn.addChild(starOne, starTwo);
        return btn;
    };

    this.createHardBtn = function (starSize, callback) {
        var hardBtnSettings = {
            x: (this.canvas.width/2) - (myApp.props.menuBtnSize/2) + (myApp.props.menuBtnSize*2 - myApp.props.menuBtnSize/2),
            y: this.canvas.height/2 - myApp.props.menuBtnSize,
            str:"HARD"};
        var btn = this.createBtn(hardBtnSettings, callback);
        var starOne = createStar({color:myApp.theme.two, x:myApp.props.menuBtnSize/2 - starSize*2, y:myApp.props.menuBtnSize - myApp.props.menuBtnFontSize, radius: starSize});
        var starTwo = createStar({color:myApp.theme.two, x:myApp.props.menuBtnSize/2, y:myApp.props.menuBtnSize - myApp.props.menuBtnFontSize, radius: starSize});
        var starThree = createStar({color:myApp.theme.two, x:myApp.props.menuBtnSize/2 + starSize*2, y:myApp.props.menuBtnSize - myApp.props.menuBtnFontSize, radius: starSize});
        btn.addChild(starOne, starTwo, starThree);
        return btn;
    };

    this.createThemePicker = function () {
        var chooseTheme = this.setTheme.bind(this);
        var center = (this.canvas.width/2) - (myApp.props.menuBtnSize/2);
        var btnSettings = [
            {x:center - (myApp.props.menuBtnSize*2 - myApp.props.menuBtnSize/2), y: this.canvas.height/2 + myApp.props.menuBtnSize/2, str:'default', colors: ['#FFFFFF','#363636','#FFFFFF','#57ab59']},
            {x:center, y: this.canvas.height/2 + myApp.props.menuBtnSize/2, str:'dark', colors: ['#363636','#cc527a','#aba7ab','#57ab59']},
            {x:center  + (myApp.props.menuBtnSize*2 - myApp.props.menuBtnSize/2), y: this.canvas.height/2 + myApp.props.menuBtnSize/2, str:'bright', bg:'#a6206a', colors: ['#a6206a','#f7d969','#ec1c4b','#2f9395']}
        ];
        var btns = [];
        for(var i = 0; i < btnSettings.length; i++){
            btns.push(this.createBtn({str: btnSettings[i].str, x: btnSettings[i].x, y:btnSettings[i].y,}, chooseTheme));
            var color = createPallet(myApp.props.menuBtnSize, btnSettings[i].colors);
            btns[i].addChild(color);
            this.menuContainer.addChild(btns[i]);
        }
    };

    this.startGame = function (event) {
        this.setDifficulty(event.currentTarget.id);
        myApp.game.init();
        this.removeAll();
    };

    this.setDifficulty = function (difficulty) {
        var value = 0;
        switch (difficulty) {
            case 'EASY':    value = 1; break;
            case 'MEDIUM':  value = 45; break;
            case 'HARD':    value = 60; break;
            default: console.log('error');
        }
        myApp.puzzle.setDifficulty(value);
    };

    this.setTheme = function (event) {
         event.preventDefault();
        myApp.theme = myApp.props.themes[event.currentTarget.id];
        myApp.canvas.style.backgroundColor = myApp.theme.one;
        this.removeAll();
        this.init();
        this.stage.update();
    };

    this.removeAll = function () {
        this.stage.removeChild(this.menuContainer);
    };

    this.createBtn  = function(settings, callback) {
        var container = new createjs.Container();
        container.width = container.height = myApp.props.menuBtnSize;
        container.x = settings.x;
        container.y = settings.y;
        container.id = settings.str;
        container.addEventListener("click", callback);
        var btn = new createjs.Shape();
        btn.graphics.beginFill(myApp.theme.btn).drawRoundRect(0, 0, container.width, container.height, 10);
        var text = new createjs.Text();
        text.text = settings.str;
        text.color = myApp.theme.two;
        text.font = myApp.props.menuBtnFontSize + 'px headers';
        text.textAlign = 'center';
        text.x = myApp.props.menuBtnSize/2;
        text.y =  myApp.props.menuBtnFontSize;
        container.addChild(btn, text);
        return container;
    };

    function createStar(settings) {
        var star = new createjs.Shape();//x, y, radius, sides, pointSize, angle {50, 50, 20, 5, 2, 90}
        star.graphics.beginFill(settings.color).drawPolyStar(settings.x, settings.y, settings.radius, 5, 2, 90);
        return star;
    }

    function createPallet (size, colors) {
        var color, x = 0;
        var width = size/100*15;
        var height = size/100*30;
        var container = new createjs.Container();
        container.width = width * 4;
        container.height = height;
        container.x = (size/2) - (container.width/2);
        container.y = size - (height + 10);
        for (var i = 0; i < colors.length; i++) {
            color = new createjs.Shape();
            color.graphics.setStrokeStyle(1);
            color.graphics.beginStroke('#000');
            color.graphics.beginFill(colors[i]).drawRect(x, 0, width, height);
            container.addChild(color);
            x += width;
        }
        return container
    }

};

