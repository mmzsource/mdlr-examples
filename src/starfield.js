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
  
  // config parameters
  const nrOfStars = 100;
  const speedup = 10;

  const stars = [];

  function generateRandom(min, max) {
    let num = Math.random() * (max - min + 1) + min;
    return (num === 0) ? generateRandom(min, max) : num;
  }

  function star() {
    let angle = generateRandom(0, 2 * Math.PI);
    let distance = generateRandom(0, Math.min(canvasWidth * 0.5, canvasHeight * 0.5));
    // middle of canvas is the reference point for star generation
    let x = canvasWidth * 0.5 + Math.cos(angle) * distance; 
    let y = canvasHeight * 0.5 + Math.sin(angle) * distance;
    let speed = generateRandom(0.001, 0.1);
    return {x: x, y: y, angle: angle, speed: speed}
  }


  function movesOffCanvas(star){
    return star.x <= 0 || star.x >= canvasWidth || star.y <= 0 || star.y >= canvasHeight;
  }


  function starUpdater() {
    for (let i = 0; i < nrOfStars; i++) {
      if (movesOffCanvas(stars[i])) {
        stars[i] = star();
      }
      stars[i].x = stars[i].x + stars[i].speed * Math.cos(stars[i].angle);
      stars[i].y = stars[i].y + stars[i].speed * Math.sin(stars[i].angle);
      stars[i].speed = stars[i].speed + 0.01 * speedup;
    }
  }

  function drawCircle(star) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, 1, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }
 
  function animate() {
    ctx.fillStyle = '#00000042' // use alpha for star-tail
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    requestAnimationFrame(animate);
    starUpdater();
    stars.map(drawCircle)
  }

  function init(){
    for (let i = 0; i < nrOfStars; i++){
      stars.push(star());
    }
  }

  init();

  requestAnimationFrame(animate);

})

mdlr('canvas');
