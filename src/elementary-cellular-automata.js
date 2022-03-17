mdlr('mmzsource:ca-1d', m => {

  const style = `width:100vw; height:100vh;`;
  const doc = document.body;
  doc.innerHTML = `<canvas width=512 height=512 style="${style}"></canvas>`;
  doc.style.margin = "0";
  doc.style.overflow = "hidden";

  const canvas = doc.querySelector('canvas');
  const { width: canvasWidth, height: canvasHeight } = canvas;
  const ctx = canvas.getContext('2d');

  // configure visualisation
  const nrOfCols = 256;
  const nrOfRows = 256;
  const slowDownFactor = 1;
  const caRuleNr = 30; // 0 .. 255 
  
  /*
    There are 256 different rules: 0 .. 255. 
    These rules define the way the next generation is calculated. See:
    https://en.wikipedia.org/wiki/Elementary_cellular_automaton#The_numbering_system
    some interesting rules: 18, 22, 30, 45, 54, 90, 105, 106, 110, 122, 126, 146, 150
  */
  
  let rm = ruleMap();
  let slowDownCount = 0; // admin for slowdown
  let currentRowNr = 0; // admin for CA generation
  const cellWidth = canvasWidth / nrOfCols;
  const cellHeight = canvasHeight / nrOfRows;

  /*
    The rule map key represents the status of a cell and its 2 neighbours.
    It maps that triplet of cell states to the state of the center cell
    in the next generation via the rule which is represented as a binary
    string 8 characters long.

    So, for instance, rule 30 converts to the binary string 00011110. This
    results in this map:
    {'111' -> '0', '110' -> '0', '101' -> '0', '100' -> '1'
     '011' -> '1', '010' -> '1', '001' -> '1', '000' -> '0'}

    With that rulemap, we can calculate the next generation of a cell given
    the status of the cell and its neighbors. So for instance if the center 
    cell is 'off' and both its neighbors are 'on' ('101'), we can see in 
    the rulemap that the next generation of the cell is 'off'. However, if 
    the center cell is 'on' and its neighbors are 'off' ('010') the map 
    tells us the next state of the center cell is 'on' (or 'alive').
  */
  function ruleMap() {
    let ks = ['111', '110', '101', '100', '011', '010', '001', '000'];
    let vs = caRuleNr.toString(2).padStart(8, '0');
    let rm = new Map();
    for (let i = 0; i < ks.length; i++){
      rm.set(ks[i], vs[i])
    }
    return rm;
  }

  /*
    splits a one dimensional collection of 'cells'
    (with its ends wrapped around in a circle)
    into 'triplets' which represent a cell and its 2 neighbours

    requires a string representing at least 3 bits
    will return an array of 'triplets' like this (without the spaces between the bits):
    "b1 b2 b3... bn" -> ["bn b1 b2" "b1 b2 b3" "b2 b3 .." "b3 .. .." ".. .. bn" ".. bn b1"]
  */
  function triplets(g) {
    let firstBit = g.substr(0,1);
    let lastBit = g.substr(-1,1);
    let firstTriplet = lastBit.concat(g.substr(0,2))
    let lastTriplet = g.substr(-2, 2).concat(firstBit);
    let triplets = [];
    triplets.push(firstTriplet);
    for (i = 0; i < g.length - 2; i++) {
      triplets.push(g.substr(i, 3))
    }
    triplets.push(lastTriplet);
    return triplets;
  }

  function firstGeneration() {
    let chars = [];
    Array.from({length: nrOfCols}, 
      function(){
        if (Math.random() < 0.5) {
          chars.push('0');
        } else {
          chars.push('1');
        }}
    );
    return chars.join("");
  }

  let generation = firstGeneration();

  function fillCell(cellx, celly) {
    ctx.fillStyle = 'green';
    ctx.fillRect(cellx, celly, cellWidth, cellHeight);
  }

  function drawCells(generationAsString, rowNr){
    for (let colNr = 0; colNr < generationAsString.length; colNr++) {
      if (generationAsString[colNr] === "1") {
        let cellx = colNr * cellWidth;
        let celly = rowNr * cellHeight;
        fillCell(cellx, celly);
      }
    }
  }

  function mapRule(gen) {
    let tr = triplets(gen);
    let nextGenCells = [];
    for (let i = 0; i < tr.length; i++){
      nextGenCells.push(rm.get(tr[i]));
    }
    return nextGenCells.join('');
  }

  function animate() {

  requestAnimationFrame(animate);

    // slow down game loop
    if (++slowDownCount < slowDownFactor) {
      return;
    }

    slowDownCount = 0;
  
    if (currentRowNr >= nrOfRows){ 
      // reached the end row, current screen must move one row up to make room
      // for the new row 
      currentRowNr = nrOfRows - 1;
      let imgData = ctx.getImageData(0, cellHeight, canvasWidth, canvasHeight);
      ctx.putImageData(imgData, 0, 0);
    }

    drawCells(generation, currentRowNr);
    let nextGen = mapRule(generation);
    generation = nextGen;
    currentRowNr++;
  }

  requestAnimationFrame(animate);

})

mdlr('mmzsource:ca-1d');
