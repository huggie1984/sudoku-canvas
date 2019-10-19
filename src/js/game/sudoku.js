/**
 * @class Sudoku
 * @param canvas
 * @param stage
 * @constructor
 */
myApp.Sudoku = function(canvas, stage){

    /**
     * initialize the sudoku puzzle,
     * @method init
     */
    this.init = function () {
        this.canvas = canvas;
        this.stage = stage;
        this.boardContainer = this.inputContainer = undefined;
        this.selectedSegment = undefined;
        this.grid = [];
        this.userCells = [];
        this.inputCount = 0;

        this.createContainers();
        this.createGrid();
        this.createKeyPad();
    };

    /**
     * Create the core containers used for the game ui.
     * @memberOf Sudoku
     * @method createContainers
     */
    this.createContainers = function() {
        this.boardContainer = new createjs.Container();
        this.stage.addChild(this.boardContainer);
        this.inputContainer = new createjs.Container();
        this.stage.addChild(this.inputContainer);
    };

    /**
     * Create the grid element of the sudoku board
     * @memberOf Sudoku
     * @method createGrid
     */
    this.createGrid = function () {
        var margin = 10;
        var len = 9;
        var _x = 0, _y = 0;
        for (var row = 0; row < len; row++) {
            this.grid.push([]);
            for (var col = 0; col < len; col++) {
                var gridRow = Math.floor(row/3);
                var gridCol = Math.floor(col/3);
                var settings = {
                    x: _x,
                    y: _y,
                    col: col,
                    row: row,
                    gridIndex: gridRow * 3 + gridCol,
                    value: myApp.puzzle.puzzle[row][col].value,
                    cellSize: myApp.props.cellSize,
                    fontSize:myApp.props.cellFontSize
                };
                this.grid[row].push(this.createCell(settings));
                if(col === 2){
                    _x += (myApp.props.cellSize + margin);
                }else if (col === 5){
                    _x += (myApp.props.cellSize + margin);
                } else {
                    _x += myApp.props.cellSize;
                }
            }
            _x = 0;

            if(row === 2){
                _y += (myApp.props.cellSize + margin);
            }else if (row === 5){
                _y += (myApp.props.cellSize + margin);
            }else{
                _y += myApp.props.cellSize;
            }

        }
        this.boardContainer.width = myApp.props.boardSize + (margin*2);
        this.boardContainer.height = myApp.props.boardSize + (margin*2);
        this.boardContainer.x = (this.canvas.width/2) - (this.boardContainer.width/2);
        this.boardContainer.y = myApp.props.cellSize/2;
        this.boardContainer.cache(0,0,this.boardContainer.width, this.boardContainer.height);
    };

    /**
     * Create the cells that reside within the sudoku Grid
     * @memberOf Sudoku
     * @method createCell
     * @param settings {object}  properties of the cell
     * @return {*} {object} container object of a cell
     */
    this.createCell = function (settings) {
        var str, color;
        var isSetValue = (settings.value !== 0);
        var cellContainer = new createjs.Container();
        cellContainer.x = settings.x;
        cellContainer.y = settings.y;
        cellContainer.value = settings.value;
        cellContainer.segmentData = {
            id: settings.row + "_" + settings.col,
            col: settings.col,
            row: settings.row,
            isPreSet: isSetValue
        };
        this.boardContainer.addChild(cellContainer);
        var rect = new createjs.Shape();
        rect.graphics.setStrokeStyle(2);
        rect.graphics.beginStroke(myApp.theme.two);
        rect.graphics.beginFill(myApp.theme.three).drawRect(0,0, settings.cellSize, settings.cellSize);
        if(isSetValue){
            str = cellContainer.value;
            color = myApp.theme.two;
        } else {
            str = "";
            cellContainer.addEventListener("click",this.cellClicked.bind(this));
            color = myApp.theme.txt;
            this.userCells.push(cellContainer);
        }
        var txt = createText(str, color, settings.cellSize/2, 0, settings.fontSize);
        txt.name = "text";
        txt.textAlign = "center";
        cellContainer.addChild(rect,txt);
        return cellContainer;
    };

    /**
     * Create the input user input keys for the empty grid spaces
     * @memberOf Sudoku
     * @method createKeyPad
     */
    this.createKeyPad = function(){
        var keySize = (myApp.props.cellSize/100)*90;
        var keyFontSize = ( myApp.props.cellFontSize/100)*90;
        this.inputContainer.width = keySize*10;
        this.inputContainer.height = keySize;
        this.inputContainer.x = (this.canvas.width/2) - (this.inputContainer.width/2);
        this.inputContainer.y = (this.canvas.height/2) - (this.inputContainer.height/2)  + keySize * 5;
        var x = 0;
        for(var i = 0; i < myApp.props.keyPad.length; i++){
            var keySettings = myApp.props.keyPad[i];
            var rect = new createjs.Shape();
            rect.value = keySettings.value;
            rect.graphics.beginFill(myApp.theme.two).drawRoundRect(x, 0, keySize, keySize, 10);
            if(keySettings.value !== 'c'){
                rect.addEventListener("click",this.keyClicked.bind(this));
            } else {
                rect.addEventListener("click",this.clearCell.bind(this));
            }
            var txt = createText(keySettings.value, myApp.theme.three, x + keySize/2,  0, keyFontSize);
            this.inputContainer.addChild(rect, txt);
            x += keySize;
        }

        this.inputContainer.visible = false;
        this.inputContainer.cache(0,0,this.inputContainer.width, this.inputContainer.height);
    };

    /**
     * Create a popup notification
     * @memberOf Sudoku
     * @method createPopUp
     * @param str {string} text for the popup notification
     * @param btnStr {string} text for the button
     * @param callback {function} to be called back on button clicked
     */
    this.createPopUp = function (str, btnStr, callback) {
        this.popup = new createjs.Container();
        var overlay = new createjs.Shape();
        overlay.graphics.beginFill("#000").drawRect(0,0, this.canvas.width, this.canvas.height);
        overlay.alpha = .75;
        var description = createText(str, "#fff",this.canvas.width/2, this.canvas.height/2, 24);
        var acceptSettings = {
            x: (this.canvas.width/2) - (myApp.props.cellSize),
            y: (this.canvas.height/2) + 100,
            width: myApp.props.cellSize*2,
            height: myApp.props.cellSize,
            bgColor: myApp.theme.btn,
            txtColor: myApp.theme.two,
            fontSize: myApp.props.cellFontSize/2,
            str: btnStr
        };
        var acceptBtn = createButton(acceptSettings);
        acceptBtn.addEventListener("click", callback);
        this.popup.addChild(overlay,description,acceptBtn);
        this.stage.addChild(this.popup);
    };

    /**
     * Remove a popup notification
     * @memberOf Sudoku
     * @method removePopup
     */
    this.removePopup = function () {
        this.stage.removeChild(this.popup);
    };

    /**
     * Handler for when an empty cell is clicked
     * @memberOf Sudoku
     * @method cellClicked
     * @param event {object} clicked cell
     */
    this.cellClicked = function(event){
        event.preventDefault();
        this.boardContainer.uncache();
        this.inputContainer.visible = true;
        this.selectedSegment = event.target.parent;
        if(event.target.parent.children.length > 2)return;
        addCellHighlight(event.target.parent, myApp.props.cellSize);
    };

    /**
     * Handler for when a key on the keypad is clicked
     * @memberOf Sudoku
     * @method keyClicked
     * @param event {object} clicked cell
     */
    this.keyClicked = function(event){
        event.preventDefault();
        if(this.selectedSegment.value < 1) {
            this.inputCount ++;
        }
        if(this.inputCount === this.userCells.length){
            this.createPopUp("All cells filled.", 'check!', this.checkSoloution.bind(this));
        }
        this.inputContainer.visible = false;
        this.selectedSegment.value = this.selectedSegment.getChildAt(1).text = event.target.value;
        removeCellHighlight(this.selectedSegment);
        this.boardContainer.cache(0,0,this.boardContainer.width, this.boardContainer.height);
    };

    /**
     * Callback from key clicked that removes user input frpom an empty cell.
     * @memberOf Sudoku
     * @method clearCell
     * @param event {object} clicked cell
     */
    this.clearCell = function (event) {
        event.preventDefault();
        if(this.selectedSegment.value > 0){this.inputCount--;}
        this.inputContainer.visible = false;
        this.selectedSegment.value = 0;
        this.selectedSegment.getChildAt(1).text = "";
        removeCellHighlight(this.selectedSegment);
    };

    /**
     * Callback called when all empty cells have a value
     * @memberOf Sudoku
     * @method checkSoloution
     */
    this.checkSoloution = function () {
        var error = 0;
        for(var i = 0; i < this.userCells.length; i++) {
            var cell = this.userCells[i];
            if(cell.value === 0) continue;
            checkRow(cell, this.grid);
            checkCol(cell, this.grid);
            checkGrid(cell, this.grid);
            if(!cell.segmentData.isRowValid || !cell.segmentData.isColValid || !cell.segmentData.isGridValid){
                error ++;
            }
        }
        this.removePopup();
        if(error > 0) {
            highlightSoloution(this.userCells, myApp.theme);
        } else {
            this.createPopUp("Session complete.\nWow you are amazing.", 'go again?', this.restart.bind(this));
        }
        this.boardContainer.uncache();
        this.boardContainer.cache(0,0,this.boardContainer.width, this.boardContainer.height);
    };

    /**
     * Callback from notification that triggers when all cells have been filled correctly
     * @memberOf Sudoku
     * @method restart
     */
    this.restart = function () {
        this.destroy();
        myApp.puzzle.init();
        myApp.menu.init();
    };

    /**
     * Remove all containers from the game stage when the game has ended.
     * @memberOf Sudoku
     * @method destroy
     */
    this.destroy = function () {
        this.stage.removeChild(this.boardContainer, this.inputContainer, this.popup);
    };

    /**
     * Check the cell values in a particular row.
     * @memberOf Sudoku
     * @method checkRow
     * @param userCell {object} the cell we want to use for checking
     * @param grid {object} a copy of the grid
     */
    function checkRow (userCell, grid) {
        var row = userCell.segmentData.row;
        for(var col = 0; col < 9; col ++) {
            var gridItem = grid[row][col];
            if(userCell.id === gridItem.id || gridItem.value === 0) continue;
            if(parseInt(userCell.value) === gridItem.value){
                userCell.segmentData.isRowValid = false;
                return;
            } else {
                userCell.segmentData.isRowValid = true;
            }
        }
    }

    /**
     * Check the cell values in a particular col
     * @memberOf Sudoku
     * @method checkCol
     * @param userCell {object} the cell we want to use for checking
     * @param grid {object} a copy of the grid
     */
    function checkCol (userCell, grid) {
        var col = userCell.segmentData.col;
        for(var row = 0; row < 9; row ++) {
            var gridItem = grid[row][col];
            if(userCell.id === gridItem.id || gridItem.value === 0) continue;
            if(parseInt(userCell.value) === gridItem.value){
                userCell.segmentData.isColValid = false;
                return;
            } else {
                userCell.segmentData.isColValid = true;
            }
        }
    }

    /**
     * Check the cell values in a particular 3x3 grid
     * @memberOf Sudoku
     * @method checkGrid
     * @param userCell object the cell we want to use for checking
     * @param grid a copy of the grid
     */
    function checkGrid (userCell, grid) {
        var col = userCell.segmentData.col, row =  userCell.segmentData.row;
        var minCol, maxCol, minRow, maxRow;
        if(col < 3) { minCol = 0; maxCol = 3}
        if(col > 2 && col < 6) { minCol = 3; maxCol = 6}
        if(col > 5 && col < 9) { minCol = 6; maxCol = 9}
        if(row < 3) { minRow = 0; maxRow = 3}
        if(row > 2 && row < 6) { minRow = 3; maxRow = 6}
        if(row > 5 && row < 9) { minRow = 6; maxRow = 9}

        /*
        for all the items in the grid that have the same grid index as the userCell, check for duplicate values.
        var gridRow = Math.floor(row/3);
        var gridCol = Math.floor(col/3);
        var gridIndex = gridRow * 3 + gridCol;
         */

        for (var i = minRow; i < maxRow; i++){
            for(var j = minCol; j < maxCol; j++){
                var gridItem = grid[i][j];
                if(userCell.id === gridItem.id || gridItem.value === 0) continue;
                if(parseInt(userCell.value) === gridItem.value){
                    userCell.segmentData.isGridValid = false;
                    return;
                } else {
                    userCell.segmentData.isGridValid = true;
                }
            }
        }
    }

    /**
     * Highlight correct/ incorrect cells when all empty cells have been filled.
     * @memberOf Sudoku
     * @method highlightSoloution
     * @param cells {object} a copy of the user selected cells
     * @param color {int} the colour to highlight the user selected cell text
     */
    function highlightSoloution (cells, color) {
        for(var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            var data = cell.segmentData;
            cell.getChildAt(1).color = (data.isRowValid && data.isColValid && data.isGridValid) ? color.txt : color.txtError;
        }
    }

    /**
     * Common function for creating a button used in popup notification.
     * @memberOf Sudoku
     * @method createButton
     * @param settings {object} properties for the button
     * @return {*} {object} the easel js button
     */
    function createButton(settings) {
        var container = new createjs.Container();
        container.x = settings.x;
        container.y = settings.y;
        container.width = settings.width;
        container.height = settings.height;
        var btn = new createjs.Shape();
        btn.graphics.beginFill(settings.bgColor).drawRoundRect(0,0, container.width, container.height, container.height/2);
        var text = createText(settings.str, settings.txtColor, container.width/2, settings.fontSize/2, settings.fontSize);
        container.addChild(btn, text);
        return container
    }

    /**
     * Common function for creating a text field used in popup notification.
     * @memberOf Sudoku
     * @method createText
     * @param string {string} The text
     * @param colour {int} The colour of the text
     * @param x {int} x postion of the text
     * @param y {int} y position of the text
     * @param fontSize {int} the size of the font
     * @return {*} {object} the easel js text
     */
    function createText (string, colour, x, y, fontSize) {
        var g = new createjs.Text();
        g.text = string;
        g.color = colour;
        g.font = 'bold ' + fontSize + 'px headers';
        g.textAlign = 'center';
        g.x = x;
        g.y = y;
        return g;
    }

    /**
     * Method for indicating a selected cell.
     * @memberOf Sudoku
     * @method addCellHighlight
     * @param cell
     * @param size
     */
    function addCellHighlight (cell, size) {
        var rect = new createjs.Shape();
        rect.graphics.beginFill("#000").drawRect(0,0, size, size);
        rect.alpha = 0.5;
        cell.addChild(rect);
    }

    /**
     * Method for removing an indicated selected cell.
     * @private
     * @memberOf Sudoku
     * @method removeCellHighlight
     * @param cell
     */
    function removeCellHighlight (cell) {
        var highlight = cell.getChildAt(2);
        cell.removeChild(highlight);
    }
};

