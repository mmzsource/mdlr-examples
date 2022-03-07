mdlr('mmzsource:particles', m => {

  const style = `width:100vw; height:100vh;`;

  const doc = document.body;

  doc.innerHTML = `<canvas width=512 height=512 style="${style}"></canvas>`;
  doc.style.margin = "0";
  doc.style.overflow = "hidden";

  const canvas = doc.querySelector('canvas');
  const { width: canvasWidth, height: canvasHeight } = canvas;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';

  // particles
  const ps = [];
  const maxPs = 64;
  const threshold = 100;
  const speed = 2.5;
  const ghostFactor = 0; // 0 = no ghosts, 1 = only ghosts

  // create maxPs
  for (let i = 0; i < maxPs; i++) {
    let p = {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: Math.random() * speed,
      vy: Math.random() * speed,
      ghost: (Math.random() < ghostFactor)
    }
    ps.push(p);
  }

  function drawCircle(x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }

  // map a point p in a range from a1 to a2
  // into a range from b1 to b2 (linearly)
  function mapRange(p, a1, a2, b1, b2) {
    return (b1 + ((p - a1) * (b2 - b1)) / (a2 - a1));
  }

  function distance(p1, p2) {
    let dx2 = Math.pow(Math.abs(p2.x - p1.x), 2);
    let dy2 = Math.pow(Math.abs(p2.y - p1.y), 2);
    return Math.sqrt(dy2 + dx2);
  }

  function drawLine(d, p1, p2) {
    let maxLineWidth = 2;
    ctx.lineWidth = mapRange(d, 0, threshold, maxLineWidth, 0);
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function drawLines(p1) {
    for (let j = 0; j < maxPs; j++) {
      let p2 = ps[j];
      let d = distance(p1, p2);

      if (d < threshold) {
        drawLine(d, p1, p2);
      }
    }
  }

  function move(p){
    p.x = p.x + p.vx;
    p.y = p.y + p.vy;
  }

  function bounce(p) {
    if (p.x < 0 || p.x > canvasWidth) {p.vx = -p.vx}
    if (p.y < 0 || p.y > canvasHeight) {p.vy = -p.vy}
  }

  function animate() {

    requestAnimationFrame(animate);


    if (ghostFactor !== 0) {
      // alpha blending; ff = max blending, 00 = no blending
      ctx.fillStyle = '#00000042'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
      ctx.clearRect(0,0,canvasWidth, canvasHeight);
    }
    for (let i = 0; i < maxPs; i++) {
      let p1 = ps[i];
      if (p1.ghost == false) {
        drawCircle(p1.x, p1.y, 2, 'white', 'white', 1);
        drawLines(p1);
      }
      move(p1);
      bounce(p1);
    }
  }

  requestAnimationFrame(animate);

})

mdlr('mmzsource:particles');
