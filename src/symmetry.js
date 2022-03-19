mdlr('mmzsource:symmetry', m => {

  const style = `width:100vw; height:100vh;`;
  const doc = document.body;
  doc.innerHTML = `<canvas width=512 height=512 style="${style}"></canvas>`;
  doc.style.margin = "0";
  doc.style.overflow = "hidden";

  const canvas = doc.querySelector('canvas');
  const { width: canvasWidth, height: canvasHeight } = canvas;
  const ctx = canvas.getContext('2d');

  let n = 0;
  const w = 16, h = 16, dx = w / canvasWidth, dy = h / canvasHeight;
  const image = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

  // Based on and adapted from https://processing.org/examples/graphing2dequation.html
  // Config vars to play with:
  // *speed* (float) determines speed of animation
  // Low speed (~ 0.01) looks nice at the start
  // High speed (~ 10) gives surprising results later
  // *theta factor tf* (int) determines number of rays
  // low tf (< 10) gives nice tribal figures at the start
  // high tf (> 500) results in noise like figures with some regularity
  // The animation can be stopped and started by clicking the animation and pressing the space bar
  // The animation can be reversed by clicking the animation and pressing r (r)everse

  let speed = 0.1;
  let tf = 7;  
  let play = true;

  // map a point p in a range from a1 to a2
  // into a range from b1 to b2 (linearly)
  function mapRange(p, a1, a2, b1, b2) {
    return (b1 + ((p - a1) * (b2 - b1)) / (a2 - a1));
  }

  function animate() {
    let x = -w/2;                                       // Start x at -1 * width / 2
    for (let i = 0; i < canvasWidth; i++) {
      let y = -h/2;                                     // Start y at -1 * height / 2
      for (let j = 0; j < canvasHeight; j++) {
        let r = Math.sqrt(x*x + y*y);                   // cartesian -> polar
        let theta = Math.atan2(y,x);                    // cartesian -> polar
        let val = Math.sin(n*Math.cos(r) + tf * theta); // Results in a value between -1 and 1
        let greyscale = mapRange(val, -1, 1, 0, 255);   // Map val to grayscale value
        let pixel = (i*4)+(j*4*canvasWidth);            // image.data contains flat array of rgba
        image.data[pixel + 0] = greyscale;              // r
        image.data[pixel + 1] = greyscale;              // b
        image.data[pixel + 2] = greyscale;              // g
        image.data[pixel + 3] = 255;                    // a
        y += dy;
      }
      x += dx;
    }
    ctx.putImageData(image, 0, 0);
    if (play) {n+=speed}
    requestAnimationFrame(animate);
  }

  document.addEventListener('keydown', function(e) {
    if (e.which === 32) {play = !play} // space bar
    if (e.which === 82) {speed *= -1}  // r key (r)everse
  })

  requestAnimationFrame(animate);
})

mdlr('mmzsource:symmetry');
