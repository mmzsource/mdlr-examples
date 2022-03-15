mdlr('mmzsource:nn', m => {

  const compared = (item1, item2) => {return `${item1},${item2}`}

  function distance(p1, p2) {
    let dx2 = Math.pow((p2.x - p1.x), 2);
    let dy2 = Math.pow((p2.y - p1.y), 2);
    return Math.sqrt(dy2 + dx2);
  }

  function bruteForce(setOfPoints, radius){
    let withinRadius = [];
    let alreadyCompared = [];
    for (let i = 0; i < setOfPoints.length; i++){
      for (let j = 0; j < setOfPoints.length; j++) {
        if (i != j && 
            !(alreadyCompared.includes(compared(i, j)) || alreadyCompared.includes(compared(j, i))) && 
            distance(setOfPoints[i], setOfPoints[j]) < radius) {
          withinRadius.push([setOfPoints[i], setOfPoints[j]]);
          alreadyCompared.push(compared(i, j));
        }
      }
    }
    return withinRadius;
  }

  return {
    nn: (setOfPoints, radius) => {
      /* 
         For now: brute force approach.
         Later (if needed) faster algorithm, e.g: https://algo.kaust.edu.sa/Documents/cs372l01.pdf
         Maybe switch on number of points given on input.
      */
      pairsWithinRadius = bruteForce(setOfPoints, radius);
      return pairsWithinRadius;
    }
  };
})

mdlr('[test]mmzsource:nn', m => {

  const test = m.test;
  const expect = test.expect;
  const module = m.require('mmzsource:nn');

  test.it('should exist', done => {
    expect(module).to.exist();  
    done();
  });

  test.it('should be a function', done => {
    expect(typeof module.nn).to.eql('function');
    done();
  });

  test.it('should return an array', done => {
    expect(Array.isArray(module.nn([], 42))).to.be.true();
    done();
  });

  test.it('should return pairs that are within radius distance', done => {
    let P0 = {x: -10, y: -10};
    let P1 = {x:   0, y:   0};
    let P2 = {x:   0, y:  42};
    let P3 = {x:   0, y:  75};
    let P4 = {X: 100, y: 100};
    let points = [P0, P1, P2, P3, P4];
    let withinRange = module.nn(points,50);
    expect(withinRange.length).to.eql(3);
    expect(JSON.stringify(withinRange)).to.eql(JSON.stringify([[P0, P1], [P1, P2], [P2, P3]]));
    done();
  });
});

if (true) {
mdlr('[mdlr]test:runner', {args:{
  args: { test: ['mmzsource:nn'] },
  flags: { "show-passed": true }
}})
}
else {
mdlr('mmzsource:nn');
}
