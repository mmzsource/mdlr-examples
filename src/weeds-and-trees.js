mdlr('canvas', m => {

  const style = `width:100vw; height:100vh; transform: scaleY(-1);`;

  const doc = document.body;

  doc.innerHTML = `<canvas width=512 height=512 style="${style}"></canvas>`;
  doc.style.margin = "0";
  doc.style.overflow = "hidden";

  const canvas = doc.querySelector('canvas');
  const { width: canvasWidth, height: canvasHeight } = canvas;

  const ctx = canvas.getContext('2d');

  // (l)eft, (c)enter and (r)ight branch length (s)hrink percentage
  // (l)eft, (c)enter and (r)ight branch (a)ngle
  // (a)ngle and (l)ength (n)oise
  // (b)ranch (t)hickness
  // (d)epth
  // ls, cs, rs : 0 .. 1
  // la         : 1 .. 45
  // ca         : 10 .. -10
  // ra         : -1 .. -45
  // an, ln     : 0 .. 1
  // bt         : 0 .. 10

  // weed1: let [ls, cs, rs, la, ca, ra, an, ln, bt] = [0.35, 0.85, 0.35, 20, 4, -20, 0, 0, 0.4];
  // weed2: let [ls, cs, rs, la, ca, ra, an, ln, bt] = [0.65, 0.80, 0.65, 35, 4, -25, 0, 0, 0.9];
  let [ls, cs, rs, la, ca, ra, an, ln, bt] = [0.35, 0.85, 0.35, 20, 4, -20, 0, 0, 0.4];

  function drawLine(p1, p2, lineWidth) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // turns point p into next point bij using angle a and shrinkpercentage sp
  function nextPoint(p, a, sp) {
    let angle = (a + p.offset) * (1 - Math.random() * an);
    let nextLength = p.length * sp;
    let x = p.x + nextLength * Math.cos(angle * (Math.PI / 180));
    let y = p.y + nextLength * Math.sin(angle * (Math.PI / 180));
    return {x: x, y: y, offset: angle, length: nextLength}
  }


  function nextUnit(p) {
    let left = nextPoint(p, la, ls);
    let center = nextPoint(p, ca, cs);
    let right = nextPoint(p, ra, rs);
    return [p, left, center, right];
  }


  function drawUnit([p, left, center, right]) {
    drawLine(p, left, bt);
    drawLine(p, center, bt);
    drawLine(p, right, bt);
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
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    let middle = canvasWidth / 2;
    let startLength = 100 * cs;
    let p0 = {x: middle, y: 0, offset: 90, length: 0};
    let p1 = {x: middle, y: startLength, offset: 90, length: startLength}

    drawLine(p0, p1, 0.5);

    let unit = nextUnit(p1);
    let units = [];
    units.push(unit);
    let depthOfTree = 8;
    drawUnits(calculateUnits(units, depthOfTree, 0));
  }

  requestAnimationFrame(animate);

})

mdlr('canvas');
