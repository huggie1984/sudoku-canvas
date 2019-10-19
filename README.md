<h1>Sudoku<br/><small>Canvas</small></h1>
<br/>
An implementation of the popular puzzle game Sudoku.<br/>
The game is built with canvas using createJS libraries.<br/>
I Begun this project using a 2d array of numbers that represent a valid grid of numbers to populate a 9x9 grid.

```javascript
var gridArrasy = [
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}]
];
```
Each object in the array would have the following format:
```javascript
var gridObject = {row: 0, col: 0, grid: 0, value: 1};
```
Next step was checking if the solution the user entered was valid. The rules of sudoku a straight forward.<br/>
You cant repeat the same number in any horizontal, verticle or 3x3 grid so i created methods to check this logic.
<br/>
<br/>
Once the core of the puzzle was built I decided that I would explore the potential of randomly generating a valid 9x9 grid so each time you play you would be presented with a new puzzle.<br/>
This was not as straight forward as i though and after lots of trail and error I used my good friend Google.<br/>
After extensive research I decided to implement a backwards tracking algorithm.<br/>  
With a full 9x9 grid with a valid solution all i now needed to do was remove x amount of values from the grid, the more numbers i remove the harder the puzzle will be.
<h2>Reference</h2>
<ul>
<li><a href="">https://en.wikipedia.org/wiki/Sudoku</a></li>
<li><a href="">https://www.geeksforgeeks.org/backtracking-algorithms/</a></li>
</ul>
