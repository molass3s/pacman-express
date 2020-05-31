const pacmanFuncs = (() => {
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
  const MOVEMENT_DIFF = 10;

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

  return {
    initPacman () {
      pacmanConfig.x = 150;
      pacmanConfig.y = 50;
      // The default mouth angle position is facing right at the spawn position.
      pacmanConfig.mouthAnglePosition = { x: 140, y: 50 };
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

      return pacmanConfig;
    },

    leftAction (pacmanConfig, mouthPosition) {
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
    },

    upAction (pacmanConfig, mouthPosition) {
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
    },

    rightAction (pacmanConfig, mouthPosition) {
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
    },

    downAction (pacmanConfig, mouthPosition) {
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
    },

    mouthClosed (pacmanConfig) {
      pacmanConfig.mouthStart = MOUTH_CLOSED_START;
      pacmanConfig.mouthEnd = MOUTH_CLOSED_END;
    }
  };
})();
