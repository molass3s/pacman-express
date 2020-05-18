const controlFuncs = (() => {
  const ARROW_UP = 'ArrowUp';
  const ARROW_DOWN = 'ArrowDown';
  const ARROW_LEFT = 'ArrowLeft';
  const ARROW_RIGHT = 'ArrowRight';

  return {
    keyPressed (e) {
      return e.key;
    },

    isArrowUp (arrow) {
      return ARROW_UP === arrow;
    },

    isArrowDown (arrow) {
      return ARROW_DOWN === arrow;
    },

    isArrowLeft (arrow) {
      return ARROW_LEFT === arrow;
    },

    isArrowRight (arrow) {
      return ARROW_RIGHT === arrow;
    }
  }
})();

// export default controlFuncs;