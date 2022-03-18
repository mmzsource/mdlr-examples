mdlr('mmzsource:wavesum', m => {

  const style = `width:100vw; height:100vh;`;

  const doc = document.body;

  doc.innerHTML = `<canvas width=512 height=512 style="${style}"></canvas>`;
  doc.style.margin = "0";
  doc.style.overflow = "hidden";

  const canvas = doc.querySelector('canvas');
  const { width: canvasWidth, height: canvasHeight } = canvas;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';

  const spiralSpeed = 0.5;
  let waveStartX = 192;

  let mainCircle = {}, minorCircle = {}, ccSx = waveStartX, ccPoints = [];

  function init() {
    mainCircle = unitCircle(80, 80, 40, 0.06);
    minorCircle = unitCircle(80, 240, 20, 0.10);
    
    // Check if the sum is correct by commenting above circles and uncommenting below circles
    // mainCircle = unitCircle(80, 80, 40, 0.06);
    // minorCircle = unitCircle(80, 240, 40, -0.06);

    ccSx = waveStartX;
    ccPoints = [];
  }

  init();

  function drawCircle(x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }

  function drawLine(p1, p2, color) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function drawUnitCircle(circle, circleColor, dotColor){
    drawCircle(circle.c.x, circle.c.y, circle.c.r, 'transparent', circleColor, 1);
    drawLine({x: circle.c.x, y: circle.c.y}, {x: circle.d.x, y: circle.d.y}, 'grey')
    drawCircle(circle.d.x, circle.d.y, circle.d.r, dotColor, 'white', 1);
  }

  function circle(x,y,r){return {x: x, y: y, r: r}}

  function unitCircle(x, y, radius, angleSpeed){
    let c = circle(x, y, radius);
    c.a = 0;            // startAngle
    c.as = angleSpeed;
    c.sx = waveStartX;  // spiral X ~ z axis of circle
    let d = circle(x + radius * Math.cos(c.a), y + c.r * Math.sin(c.a), 4);
    c.prev = {x: c.sx, y: d.y};
    c.next = {x: c.sx, y: d.y};
    return {c: c, d: d,
            update: function update(){
                this.c.prev = {x: this.c.sx, y: this.d.y}
                this.c.a = this.c.a - this.c.as;
                this.d.x = this.c.x + this.c.r * Math.cos(this.c.a + this.c.as);
                this.d.y = this.c.y + this.c.r * Math.sin(this.c.a + this.c.as);
                this.c.sx = this.c.sx + spiralSpeed;
                this.c.next = {x: this.c.sx, y: this.d.y}
            }
    }
  }

  function compoundCircle(big, small) {
    let offsetY = 312;
    let bx = big.c.x;
    let by = big.c.y + offsetY;
    let br = big.c.r;
    let ba = big.c.a;
    let sx = bx + br * Math.cos(ba);
    let sy = by + br * Math.sin(ba);
    let sr = small.c.r;
    let sa = small.c.a;
    let dotX = sx + sr * Math.cos(sa);
    let dotY = sy + sr * Math.sin(sa);
    return {offsetY: offsetY, bx: bx, by: by, br: br, ba: ba,
            sx: sx, sy: sy, sr: sr, sa: sa,
            dotX: dotX, dotY: dotY}
  }

  function drawCompoundCircle(cc){
    // big circle + inner line
    drawCircle(cc.bx, cc.by, cc.br, 'transparent', 'white', 1);
    drawLine({x: cc.bx, y: cc.by}, {x: cc.sx, y: cc.sy}, 'grey');
    // small circle + inner line
    drawCircle(cc.sx, cc.sy, cc.sr, 'transparent', 'white', 1);
    drawLine({x: cc.sx, y: cc.sy}, {x: cc.dotX, y: cc.dotY}, 'grey');
    // dot on small circle
    drawCircle(cc.dotX, cc.dotY, 4, 'orange', 'white', 1)
  }

  function animate() {

    requestAnimationFrame(animate);

    ctx.fillStyle = 'black';
    ctx.clearRect(0,0, waveStartX, canvasHeight);

    mainCircle.update();
    drawUnitCircle(mainCircle, 'white', 'yellow');
    drawLine(mainCircle.c.prev, mainCircle.c.next, 'yellow');

    minorCircle.update();
    drawUnitCircle(minorCircle, 'white', 'red');
    drawLine(minorCircle.c.prev, minorCircle.c.next, 'red');

    let cc = compoundCircle(mainCircle, minorCircle);
    drawCompoundCircle(cc);
    if (ccPoints.length >= 2) {
      drawLine(ccPoints[0], ccPoints[1], 'orange');
      ccPoints.shift();
    }
    ccPoints.push({x: ccSx, y: cc.dotY})

    ctx.fillStyle = '#00000003';
    ctx.fillRect(waveStartX, 0, canvasWidth, canvasHeight);

    if (ccSx > canvasWidth) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0,0,canvasWidth, canvasHeight)
      init();
    }
    ccSx = ccSx + spiralSpeed;
  }

  requestAnimationFrame(animate);

})

mdlr('mmzsource:wavesum');
