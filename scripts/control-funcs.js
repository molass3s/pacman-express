const controlFuncs = (() => {
  // Arrow keys and swipe controls.
  const ARROW_LEFT = 'ArrowLeft';
  const ARROW_UP = 'ArrowUp';
  const ARROW_RIGHT = 'ArrowRight';
  const ARROW_DOWN = 'ArrowDown';
  
  const gameCanvas = document.getElementById('game-canvas');
  let moveTouch;

  let x;
  let y;

  return {
    keyPressed (e) {
      return e.key;
    },

    isArrowLeft (arrow) {
      return ARROW_LEFT === arrow;
    },

    isArrowUp (arrow) {
      return ARROW_UP === arrow;
    },

    isArrowRight (arrow) {
      return ARROW_RIGHT === arrow;
    },

    isArrowDown (arrow) {
      return ARROW_DOWN === arrow;
    },

    initKeyControls (handleKeyControls) {
      document.addEventListener('keydown', handleKeyControls);
    },

    initSwipeControls (handleSwipe) {
      gameCanvas.addEventListener('touchstart', (e) => {
        let touchObj = e.changedTouches[0]
        dinstance = 0
        x = touchObj.pageX
        y = touchObj.pageY
        startTime = new Date().getTime() // Time of touchstart
        e.preventDefault()
      });
      gameCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Don't move the screen
        // This is weird, but touchend isn't picking up changedTouches (i.e. 
        // the value is undefined). This is my hack to work around the problem.
        moveTouch = e.changedTouches[0];
      });
      gameCanvas.addEventListener('touchend', (e) => {
        // If we didn't swipe, then do nothing.
        if (!moveTouch) {
          return;
        }
        const endX = x - moveTouch.pageX;
        const endY = y - moveTouch.pageY;
        const endXDistance = Math.abs(endX);
        const endYDistance = Math.abs(endY);
        // Just reuse the arrow key controls so there's no need to map a whole
        // different set of controls for swipe directions.
        const swipeDirection = endYDistance > endXDistance
          ? (endY > 0 ? ARROW_UP : ARROW_DOWN) 
          : (endX > 0 ? ARROW_LEFT : ARROW_RIGHT);
        handleSwipe(swipeDirection);
        e.preventDefault()
      });
    }
  }
})();
