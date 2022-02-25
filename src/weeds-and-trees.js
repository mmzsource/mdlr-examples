mdlr('canvas', m => {

  // Notice the scaleY(-1) transformation to move point 0,0 from top left to top bottom
  const style = `width:100vw; height:100vh; transform: scaleY(-1);`;

  const doc = document.body;
  doc.innerHTML = `<canvas width=512 height=512 style="${style}"></canvas>`;
  doc.style.margin = "0";
  doc.style.overflow = "hidden";

  const canvas = doc.querySelector('canvas');
  const { width: canvasWidth, height: canvasHeight } = canvas;
  const ctx = canvas.getContext('2d');
  
  /*
     CPU saver. But sometimes you DO want the animated effect.
     In those cases, adjust a noise factor and change the animate function
     to ignore the refresh flag.
  */
  let refresh = true;
  ctx.onkeypressed = (function () {requestAnimationFrame(animate)})

  /*
     (l)eft, (c)enter and (r)ight branch length (s)hrink percentage
     (l)eft, (c)enter and (r)ight branch (a)ngle
     (a)ngle and (l)ength (n)oise
     (s)tart (l)ength
     (r)oot (w)idth
     (w)idth (r)eduction percentage
     (d)epth of calculation
     ls, cs, rs : 0 .. 1
     la         : 1 .. 45
     ca         : 10 .. -10
     ra         : -1 .. -45
     an         : -100 .. 100
     ln         : 0 .. 1
     sl         : 0 .. 400
     rw, wr     : 0 .. 1     
     d          : 0..8
  */

  // weed1: [0.35, 0.85, 0.35, 20, 3, -23, 0, 0, 100, 1.2, 0.9, 8];
  // weed2: [0.3, 0.6, 0.4, 80, 5, -40, 20, 0.1, 250, 1.5, 0.8, 8];
  // weed3: [0.4, 0.8, 0.4, 20, 2, -20, 10, 0, 140, 5, 0.8, 8];
  // weed4: [0.5, 0.5, 0.5, 35, 4, -25, -15, 0, 350, 5, 0.6, 8];
  // tree: [0.65, 0.7, 0.65, 35, 4, -25, -15, 0, 200, 5, 0.6, 8]; 
  let [ls, cs, rs, la, ca, ra, an, ln, sl, rw, wr, d] = 
      [0.35, 0.85, 0.35, 20, 3, -23, 0, 0, 100, 1.2, 0.9, 8];
 
  function drawLine(p1, p2) {
    ctx.lineWidth = p2.bt;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // turns point p into next point bij using angle a and shrinkpercentage sp
  function nextPoint(p, a, sp) {

    let angleNoise = (Math.random() * 2 - 1) * an;
    let angle = (a + angleNoise + p.offset);
    
    let lengthNoise = (Math.random() * 2 - 1) * (1 - sp) * ln;
    let nextLength = p.length * (sp + lengthNoise);
    
    let branchThickness = p.bt * wr;
    
    let x = p.x + nextLength * Math.cos(angle * (Math.PI / 180));
    let y = p.y + nextLength * Math.sin(angle * (Math.PI / 180));
    
    return {x: x, y: y, offset: angle, length: nextLength, bt: branchThickness}
  }


  function nextUnit(p) {
    let left = nextPoint(p, la, ls);
    let center = nextPoint(p, ca, cs);
    let right = nextPoint(p, ra, rs);
    return [p, left, center, right];
  }


  function drawUnit([p, left, center, right]) {
    drawLine(p, left);
    drawLine(p, center);
    drawLine(p, right);
  }


  function drawUnits(units){
    units.map(drawUnit);
  }


  function calculateUnits(units, depth, index) {
    if (depth < 1) {
      return units;
    } else {
      let result = [];
      unitsCount = units.length;
      for (i = index; i < unitsCount; i++) {
        let [p, left, center, right] = units[i];
        result.push(nextUnit(left));
        result.push(nextUnit(center));
        result.push(nextUnit(right));
      }
      return calculateUnits(units.concat(result), --depth, unitsCount)
    }
  }


  function animate() {

    if (refresh == true) {
      requestAnimationFrame(animate);  
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    let middle = canvasWidth / 2;
    let startLength = sl * cs;
    let p0 = {x: middle, y: 0, bt: rw};
    let p1 = {x: middle, y: startLength, offset: 90, length: startLength, bt: rw}

    drawLine(p0, p1); // the root

    let unit = nextUnit(p1);
    let units = [];
    units.push(unit);
    let depthOfTree = Math.min(d ?? 8, 8);
    drawUnits(calculateUnits(units, depthOfTree, 0));
    refresh = false;
  }

  requestAnimationFrame(animate);

})

mdlr('canvas');
