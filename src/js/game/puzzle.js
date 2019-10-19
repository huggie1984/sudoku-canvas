/**
 * @class Puzzle
 * @constructor
 */
myApp.Puzzle = function(){

    this.init = function() {
        this.puzzle = [];
        this.values = [1,2,3,4,5,6,7,8,9];
        this.createPuzzle();
        while (this.values.length > 0){
            this.populatePuzzle(this.values.shift());
        }
    };

    /**
     * Remove cells values from the solution.
     * @memberOf Puzzle
     * @method setDifficulty
     * @param difficulty
     */
    this.setDifficulty = function (difficulty) {
        while(difficulty > 0) {
            var row = Math.floor(Math.random() * 9);
            var col = Math.floor(Math.random() * 9);
            var cell = this.puzzle[row][col];
            if(this.puzzle[row][col].value === 0) continue;
            this.puzzle[row][col].value = 0;
            difficulty --
        }

    };

    /**
     * Generate 2d array of elements for sudoku game.
     * @memberOf Puzzle
     * @method createPuzzle
     */
    this.createPuzzle = function () {
        for (var row = 0; row < 9; row++) {
            this.puzzle.push([]);
            for (var col = 0; col < 9; col++) {
                var gridRow = Math.floor(row/3);
                var gridCol = Math.floor(col/3);
                var gridIndex = gridRow * 3 + gridCol;
                this.puzzle[row].push({row:row, col:col, grid:gridIndex, value:0});
            }
        }
    };

    /**
     * Loop through each 3x3 grid.
     * Assign the value to each cell if the col and row don't have the value.
     * If all cells have been checked and there is no available cell use back tracking algorithm.
     * @memberOf Puzzle
     * @method populatePuzzle
     * @param value
     */
    this.populatePuzzle = function (value) {
        var _gridsRef = gridRef(this.puzzle);

        for (var g = 0; g < 9; g++){
            var loop = true;
            var elements = [0,1,2,3,4,5,6,7,8];

            while(loop){
                var exhaustedAllElements = (elements.length === 0);
                if(exhaustedAllElements){
                    return this.backTrack(value);
                }
                var element = elements[Math.floor(Math.random()*elements.length)];
                var item = _gridsRef[g][element];
                var index = elements.indexOf(element);
                if(item.value > 0){
                    elements.splice(index,1);
                    continue;
                }
                var rowValid = isRowValid(item.row, value, this.puzzle);
                var colValid = isColValid(item.col, value, this.puzzle);
                if(rowValid && colValid) {
                    this.puzzle[item.row][item.col].value = value;
                    loop = false;
                } else {
                    elements.splice(index,1);
                }
            }
        }
    };

    /**
     * Check the grid for all current and previous values and replace them with 0.
     * Insert the values back into the values array.
     * @memberOf Puzzle
     * @method backTrack
     * @param value
     */
    this.backTrack = function (value) {
        var currentValue = value, previousValue = value-1;
        for (var row = 0; row < this.puzzle.length; row ++) {
            for(var col = 0; col < this.puzzle[row].length; col++){
                if (this.puzzle[row][col].value !== currentValue && this.puzzle[row][col].value !== previousValue) continue;
                    this.puzzle[row][col].value = 0;
            }
        }
        this.values.unshift(previousValue, currentValue);
    };

    /**
     * Make a reference to all the grids in the puzzle for creating the solution.
     * @memberOf Puzzle
     * @method gridRef
     * @param puzzle the 2d puzzle
     * @return {array} 3x3 grid array of the puzzle
     */
    function gridRef(puzzle) {
        var _gridsRef = [[],[],[], [],[],[], [],[],[]];
        for(var r = 0; r < 9; r ++){
            for (var c = 0; c < 9; c++){
                var gridRow = Math.floor(r/3);
                var gridCol = Math.floor(c/3);
                var gridIndex = gridRow * 3 + gridCol;
                _gridsRef[gridIndex].push(puzzle[r][c]);
            }
        }
        return _gridsRef;
    }

    /**
     * Check if the selected row has a conflicting value
     * @memberOf Puzzle
     * @method isRowValid
     * @param row the row the check
     * @param value the current value to check
     * @param puzzle the 2d puzzle array
     * @return {boolean}
     */
    function isRowValid(row, value, puzzle) {
        for(var c = 0; c < 9; c++){
            if(value === puzzle[row][c].value) return false;
        }
        return true
    }

    /**
     * Check if the selected col has a conflicting value
     * @memberOf Puzzle
     * @method isColValid
     * @param col the row the check
     * @param value the current value to check
     * @param puzzle the 2d puzzle array
     * @return {boolean}
     */
    function isColValid(col, value, puzzle) {
        for(var r = 0; r < 9; r++){
            if(value === puzzle[r][col].value) return false;
        }
        return true
    }

    this.debug = function() {
        var debug = [];
        for(var r = 0; r < 9; r ++) {
            debug.push([]);
            for(var c = 0; c < 9; c++) {
                debug[r].push(this.puzzle[r][c].value);
            }
        }
        console.log(debug);
        return debug;
    };
};
