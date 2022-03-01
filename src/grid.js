mdlr('mmzsource:grid', m => {

  const style = `width:100vw; height:100vh;`;
  const doc = document.body;
  doc.innerHTML = `<canvas width=512 height=512 style="${style}"></canvas>`;
  doc.style.margin = "0";
  doc.style.overflow = "hidden";

  const canvas = doc.querySelector('canvas');
  const { width: canvasWidth, height: canvasHeight } = canvas;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';

  // grid has cols & rows
  const nrOfCols = 4;
  const nrOfRows = 4;
  const grid = [];

  // specify the cell numbers (one-based counting) that should be filled
  const cellsToFill = [2, 11, 6, 16, 4, 9, 30];

  const cellWidth = canvasWidth / nrOfCols;
  const cellHeight = canvasHeight / nrOfRows;

  // 1 based index, columns and rows
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
    // cell middle x&y
    let cmx = csx + cellWidth * 0.5;
    let cmy = csy + cellHeight * 0.5;
    return {csx: csx, csy: csy, cmx: cmx, cmy: cmy};
  }

  function drawCell(cell){
    let {csx, csy, cmx, cmy} = cellCoords(cell);
    let fontSize = (cmx - csx) / 2;
    ctx.font = fontSize +"px Arial";
    ctx.textAlign = "center";
    ctx.fillText(cell.idx, cmx, cmy + fontSize * 0.5);
    ctx.strokeStyle = 'red';
    ctx.strokeWidth = 1;
    ctx.strokeRect(csx, csy, cellWidth, cellHeight);
  }

  function fillCell(cell) {
    let {csx, csy} = cellCoords(cell);
    ctx.fillStyle = 'green';
    ctx.fillRect(csx, csy, cellWidth, cellHeight);
  }

  function getCell(index) {
    return grid[--index]
  }

  function fillCells(indexes) {
    indexes.map(getCell).map(fillCell)
  }

  function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    grid.map(drawCell);
    fillCells(cellsToFill);
  }

  requestAnimationFrame(animate);

})

mdlr('mmzsource:grid');
