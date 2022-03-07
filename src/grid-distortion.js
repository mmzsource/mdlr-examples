mdlr('mmzsource:grid-distortion', m => {

  const style = `width:100vw; height:100vh;`;
  const doc = document.body;
  doc.innerHTML = `<canvas width=512 height=512 style="${style}"></canvas>`;
  doc.style.margin = "0";
  doc.style.overflow = "hidden";

  const canvas = doc.querySelector('canvas');
  const { width: canvasWidth, height: canvasHeight } = canvas;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  
  // grid has cols, rows and cells
  const nrOfCols = 64;
  const nrOfRows = 64;
  const colWidth = canvasWidth / nrOfCols + 1;
  const rowHeight = canvasHeight / nrOfRows + 1;
  const fadeFactor = 0.98;
  const gridDistortion = 0.25;
  const dotsOn = true; 

  const points = new Map();
  const dots = [];

  function distortionFactor() {
    return Math.random() * 2 * gridDistortion - gridDistortion;
  }

  /*
    Create a map where the keys represent the xu,yu 'unit'
    and the value holds the actual x,y coordinate.
    The xu,yu unit [0,0] represents the top left point.
    The xu,yu unit [1,0] represents the point right of the top left point.
    The xu,yu unit [0,1] represents the point below the top left point. 
  */
  function init() {
    for (let x = 0; x < nrOfCols + 1; x++){
      for (let y = 0; y < nrOfRows + 1; y++) {
        // Introduce griddistortion
        let colDistortion = colWidth * distortionFactor();
        let rowDistortion = rowHeight * distortionFactor();
        points.set(
          JSON.stringify({xu: x, yu: y}), 
          {x: x*colWidth - colWidth + colDistortion, 
           y: y*rowHeight - rowHeight + rowDistortion})
          let dotX = x * colWidth + (1 + distortionFactor()) * colWidth * 0.5;
          let dotY = y * rowHeight + (1 + distortionFactor()) * rowHeight * 0.5;
          dots.push({x: dotX, y: dotY})
      }
    }
  } 
  
  init();

  function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 1 + distortionFactor(), 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }

  function drawLine(p1, p2) {
    let maxLineWidth = 2;
    ctx.lineWidth = 1
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // map a point p in a range from a1 to a2
  // into a range from b1 to b2 (linearly)
  function mapRange(p, a1, a2, b1, b2) {
    return (b1 + ((p - a1) * (b2 - b1)) / (a2 - a1));
  }

  function animate() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let x = 0; x < nrOfCols; x++){
      for (let y = 0; y < nrOfRows; y++){
        let pu = {xu: x, yu: y};
        let p = points.get(JSON.stringify({xu: x, yu: y}));
        let pr = points.get(JSON.stringify({xu: x + 1, yu: y}));
        let pb = points.get(JSON.stringify({xu: x, yu: y + 1}));
        // the further along the y-axis, the smaller chance the line will be drawn
        if(Math.random() > mapRange(p.y, 0, canvasHeight, 0, fadeFactor)){
          drawLine(p, pr);
        } 
        if(Math.random() > mapRange(p.y, 0, canvasHeight, 0, fadeFactor)){
          drawLine(p, pb);
        }
      }
    }

    for (let i = 0; i < dots.length; i++){
      let dot = dots[i];
      if(dotsOn && Math.random() > mapRange(dot.y, 0, canvasHeight, 0, fadeFactor)){
        drawCircle(dot.x, dot.y);
      }
    }
  }

  requestAnimationFrame(animate);

})

mdlr('mmzsource:grid-distortion');
