const controlFuncs = (() => {
  const ARROW_UP = 'ArrowUp';
  const ARROW_DOWN = 'ArrowDown';
  const ARROW_LEFT = 'ArrowLeft';
  const ARROW_RIGHT = 'ArrowRight';

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
    }
  }
})();

// export default controlFuncs;