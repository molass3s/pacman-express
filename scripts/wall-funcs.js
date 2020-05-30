const wallFuncs = (() => {
  const wallConfigs = [];

  const initWall1 = (canvasConfig) => {
    let walls = [];
    const x = 0;
    const y = Math.floor(canvasConfig.height / 2);
    const length = canvasConfig.width;
    const path = new Path2D();
    path.rect(x, y, length, 10);
    const sensor = new Path2D();
    sensor.rect(x - 10, y - 10, length + 20, 40);
    walls.push({ x, y, length, path, sensor });
    return walls;
  };

  const initWall2 = (canvasConfig) => {
    let walls = [];
    // Create wall part 1.
    const x1 = 0;
    const y1 = Math.floor(canvasConfig.height / 2);
    const length1 = Math.floor(canvasConfig.width / 2);
    const path1 = new Path2D();
    path1.rect(x1, y1, length1, 10);
    const sensor1 = new Path2D();
    sensor1.rect(x1 - 10, y1 - 10, length1 + 20, 40);
    walls.push({ x: x1, y: y1, length: length1, path: path1, sensor: sensor1 });
    // Create wall part 2.
    const x2 = Math.floor(canvasConfig.width / 2);
    const y2 = 0;
    const length2 = canvasConfig.height;
    const path2 = new Path2D();
    path2.rect(x2, y2, length2, 10);
    const sensor2 = new Path2D();
    sensor2.rect(x1 - 10, y1 - 10, length2 + 20, 40);
    walls.push({ x: x2, y: y2, length: length2, path: path2, sensor: sensor2 });
    return walls;
  };

  return {
    initWalls (canvasConfig) {
      wallConfigs.push(initWall1(canvasConfig));
      wallConfigs.push(initWall2(canvasConfig));
    },

    selectWallConfig () {
      const selectIndex = Math.floor(Math.random()
        * wallConfigs.length);
      return wallConfigs[selectIndex];
    }
  };
})();
