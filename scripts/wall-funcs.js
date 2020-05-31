const wallFuncs = (() => {
  const WALL_WIDTH = 10;
  const OFFSET = 10;
  const OFFSET_LONG = 14;
  const wallConfigs = [];

  // Horizontal wall across
  const initWall1 = (canvasConfig) => {
    let walls = [];
    const x = 0;
    const y = Math.floor(canvasConfig.height / 2);
    const length = canvasConfig.width;
    const path = new Path2D();
    path.rect(x, y, length, WALL_WIDTH);
    const sensor = new Path2D();
    sensor.rect(x - OFFSET, y - OFFSET_LONG, length + 40, 40);
    walls.push({ x, y, length, path, sensor });
    return walls;
  };

  // Two horizontal halved walls. One at the top-right page, other mid-left 
  // page.
  const initWall2 = (canvasConfig) => {
    let walls = [];
    // Create wall part 1.
    const x1 = 0;
    const y1 = Math.floor(canvasConfig.height / 2);
    const length1 = Math.floor(canvasConfig.width / 2);
    const path1 = new Path2D();
    path1.rect(x1, y1, length1, WALL_WIDTH);
    const sensor1 = new Path2D();
    sensor1.rect(x1, y1 - OFFSET_LONG, length1 + 18, 40);
    walls.push({ x: x1, y: y1, length: length1, path: path1, sensor: sensor1 });
    // Create wall part 2.
    const x2 = Math.floor(canvasConfig.width / 2);
    const y2 = 0;
    const length2 = canvasConfig.height;
    const path2 = new Path2D();
    path2.rect(x2, y2, length2, WALL_WIDTH);
    const sensor2 = new Path2D();
    sensor2.rect(x2 - 18, y2 - OFFSET_LONG, length2 + 50, 40);
    walls.push({ x: x2, y: y2, length: length2, path: path2, sensor: sensor2 });
    return walls;
  };

  // Vertical wall from top to bottom.
  const initWall3 = (canvasConfig) => {
    let walls = [];
    const x = Math.floor(canvasConfig.width / 2);
    const y = 0;
    const length = canvasConfig.height;
    const path = new Path2D();
    path.rect(x, y, WALL_WIDTH, length);
    const sensor = new Path2D();
    sensor.rect(x - OFFSET_LONG, y - OFFSET_LONG, 40, length + 20);
    walls.push({ x, y, length, path, sensor });
    return walls;
  };

  // Two vertical halved walls. One at the top-left page, other mid-bottom page.
  const initWall4 = (canvasConfig) => {
    let walls = [];
    // Create wall part 1.
    const x1 = 0;
    const y1 = 0;
    const length1 = Math.floor(canvasConfig.height / 2);
    const path1 = new Path2D();
    path1.rect(x1, y1, WALL_WIDTH, length1);
    const sensor1 = new Path2D();
    sensor1.rect(x1 - OFFSET_LONG, y1, 40, length1 + 18);
    walls.push({ x: x1, y: y1, length: length1, path: path1, sensor: sensor1 });
    // Create wall part 2.
    const x2 = Math.floor(canvasConfig.width / 2);
    const y2 = Math.floor(canvasConfig.height / 2);
    const length2 = canvasConfig.height / 2;
    const path2 = new Path2D();
    path2.rect(x2, y2 - 20, WALL_WIDTH, length2 + 20);
    const sensor2 = new Path2D();
    sensor2.rect(x2 - OFFSET_LONG, y2 - 38, 40, length2 + 40);
    walls.push({ x: x2, y: y2, length: length2, path: path2, sensor: sensor2 });
    return walls;
  };

  return {
    initWalls (canvasConfig) {
      wallConfigs.push(initWall1(canvasConfig));
      wallConfigs.push(initWall2(canvasConfig));
      wallConfigs.push(initWall3(canvasConfig));
      wallConfigs.push(initWall4(canvasConfig));
    },

    selectWallConfig () {
      const selectIndex = Math.floor(Math.random()
        * wallConfigs.length);
      return wallConfigs[selectIndex];
    }
  };
})();
