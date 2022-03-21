mdlr('mmzsource:grid-map', m => {

  // If your grid exceeds these values, GridMap might not work, or worse: 
  // still seem to work, but return wrong values
  // 2**26 * 2**26 ~ MAX_SAFE_INTEGER.

  const maxGridWidth = 2**26;
  const diffX = 2**25;
  const diffY = 2**25;

  function index([x,y]){
    return maxGridWidth * (y + diffY) + (x + diffX);
  }

  class GridMap extends Map {
    get(gridCoord) {
      return super.get(index(gridCoord));
    }
    set(gridCoord, value) {     
      return super.set(index(gridCoord), value);
    }
  }
  
  return GridMap;
})

mdlr('[test]mmzsource:grid-map', m => {

  const test = m.test;
  const expect = test.expect;
  const GridMap = m.require('mmzsource:grid-map');

  test.it('should exist', done => {
    expect(GridMap).to.exist();  
    done();
  });

  test.it('should return a Map', done => {
    const gridmap = new GridMap();
    expect(gridmap instanceof Map).to.be.true();
    done();
  });

  test.it('should return the value belonging to the array key', done => {
    const gridmap = new GridMap();
    
    gridmap.set([-3,0], "this");
    gridmap.set([2,0], "gridmap");
    gridmap.set([0,0], "is");
    gridmap.set([0,-5], "awesome");
    gridmap.set([0,2048], "!!!");

    expect(gridmap.get([-3,0])).to.eql("this");
    expect(gridmap.get([2,0])).to.eql("gridmap");
    expect(gridmap.get([0,0])).to.eql("is");
    expect(gridmap.get([0,-5])).to.eql("awesome");
    expect(gridmap.get([0,2048])).to.eql("!!!");

    expect(gridmap.get([-3+3,5-5])).to.eql("is");
    
    expect(gridmap.get("does not exist")).to.not.exist();

    done();
  });  
});

if (true) {
  mdlr('[mdlr]test:runner', 
    {args: {args:  { test: ['mmzsource:grid-map'] },
            flags: { "show-passed": true }}})
} else {
  mdlr('mmzsource:grid-map');
}
