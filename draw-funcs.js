const drawFuncs = ((controlFuncs) => {
  let gameCanvas;
  let gameCtx;

  // Default constants
  const MOBILE_UNIT_SIZE = 1;
  const MOBILE_WIDTH_HEIGHT = 300;
  const REG_UNIT_SIZE = 2;
  const REG_WIDTH_HEIGHT = 600;

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
    open: true 
  };

  // Ghost config
  const ghostConfig = {};

  function animate (arrow) {
      if (controlFuncs.isArrowUp(arrow)) {
        console.log('arrow up pressed');
      }
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
      pacmanConfig.open = true;
      this.drawPacMan(gameCtx);
      document.addEventListener('keydown', e => {
        e.preventDefault();
        animate(controlFuncs.keyPressed(e));
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
    drawPacMan (gameCtx) {
      gameCtx.beginPath();
      gameCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      gameCtx.fillRect(0, 0, canvasConfig.width, canvasConfig.height);

      // if (pacmanConfig.x > 300) {
      //   pacmanConfig.x = 30;
      // }

      const startAngle = pacmanConfig.open ? (Math.PI/180) * 320 : 0;
      const endAngle = pacmanConfig.open ? (Math.PI/180) * 50 : (Math.PI/180) * 360;
      gameCtx.fillStyle = '#ffff00';
      gameCtx.arc(pacmanConfig.x, pacmanConfig.y, pacmanConfig.size, startAngle, endAngle, true);
      gameCtx.lineTo(pacmanConfig.x - (pacmanConfig.size / 2), pacmanConfig.y);
      gameCtx.fill();
    },
    drawText (gameCtx) {
      gameCtx.font = '48px sans-serif';
      gameCtx.fillStyle = '#33d';
      gameCtx.strokeText('Snake', 150, 150);
    }
  };
})(controlFuncs);

// export default drawFuncs;