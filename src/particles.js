// tested on https://github.com/mmzsource/mdlr-js/tree/e0b6ef12e9a3d4c46344dbcdb8171125c03db95e
mdlr('canvas', m => {

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
  const pSize = 4;
  const maxPs = 64;
  const threshold = 100;
  const speed = 2.5;

  // create maxPs
  for (let i = 0; i < maxPs; i++) {
    let p = {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: Math.random() * speed,
      vy: Math.random() * speed
    }
    ps.push(p);
  }

  function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
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

  function animate() {

    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < maxPs; i++) {

      let p1 = ps[i];
      drawCircle(ctx, p1.x, p1.y, 2, 'white', 'white', 1);

      // lines
      for (let j = 0; j < maxPs; j++) {

        let p2 = ps[j];
        let d = distance(p1, p2);

        if (d < threshold) {

          let maxLineWidth = 2;
          ctx.lineWidth = mapRange(d, 0, threshold, maxLineWidth, 0);
          ctx.strokeStyle = 'white';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

        }
      }

      // move
      p1.x = p1.x + p1.vx;
      p1.y = p1.y + p1.vy;

      // bounce
      if (p1.x < 0 || p1.x > canvasWidth) {p1.vx = -p1.vx};
      if (p1.y < 0 || p1.y > canvasHeight) {p1.vy = -p1.vy};

    }
  }

  requestAnimationFrame(animate);

})

mdlr('canvas');
