const drawFuncs = ((controlFuncs) => {
  let gameCanvas;
  let gameCtx;
  let gameStarted = false;

  // Default constants
  const MOBILE_UNIT_SIZE = 1;
  const MOBILE_WIDTH_HEIGHT = 300;
  const REG_UNIT_SIZE = 2;
  const REG_WIDTH_HEIGHT = 600;

  // Pacman constants
  // With the exception of the mouth closed constants, these all depend on arc
  // being drawn counter-clockwise.
  const LEFT_MOUTH_START = 130;
  const LEFT_MOUTH_END = 230;
  const UP_MOUTH_START = 220;
  const UP_MOUTH_END = 320;
  const RIGHT_MOUTH_START = 310;
  const RIGHT_MOUTH_END = 50;
  const DOWN_MOUTH_START = 40;
  const DOWN_MOUTH_END = 140;
  const MOUTH_CLOSED_START = 0;
  const MOUTH_CLOSED_END = 360;
  // This value is used to inc or dec mouth angles to create a better animation.
  const MOUTH_MID_DIFF = 30;
  // This value is used to inc or dec Pacmans movement on the canvas.
  const MOVEMENT_DIFF = 5 

  // Canvas config
  const canvasConfig = {
    // Set canvas config to non-mobile
    width: REG_WIDTH_HEIGHT, 
    height: REG_WIDTH_HEIGHT, 
    unitSize: REG_UNIT_SIZE 
  };

  // Pacman config
  const pacmanConfig = {
    // Set canvas config to non-mobile
    x: REG_WIDTH_HEIGHT / 10, 
    y: REG_WIDTH_HEIGHT / 10, 
    size: 10, 
    mouthAnglePosition: {
      // The default mouth angle position is facing right at the spawn position.
      x: (REG_WIDTH_HEIGHT / 10) - 5,
      y: REG_WIDTH_HEIGHT / 10
    },
    mouthOpening: false, // Default to false, since mouth is open at start.
    // There are 3 mouth positions. 0 = fully open, 1 = halfway, and 2 = closed.
    // Default mouth is fully open.
    mouthPosition: 0, 
    direction: 'ArrowRight', // Default to key arrow right.
    speed: 60, // TODO Gradual speed increase. Default to 60 ms per frame.
    mouthStart: RIGHT_MOUTH_START, // Default with mouth open, facing right.
    mouthEnd: RIGHT_MOUTH_END
  };

  // Ghost config
  const ghostConfig = {};

  function animate () {
    // let currentSpeed = pacmanConfig.speed;
    // pacmanConfig.speed = currentSpeed < -60 ? 60 : currentSpeed - 10;
    preDrawPacmanActions();
    drawPacMan();
    postDrawPacmanActions();
    setTimeout(() => { requestAnimationFrame(animate); }, 40);
    // requestAnimationFrame(animate);
  }

  // Actions to take right before drawing Pacman. Best to set where Pacman's 
  // position will be and his expected mouth action.
  function preDrawPacmanActions () {
    const direction = pacmanConfig.direction;
    const mouthPosition = pacmanConfig.mouthPosition;

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
    gameCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    gameCtx.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
    gameCtx.fillStyle = '#ffff00';
    gameCtx.arc(pacmanConfig.x, pacmanConfig.y, pacmanConfig.size, startAngle, endAngle, true);
    gameCtx.lineTo(mouthAngle.x, mouthAngle.y);
    gameCtx.fill();
  }

  return {
    initConfig (ctx, canvas) {
      gameCanvas = canvas;
      gameCtx = ctx;
      window.addEventListener('resize', () => this.updateCanvasConfig());
      this.updateCanvasConfig();
    },

    updateCanvasConfig () {
      let width = window.innerWidth;
      let height = window.innerHeight;
      
      if (height > REG_WIDTH_HEIGHT && width > REG_WIDTH_HEIGHT) {
        canvasConfig.width = REG_WIDTH_HEIGHT;
        canvasConfig.height = REG_WIDTH_HEIGHT;
        canvasConfig.unitSize = REG_UNIT_SIZE;
      } else {
        canvasConfig.width = MOBILE_WIDTH_HEIGHT;
        canvasConfig.height = MOBILE_WIDTH_HEIGHT;
        canvasConfig.unitSize = MOBILE_UNIT_SIZE;
      }

      // Update canvas based on screen size
      gameCanvas.width = canvasConfig.width;
      gameCanvas.height = canvasConfig.height;

      gameCtx.scale(canvasConfig.unitSize, canvasConfig.unitSize);
      this.drawStartScreen(gameCtx);
    },

    drawStartScreen (gameCtx) {
      drawPacMan();
      // After initial Pacman drawing initiate the mouth movement config.
      pacmanConfig.mouthMid = true;
      document.addEventListener('keydown', e => {
        e.preventDefault();
        const direction = controlFuncs.keyPressed(e);

        if (controlFuncs.isArrowLeft(direction) || controlFuncs.isArrowUp(direction)
          || controlFuncs.isArrowRight(direction) || controlFuncs.isArrowDown(direction)) {
          pacmanConfig.direction = direction;
        }
        else {
          return;
        }
        
        if (gameStarted) return;
        gameStarted = true;
        animate();
      });
    },

    drawEndScreen: (gameCtx) => {
      // Draw the end screen here.
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
})(controlFuncs);

// export default drawFuncs;