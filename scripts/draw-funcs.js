const drawFuncs = ((controlFuncs, dashboardFuncs, wallFuncs, pacmanFuncs) => {
  // Canvas size for screens that are larger than 600x600
  const REG_WIDTH_HEIGHT = 600;

  // Food constants
  FOOD_COUNT = 5;
  const FOOD_SIZE= 8; // Size of food, in radius.
  const FOOD_EATEN = 18; // If Pacman is within 8px of the food, it's eaten.
  const FOOD_GAP = 30; // The space, in px, that food should be spaced apart.

  let gameCanvas;
  let gameCtx;
  let gameStarted = false;
  let animateProcess;

  // Canvas config
  const canvasConfig = {
    // Set canvas config to non-mobile
    width: REG_WIDTH_HEIGHT, 
    height: REG_WIDTH_HEIGHT
  };

  // Pacman config
  let pacmanConfig;

  // Food array
  let foodArr;

  // Message containers
  let outerContainerPath;

  // Selected wall
  let selectedWallConfig;

  const isArrowKeyPressed = (e, arrowPressedHandler) => {
    const direction = controlFuncs.keyPressed(e);

    if (controlFuncs.isArrowLeft(direction) || controlFuncs.isArrowUp(direction)
      || controlFuncs.isArrowRight(direction) 
      || controlFuncs.isArrowDown(direction)) {
      e.preventDefault();
      arrowPressedHandler(direction);
      return true;
    }
    else {
      return false;
    }
  };

  const keyControlsHandler = e => {
    isArrowKeyPressed(e, (direction) => pacmanConfig.direction = direction) 
      && !gameStarted && startGame();
  }

  const swipeControlsHandler = swipeDirection => {
    pacmanConfig.direction = swipeDirection;
    !gameStarted && startGame();
  }

  const keyControlsRestartHandler = e => {
    isArrowKeyPressed(e, resetDashboard); 
  }

  const swipeConstrolsRestartHandler = swipeDirection => {
    resetDashboard();
  }

  const resetDashboard = () => {
    dashboardFuncs.resetDashboardTimer();
    dashboardFuncs.resetDashboardScore();
    drawStartScreen();
  };

  // Actions to take right before drawing Pacman. Best to set where Pacman's 
  // position will be and his expected mouth action.
  function preDrawPacmanActions () {
    const direction = pacmanConfig.direction;
    const mouthPosition = pacmanConfig.mouthPosition;
    checkEdges();

    if (controlFuncs.isArrowLeft(direction)) {
      pacmanFuncs.leftAction(pacmanConfig, mouthPosition);
    } else if (controlFuncs.isArrowUp(direction)) {
      pacmanFuncs.upAction(pacmanConfig, mouthPosition);
    } else if (controlFuncs.isArrowRight(direction)) {
      pacmanFuncs.rightAction(pacmanConfig, mouthPosition);
    } else if (controlFuncs.isArrowDown(direction)) {
      pacmanFuncs.downAction(pacmanConfig, mouthPosition);
    }

    if (mouthPosition === 2) {
      pacmanFuncs.mouthClosed(pacmanConfig);
    }
  }

  // Actions to take after drawing Pacman
  function postDrawPacmanActions () {
    const mouthPos = pacmanConfig.mouthPosition;
    const mouthOpening = pacmanConfig.mouthOpening;
    if (!mouthOpening && mouthPos < 2) {
      pacmanConfig.mouthPosition += 1;
    } else if (mouthOpening && mouthPos > 0) {
      pacmanConfig.mouthPosition -= 1;
    } else {
      pacmanConfig.mouthOpening = !mouthOpening;
    }
  }

  function drawPacMan () {
    const startAngle = (Math.PI/180) * pacmanConfig.mouthStart;
    const endAngle = (Math.PI/180) * pacmanConfig.mouthEnd;
    const mouthAngle = pacmanConfig.mouthAnglePosition;
    gameCtx.beginPath();
    gameCtx.fillStyle = '#ffff00';
    gameCtx.arc(pacmanConfig.x, pacmanConfig.y, pacmanConfig.size, startAngle, 
      endAngle, true);
    gameCtx.lineTo(mouthAngle.x, mouthAngle.y);
    gameCtx.fill();
  }

  // Actions to take before drawing the food
  function preDrawFoodActions () {
    const pacmanX = pacmanConfig.x;
    const pacmanY = pacmanConfig.y;
    const lastFoodCount = foodArr.length;
    // We only care about the food that's not eaten.
    foodArr = foodArr.filter(food => {
      return findUneatenFood(food, { x: pacmanX, y: pacmanY}, FOOD_EATEN, 
        false);
    });

    if (foodArr.length < lastFoodCount) {
      dashboardFuncs.incrementDashboardScore();
    }
  }

  function drawFood () {
    foodArr.forEach(food => {
      gameCtx.beginPath();
      gameCtx.fill(food.food);
    });
  }

  const drawWalls = () => {
    gameCtx.save()
    selectedWallConfig.forEach(wall => {
      gameCtx.lineCap = 'round';
      gameCtx.lineJoin = 'round';
      // drawSensor(wall.sensor);
      gameCtx.fillStyle = '#1919A6'
      gameCtx.fill(wall.path);
    });
    gameCtx.restore();
  };

  // I left this here for testing...
  const drawSensor = (sensor) => {
    gameCtx.fillStyle = 'rgba(200, 0, 0, 1)';
    gameCtx.fill(sensor);
  }

  // Check for existence of food and status of timer
  function checkTimerAndFood () {
    const leftovers = foodArr.length;

    if (dashboardFuncs.getTimer() <= 0 && leftovers > 0) {
      endGame();
    } 
    if (leftovers === 0) {
      // Set
      selectedWallConfig = wallFuncs.selectWallConfig();
      initFood();
      dashboardFuncs.resetDashboardTimer();
    }
  }

  const checkWallCollision = () => {
    const wallCollided = selectedWallConfig.some(wall => {
      return gameCtx.isPointInPath(wall.sensor, pacmanConfig.x, pacmanConfig.y);
    });

    wallCollided && endGame();
  };

  const endGame = () => {
    clearTimeout(animateProcess);
    gameStarted = false; // The game has ended.
    dashboardFuncs.stopTimerProcess();
    drawFood();
    drawWalls();
    drawEndScreen();
  };

  function initFood () {
    let usedCoordsArr = []
    
    for (let i = 0; i < FOOD_COUNT; i++) {
      let x = getRandomCoord(canvasConfig.width);
      let y = getRandomCoord(canvasConfig.height);
      // let x = 71;
      // let y = 312;
      let gapIncrement = FOOD_GAP;
      
      // We stay in this loop until we find a good place to put new food.
      while (true) {
        // Prevent food from being within such close proximity of each other by
        // using the sensor around the food.
        let nearbyFood = foodArr.some(food => {
          return gameCtx.isPointInPath(food.sensor, x, y);
        });
        // Food cannot collide with a wall.
        let affectedWall = selectedWallConfig.some(wall => {
          return gameCtx.isPointInPath(wall.sensor, x, y);
        });
        
        if (affectedWall || nearbyFood) {
          // If there's nearby food or new food is colliding with a wall, move 
          // new food +/- gapIncrement pixels over.
          x = (x <= gapIncrement) || (x < canvasConfig.width - 
            (gapIncrement * 3)) ? x + gapIncrement : x - gapIncrement;
          y = (y <= gapIncrement) || (y < canvasConfig.height - 
            (gapIncrement * 3)) ? y + gapIncrement : y - gapIncrement;
          gapIncrement += 15 + Math.floor(Math.random() * (21));
        } else {
          break;
        }
      }
      
      usedCoordsArr.push({ x, y });
      // The actual food.
      let food = new Path2D();
      food.arc(x, y, FOOD_SIZE, 0, Math.PI * 2, true);
      // A transparent sensor used for proximity checks (e.g other food).
      let foodSensor = new Path2D();
      foodSensor.arc(x, y, FOOD_SIZE + 20, 0, Math.PI * 2, true);
      foodArr.push({ x, y, food, sensor: foodSensor });
    }
  }

  function getRandomCoord (max) {
    // Generates a random number from a range of 20 to max, all
    // inclusive.
    // These ranges prevent food from spawning too close to the map edges.
    return 20 + Math.floor(Math.random() * (max - 40));
  }

  // Find uneaten food
  function findUneatenFood (food, pacman, activation) {
    return (((food.x - activation) > pacman.x) || ((food.x + activation) 
        < pacman.x)) 
        || (((food.y - activation) > pacman.y) || ((food.y + activation) 
        < pacman.y));
  }

  function colorStage () {
    gameCtx.fillStyle = '#000';
    gameCtx.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
  }

  const initDialogContainers = () => {
    const width = canvasConfig.width - 50;
    // Set the outer container
    outerContainerPath = new Path2D();
    // Start from 25x50, with a dynamic width, and height of 100px.
    outerContainerPath.rect(25, 100, width, 100);
  };

  const displayDialog = (msg1, msg2) => {
    gameCtx.save();
    gameCtx.fillStyle = '#f7f7f7';
    gameCtx.fill(outerContainerPath);
    gameCtx.font = '24px vcr-osd-mono';
    gameCtx.shadowOffsetX = 2;
    gameCtx.shadowOffsetY = 2;
    gameCtx.shadowBlur = 2;
    gameCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    gameCtx.fillStyle = '#000';
    gameCtx.fillText(msg1, 35, 140, canvasConfig.width - 80);
    msg2 && gameCtx.fillText(msg2, 35, 175, canvasConfig.width - 80)
    gameCtx.restore();
  };

  // This checks the map edges to create the loop effect when Pacman hits an
  // edge.
  function checkEdges () {
    const pacmanX = pacmanConfig.x;
    const pacmanY = pacmanConfig.y;
    // Use mobile width and height here, because regardless if the canvas size 
    // itself is non-mobile, the content in it ends up being scaled up 2x on
    // non-mobile screens.
    pacmanConfig.x = pacmanX > canvasConfig.width ? 0 : pacmanX < 0 ?
      canvasConfig.width : pacmanX;
    pacmanConfig.y = pacmanY > canvasConfig.height ? 0 : pacmanY < 0 ? 
      canvasConfig.height : pacmanY;
  }

  function updateCanvasConfig () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    if (height > REG_WIDTH_HEIGHT && width > REG_WIDTH_HEIGHT) {
      canvasConfig.width = REG_WIDTH_HEIGHT;
      canvasConfig.height = REG_WIDTH_HEIGHT;
    } else {
      canvasConfig.width = width;
      canvasConfig.height = height - document.getElementById('dashboard')
        .offsetHeight;
    }

    // Update canvas based on screen size
    gameCanvas.width = canvasConfig.width;
    gameCanvas.height = canvasConfig.height;

    initDialogContainers();
    wallFuncs.initWalls(canvasConfig);
    drawStartScreen();
  }

  function drawStartScreen () {
    const msg1 = 'Press a directional key or swipe to start.';
    const msg2 = 'Avoid the blue walls!'
    dashboardFuncs.setDashboardTimer();
    colorStage();
    pacmanConfig = pacmanFuncs.initPacman();
    foodArr = [];
    drawPacMan();
    displayDialog(msg1, msg2);
    // After initial Pacman drawing initiate the mouth movement config.
    pacmanConfig.mouthMid = true;
    controlFuncs.removeKeyControls(keyControlsRestartHandler);
    controlFuncs.removeSwipeControls(swipeConstrolsRestartHandler);
    controlFuncs.initKeyControls(keyControlsHandler);
    controlFuncs.initSwipeControls(swipeControlsHandler);
  }

  const startGame = () => {
    gameStarted = true;
    dashboardFuncs.startTimerProcess();
    animate();
  }

  const drawEndScreen = () => {
    // Draw the end screen instructions.
    const msg1 = 'Game over...';
    const msg2 = 'Press a directional key or swipe to restart';
    displayDialog(msg1, msg2);
    // Reset Pacman back to start position.
    pacmanConfig = pacmanFuncs.initPacman();
    controlFuncs.removeKeyControls(keyControlsHandler);
    controlFuncs.removeSwipeControls(swipeControlsHandler);
    controlFuncs.initKeyControls(keyControlsRestartHandler);
    controlFuncs.initSwipeControls(swipeConstrolsRestartHandler);
  }

  function animate () {
    // Order matters here!!!
    colorStage();
    preDrawPacmanActions();
    drawPacMan();
    postDrawPacmanActions();
    checkTimerAndFood();
    checkWallCollision();
    if (!gameStarted) return; // Break out of the animation if game has ended.
    preDrawFoodActions();
    drawFood();
    drawWalls();
    animateProcess = setTimeout(() => { requestAnimationFrame(animate); }, 40);
  }

  return {
    initConfig (ctx, canvas) {
      gameCanvas = canvas;
      gameCtx = ctx;
      window.addEventListener('resize', () => updateCanvasConfig());
      updateCanvasConfig();
    }
  };
})(controlFuncs, dashboardFuncs, wallFuncs, pacmanFuncs);
