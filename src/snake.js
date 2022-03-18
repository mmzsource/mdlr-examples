mdlr('mmzsource:snake', m => {

  const style = `width:100vw; height:100vh;`;
  const doc = document.body;
  doc.innerHTML = `<canvas width=512 height=512 style="${style}"></canvas>`;
  doc.style.margin = "0";
  doc.style.overflow = "hidden";

  const canvas = doc.querySelector('canvas');
  const { width: canvasWidth, height: canvasHeight } = canvas;
  const ctx = canvas.getContext('2d');

  // configure game
  const nrOfCols = 32;
  const nrOfRows = 32;
  const slowDownFactor = 6;

  // debug mode
  const showCellNrs = false;
  const showCellBorders = false;
  const moveWithSpace = false;

  const grid = [];
  let count = 0; // for game slowdown
  const cellWidth = canvasWidth / nrOfCols;
  const cellHeight = canvasHeight / nrOfRows;
  let score = 0;
  let highscore = 0;
  let commands = [];

  // Input zero-based index and 
  // return one-based cell
  function makeCell(index) {
    let row = Math.floor(index / nrOfCols) + 1;
    let col = (index % nrOfCols) + 1;
    return {idx: ++index, col: col, row: row}
  }

  function init(){
    let nrOfCells = nrOfCols * nrOfRows;
    for (let i = 0; i < nrOfCells; i++){
      grid.push(makeCell(i));
    }
  }

  init();

    /*

      Most functions above this comment 'reason' in rows and columns
      from a zero based counting perspective.

      The functions below this comment reason in cells or indexes of cells,
      where the indexes start at 1 (top left corner of the grid)

    */

  function cellCoords(cell) {
    // cell start x&y
    let csx = cellWidth * cell.col - cellWidth;
    let csy = cellHeight * cell.row - cellHeight;
    // cell middle x&y (for displaying cell indexes in the game)
    let cmx = csx + cellWidth * 0.5;
    let cmy = csy + cellHeight * 0.5;
    return {csx: csx, csy: csy, cmx: cmx, cmy: cmy};
  }

  function debugCell(cell){
    let {csx, csy} = cellCoords(cell);

    if (showCellNrs) {
      drawCell(cell, cell.idx, "center", "lightblue")
    }
    
    if (showCellBorders) {
      ctx.strokeStyle = 'red';
      ctx.strokeWidth = 1;
      ctx.strokeRect(csx, csy, cellWidth, cellHeight);
    }
  }

  function drawCell(cell, text, align, color){
      let {csx, cmx, cmy} = cellCoords(cell);
      let fontSize = (cmx - csx) / 1.2;
      ctx.font = fontSize +"px Arial";
      ctx.textAlign = align;
      ctx.fillStyle = color;
      ctx.fillText(text, cmx, cmy + fontSize * 0.5);
  }

  function fillCell(cell, color) {
    let {csx, csy} = cellCoords(cell);
    ctx.fillStyle = color;
    ctx.fillRect(csx, csy, cellWidth, cellHeight);
  }

  function getCell(index) {
    return grid[--index]
  }

  function fillCells(indexes, color) {
    for (let i = 0; i < indexes.length; i++) {
      let c = getCell(indexes[i]);
      fillCell(c, color);
    }
  }

  function range(min, max) {
    let result = [];
    for (let i = min; i <= max; i++) {
      result.push(i);
    }
    return result;
  }

  // one-based counting
  function idxsOfNthRow(n) {
    let firstIdx = (n - 1) * nrOfCols + 1;
    let lastIdx = n * nrOfCols;
    return range(firstIdx, lastIdx);
  }

  // one-based counting
  function idxsOfNthCol(n) {
    let firstIdx = n
    let lastIdx = firstIdx + nrOfCols * (nrOfRows - 1);
    let result = [];
    for (let i = firstIdx; i <= lastIdx; i = i + nrOfCols){
      result.push(i);
    }
    return result;
  }

  function walls(northRow, eastCol, southRow, westCol) {
    let northWall = idxsOfNthRow(northRow);
    let eastWall = idxsOfNthCol(eastCol);
    let southWall = idxsOfNthRow(southRow);
    let westWall = idxsOfNthCol(westCol);
    return [].concat.apply([], [northWall, eastWall, southWall, westWall]);
  }

  const innerWall = walls(2, nrOfCols - 1, nrOfRows - 1, 2);
  const outerWall = walls(1, 1, nrOfRows, nrOfCols);

  function createSnake() {
    let snakeHeadIdx = 3 * nrOfCols + 7
    let snakeTailIdx = snakeHeadIdx - 3
    return {head: snakeHeadIdx,
            body: range(snakeTailIdx, snakeHeadIdx),
            dx: 1,
            dy: 0,
            color: 'green'}
  }

  let snake = createSnake();

  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createApple(){ 
    let rndCol = randomInt(3, nrOfCols - 2);
    let rndRow = randomInt(3, nrOfRows - 2);
    let rndIdx = (rndRow - 1) * nrOfCols + rndCol;
    if (snake.body.includes(rndIdx)) {
      return createApple();
    }
    return makeCell(--rndIdx) // makeCell needs zero-based indexes
  }

  let apple = createApple();

  function crashIntoWall(headIndex) {
    return innerWall.includes(headIndex);
  }

  function eatsApple(headIndex) {
    return headIndex === apple.idx;
  }

  function eatsItself(headIndex) {
    return snake.body.includes(headIndex);
  }

  function drawScores() {
    if (highscore > 0){
      drawCell(makeCell(3), "HIGHSCORE: " + highscore, "left", "yellow");
    }
    drawCell(makeCell(nrOfCols - 6), "SCORE: " + score, "left", "yellow");
  }

  function move() {
    if (commands.length > 0){
      let cmd = commands.shift();
      snake.dx = cmd.dx;
      snake.dy = cmd.dy;
    }
    let currentHead = snake.head;
    currentHead = currentHead + snake.dx;
    if (snake.dy !== 0) {
      currentHead = currentHead + snake.dy * nrOfCols;
    }
    snake.head = currentHead;

    if (crashIntoWall(currentHead) || eatsItself(currentHead)) {
      snake = createSnake();
      apple = createApple();
      if (score > highscore) {highscore = score}
      score = 0;
      return;  
    }
 
    snake.body.push(currentHead);

    if (eatsApple(currentHead)) {
      score++
      apple = createApple();
    } else {
      snake.body = snake.body.splice(1);
    }
  }

  function animate() {

  requestAnimationFrame(animate);

    // slow down game loop
    if (++count < slowDownFactor) {
      return;
    }

    count = 0;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    fillCells(innerWall, 'white');
    fillCells(outerWall, 'black');

    if (!moveWithSpace) {
      move();
    }

    fillCell(apple, 'red')
    fillCells(snake.body, snake.color);

    if (showCellBorders || showCellNrs){
      grid.map(debugCell);
    } else {
      drawScores();
    }
  }

  

  // listen to keyboard events to move the snake
  document.addEventListener('keydown', function(e) {
  
    // console.log(e.code + ' ' + e.keyCode)

    // prevent snake from backtracking on itself by checking that it's
    // not already moving on the same axis (pressing left while moving
    // left won't do anything, and pressing right while moving left
    // shouldn't let you collide with your own body)

    // space bar
    if (e.which === 32 && moveWithSpace) {
      move();
    }
    // left arrow key
    else if (e.which === 37 && snake.dx === 0) {
      commands.push({dx: -1, dy: 0})
    }
    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
      commands.push({dx: 0, dy: -1})
    }
    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
      commands.push({dx: 1, dy: 0})
    }
    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
      commands.push({dx: 0, dy: 1})
    }
  });

  requestAnimationFrame(animate);

})

mdlr('mmzsource:snake');

