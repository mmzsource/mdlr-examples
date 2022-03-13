mdlr('mmzsource:warpspeed', m => {

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
  const maxStartSize = 0.5;
  const maxSize = 4;

  const canvasCenter = {x: canvasWidth * 0.5, y: canvasHeight * 0.5}

  function generateRandom(min, max) {
    let num = Math.random() * (max - min + 1) + min;
    return (num === 0) ? generateRandom(min, max) : num;
  }

  function star() {
    let angle = generateRandom(0, 2 * Math.PI);
    let dist = generateRandom(0, Math.min(canvasCenter.x, canvasCenter.y));
    // middle of canvas is the reference point for star generation
    let x = canvasCenter.x + Math.cos(angle) * dist; 
    let y = canvasCenter.y + Math.sin(angle) * dist;
    let speed = generateRandom(0.001, 0.1);
    let size = generateRandom(0, maxStartSize);
    return {x: x, y: y, angle: angle, speed: speed, 
            startx: x, starty: y, startSize: size}
  }

  const stars = Array.from({length: nrOfStars}, star);

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

  // map a point p in a range from a1 to a2
  // into a range from b1 to b2 (linearly)
  function mapRange(p, a1, a2, b1, b2) {
    return (b1 + ((p - a1) * (b2 - b1)) / (a2 - a1));
  }

  function distanceFromStart(star) {
    let dx2 = Math.pow(Math.abs(star.x - star.startx), 2);
    let dy2 = Math.pow(Math.abs(star.y - star.starty), 2);
    return Math.sqrt(dy2 + dx2);
  }

  function size(star) {
    let radius = Math.min(canvasWidth, canvasHeight);
    let dist = distanceFromStart(star)
    return mapRange (dist, 0, radius, star.startSize, maxSize);
  }

  function drawCircle(star) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, size(star), 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }
 
  function clearFrame(){
    ctx.fillStyle = '#00000042' // use alpha for star-tail
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  function drawFrame(){
    starUpdater();
    stars.map(drawCircle)
  }

  function animate() {
    requestAnimationFrame(animate);
    clearFrame();
    drawFrame();
  }

  requestAnimationFrame(animate);
})

mdlr('mmzsource:warpspeed');
