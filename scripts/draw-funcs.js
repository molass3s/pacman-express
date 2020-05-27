const drawFuncs = ((controlFuncs, dashboardFuncs) => {
  // Canvas size for screens that are larger than 600x600
  const REG_WIDTH_HEIGHT = 600;

  // Pacman constants
  // With the exception of the mouth closed constants, these all depend on arc
  // being drawn counter-clockwise.
  const LEFT_MOUTH_START = 110;
  const LEFT_MOUTH_END = 250;
  const UP_MOUTH_START = 200;
  const UP_MOUTH_END = 340;
  const RIGHT_MOUTH_START = 290;
  const RIGHT_MOUTH_END = 70;
  const DOWN_MOUTH_START = 20;
  const DOWN_MOUTH_END = 160;
  const MOUTH_CLOSED_START = 0;
  const MOUTH_CLOSED_END = 360;
  // This value is used to inc or dec mouth angles to create a better animation.
  const MOUTH_MID_DIFF = 30;
  // This value is used to inc or dec Pacmans movement on the canvas.
  const MOVEMENT_DIFF = 10 

  // Food constants
  const FOOD_SIZE= 8; // Size of food, in radius.
  const FOOD_EATEN = 16; // If Pacman is within 8px of the food, it's eaten.
  const FOOD_GAP = 20; // The space, in px, that food should be spaced apart.

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
  const pacmanConfig = {
    x: null, 
    y: null, 
    size: 20, // Default size of Pacman, in radius.
    mouthAnglePosition: null,
    mouthOpening: null, 
    mouthPosition: null, 
    direction: null, 
    mouthStart: null, 
    mouthEnd: null
  };

  // Food array
  let foodArr;

  // Message containers
  let outerContainerPath;
  let innerContainerPath;

  const keyControlsHandler = e => {
    const direction = controlFuncs.keyPressed(e);
    
    if (controlFuncs.isArrowLeft(direction) || controlFuncs.isArrowUp(direction)
      || controlFuncs.isArrowRight(direction) || controlFuncs.isArrowDown(direction)) {
      pacmanConfig.direction = direction;
      e.preventDefault();
    }
    else {
      return;
    }
    !gameStarted && startGame();
  }

  const swipeControlsHandler = swipeDirection => {
    pacmanConfig.direction = swipeDirection;
    !gameStarted && startGame();
  }

  const keyControlsRestartHandler = e => {
    resetDashboard();
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
      pacmanConfig.x -= MOVEMENT_DIFF;
      pacmanConfig.mouthAnglePosition.x = pacmanConfig.x + MOVEMENT_DIFF;
      pacmanConfig.mouthAnglePosition.y = pacmanConfig.y;

      if (mouthPosition === 0) {
        pacmanConfig.mouthStart = LEFT_MOUTH_START;
        pacmanConfig.mouthEnd = LEFT_MOUTH_END;
      } else if (mouthPosition === 1) {
        pacmanConfig.mouthStart = LEFT_MOUTH_START + MOUTH_MID_DIFF;
        pacmanConfig.mouthEnd = LEFT_MOUTH_END - MOUTH_MID_DIFF;
      }
    } else if (controlFuncs.isArrowUp(direction)) {
      pacmanConfig.y -= MOVEMENT_DIFF;
      pacmanConfig.mouthAnglePosition.x = pacmanConfig.x;
      pacmanConfig.mouthAnglePosition.y = pacmanConfig.y + MOVEMENT_DIFF;

      if (mouthPosition === 0) {
        pacmanConfig.mouthStart = UP_MOUTH_START;
        pacmanConfig.mouthEnd = UP_MOUTH_END;
      } else if (mouthPosition === 1) {
        pacmanConfig.mouthStart = UP_MOUTH_START + MOUTH_MID_DIFF;
        pacmanConfig.mouthEnd = UP_MOUTH_END - MOUTH_MID_DIFF;
      }
    } else if (controlFuncs.isArrowRight(direction)) {
      pacmanConfig.x += MOVEMENT_DIFF;
      pacmanConfig.mouthAnglePosition.x = pacmanConfig.x - MOVEMENT_DIFF;
      pacmanConfig.mouthAnglePosition.y = pacmanConfig.y;

      if (mouthPosition === 0) {
        pacmanConfig.mouthStart = RIGHT_MOUTH_START;
        pacmanConfig.mouthEnd = RIGHT_MOUTH_END;
      } else if (mouthPosition === 1) {
        pacmanConfig.mouthStart = RIGHT_MOUTH_START + MOUTH_MID_DIFF;
        pacmanConfig.mouthEnd = RIGHT_MOUTH_END - MOUTH_MID_DIFF;
      }
    } else if (controlFuncs.isArrowDown(direction)) {
      pacmanConfig.y += MOVEMENT_DIFF;
      pacmanConfig.mouthAnglePosition.x = pacmanConfig.x;
      pacmanConfig.mouthAnglePosition.y = pacmanConfig.y - MOVEMENT_DIFF;

      if (mouthPosition === 0) {
        pacmanConfig.mouthStart = DOWN_MOUTH_START;
        pacmanConfig.mouthEnd = DOWN_MOUTH_END;
      } else if (mouthPosition === 1) {
        pacmanConfig.mouthStart = DOWN_MOUTH_START + MOUTH_MID_DIFF;
        pacmanConfig.mouthEnd = DOWN_MOUTH_END - MOUTH_MID_DIFF;
      }
    }

    if (mouthPosition === 2) {
      pacmanConfig.mouthStart = MOUTH_CLOSED_START;
      pacmanConfig.mouthEnd = MOUTH_CLOSED_END;
    }
  }

  const initPacmanConfig = () => {
    pacmanConfig.x = 50;
    pacmanConfig.y = 50;
    // The default mouth angle position is facing right at the spawn position.
    pacmanConfig.mouthAnglePosition = { x: 40, y: 50 };
    // Default to false, since mouth is open at start.
    pacmanConfig.mouthOpening = false;
    // There are 3 mouth positions. 0 = fully open, 1 = halfway, and 2 = closed.
    // Default mouth is fully open.
    pacmanConfig.mouthPosition = 0;
    // Default to key arrow right.
    pacmanConfig.direction = 'ArrowRight';
    // Default with mouth open, facing right.
    pacmanConfig.mouthStart = RIGHT_MOUTH_START;
    pacmanConfig.mouthEnd = RIGHT_MOUTH_END;
  };

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
    foodArr = foodArr.filter(food => {
      return checkProximity(food, { x: pacmanX, y: pacmanY}, FOOD_EATEN, false);
    });

    if (foodArr.length < lastFoodCount) {
      dashboardFuncs.incrementDashboardScore();
    }
  }

  function drawFood () {
    foodArr.forEach(food => {
      gameCtx.beginPath();
      gameCtx.fill(food.path);
    });
  }

  // Check for existence of food and status of timer
  function checkTimerAndFood () {
    const leftovers = foodArr.length;

    if (dashboardFuncs.getTimer() <= 0 && leftovers > 0) {
      clearTimeout(animateProcess);
      gameStarted = false; // The game has ended.
      dashboardFuncs.stopTimerProcess();
      drawEndScreen();
    } 
    if (leftovers === 0) {
      initFood();
      dashboardFuncs.resetDashboardTimer();
    }
  }

  function initFood () {
    let usedCoordsArr = []
    for (let i = 0; i < 5; i++) {
      let x = getRandomCoord(canvasConfig.width);
      let y = getRandomCoord(canvasConfig.height);
      
      // Prevent food from being within such close proximity of each other,
      // specifically FOOD_GAP px.
      let nearbyFood = usedCoordsArr.find(coord => {
        return checkProximity(coord, { x, y }, FOOD_GAP, true);
      });
      if (nearbyFood) {
        x = nearbyFood.x <= (FOOD_GAP + 5) ? x + FOOD_GAP : x - FOOD_GAP;
        y = nearbyFood.y <= (FOOD_GAP + 5) ? y + FOOD_GAP : y - FOOD_GAP;
      }

      usedCoordsArr.push({ x, y });
      let path = new Path2D();
      path.fillStyle = '#ffff00';
      path.arc(x, y, FOOD_SIZE, 0, Math.PI * 2, true);
      foodArr.push({ x, y, path });
    }
  }

  function getRandomCoord (max) {
    // Generates a random number from a range of 20 to max, all
    // inclusive.
    // These ranges prevent food from spawning too close to the map edges.
    return 20 + Math.floor(Math.random() * (max - 40));
  }

  // Check the surrounding. Source is the center, target is the potential 
  // surrounding object, activation is the distance on which something happens,
  // and positive is if we want to find something within activation distance (
  // a false value means we want to make sure nothing is within activation
  // distance).
  function checkProximity (source, target, activation, positive) {
    if (positive) {
      return (((source.x - activation) < target.x) && ((source.x + activation) 
        > target.x)) 
        && (((source.y - activation) < target.y) || ((source.y + activation) 
        > target.y));
    } else {
      return (((source.x - activation) > target.x) || ((source.x + activation) 
        < target.x)) 
        || (((source.y - activation) > target.y) || ((source.y + activation) 
        < target.y));
    }
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

  const displayDialog = msg => {
    gameCtx.save();
    gameCtx.fillStyle = '#f7f7f7';
    gameCtx.fill(outerContainerPath);
    gameCtx.font = '1.5rem vcr-osd-mono';
    gameCtx.shadowOffsetX = 2;
    gameCtx.shadowOffsetY = 2;
    gameCtx.shadowBlur = 2;
    gameCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    gameCtx.fillStyle = '#000';
    gameCtx.fillText(msg, 35, 150, canvasConfig.width - 80);
    gameCtx.restore();
  };

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
    drawStartScreen();
  }

  function drawStartScreen () {
    dashboardFuncs.setDashboardTimer();
    colorStage();
    initPacmanConfig();
    foodArr = [];
    drawPacMan();
    displayDialog('Press a directional key or swipe to start');
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
    displayDialog('Game over...\nPress a directional key or swipe to restart');
    // Reset Pacman back to start position.
    initPacmanConfig();
    controlFuncs.removeKeyControls(keyControlsHandler);
    controlFuncs.removeSwipeControls(swipeControlsHandler);
    controlFuncs.initKeyControls(keyControlsRestartHandler);
    controlFuncs.initSwipeControls(swipeConstrolsRestartHandler);
  }

  function animate () {
    colorStage();
    preDrawPacmanActions();
    drawPacMan();
    postDrawPacmanActions();
    checkTimerAndFood();
    if (!gameStarted) return; // Break out of the animation if game has ended.
    preDrawFoodActions();
    drawFood();
    animateProcess = setTimeout(() => { requestAnimationFrame(animate); }, 40);
  }

  return {
    initConfig (ctx, canvas) {
      gameCanvas = canvas;
      gameCtx = ctx;
      window.addEventListener('resize', () => updateCanvasConfig());
      updateCanvasConfig();
    },

    // Draws the Snake Game stage
    drawStage: (gameCtx) => {
      // speech bubble shape test
      // gameCtx.beginPath();
      // gameCtx.moveTo(150, 50);
      // gameCtx.quadraticCurveTo(250, 50, 250, 100);
      // gameCtx.quadraticCurveTo(250, 150, 140, 150);
      // gameCtx.quadraticCurveTo(140, 200, 100, 200);
      // gameCtx.quadraticCurveTo(130, 195, 120, 150);
      // gameCtx.quadraticCurveTo(50, 150, 50, 100);
      // gameCtx.quadraticCurveTo(50, 50, 150, 50);
      // gameCtx.stroke();

      // pacman and ghost shape test
      
      // gameCtx.fillStyle = 'white';
      // gameCtx.beginPath();
      // gameCtx.moveTo(150, 120);
      // gameCtx.lineTo(150, 90);
      // gameCtx.bezierCurveTo(160, 65, 190, 65, 200, 90);
      // gameCtx.lineTo(200, 120);
      // gameCtx.lineTo(192, 115);
      // gameCtx.lineTo(184, 120);
      // gameCtx.lineTo(176, 115);
      // gameCtx.lineTo(168, 120);
      // gameCtx.lineTo(160, 115);
      // gameCtx.fill();

      // radial gradient test
      let radgrad = gameCtx.createRadialGradient(45, 45, 10, 52, 50, 30);
      radgrad.addColorStop(0, '#A7D30C');
      radgrad.addColorStop(0.9, '#019F62');
      radgrad.addColorStop(1, 'rgba(1, 159, 98, 0)');
      gameCtx.fillStyle = radgrad;
      gameCtx.fillRect(0, 0, 300, 300);
    },

    drawText (gameCtx) {
      gameCtx.font = '48px sans-serif';
      gameCtx.fillStyle = '#33d';
      gameCtx.strokeText('Snake', 150, 150);
    }
  };
})(controlFuncs, dashboardFuncs);
