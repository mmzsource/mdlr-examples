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

  const maxPs = 64;      // max nr of particles
  const threshold = 100; // threshold distance between particles at which a line should be drawn
  const speed = 2.5;     // speed of movement; adapt to your environment and preference
  const ghostFactor = 0; // 0 = no ghosts, 1 = only ghosts

  function particle(){
    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: Math.random() * speed,
      vy: Math.random() * speed,
      ghost: (Math.random() < ghostFactor)
    }
  }

  const ps = Array.from({length: maxPs}, particle);

  function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }

  // map a point p in a range from a1 to a2
  // into a range from b1 to b2 (linearly)
  function mapRange(p, a1, a2, b1, b2) {
    return (b1 + ((p - a1) * (b2 - b1)) / (a2 - a1));
  }

  function distance(p1, p2) {
    let dx2 = Math.pow((p2.x - p1.x), 2);
    let dy2 = Math.pow((p2.y - p1.y), 2);
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
    ps.forEach(p2 => {
      let d = distance(p1, p2);
      if (d < threshold) {
        drawLine(d, p1, p2);
      }
    });
  }

  function move(p){
    p.x = p.x + p.vx;
    p.y = p.y + p.vy;
  }

  function bounce(p) {
    if (p.x < 0 || p.x > canvasWidth) {p.vx = -p.vx}
    if (p.y < 0 || p.y > canvasHeight) {p.vy = -p.vy}
  }

  function clearFrame(){
    if (ghostFactor !== 0) {
      // alpha blending; ff = max blending, 00 = no blending
      ctx.fillStyle = '#00000042'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    } else {
      ctx.clearRect(0,0,canvasWidth, canvasHeight);
    }  
  }

  function drawFrame(){
    ps.forEach(p => {
      if (p.ghost == false){
        drawCircle(p.x, p.y);
        drawLines(p);
      }
      move(p);
      bounce(p);
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    clearFrame();
    drawFrame();
  }

  requestAnimationFrame(animate);

})

mdlr('mmzsource:particles');
