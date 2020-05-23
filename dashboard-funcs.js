const dashboardFuncs = (() => {
  const DEFAULT_TIME = 15;
  const dashboardTimer = document.getElementById('timer');
  let timer = DEFAULT_TIME;
  let timerProcess;

  function resetTimer () {
    timer = DEFAULT_TIME;
  }

  function decrementTimer () {
    timer--;
  }

  return {
    getTimer () {
      return timer;
    },

    startTimerProcess () {
      this.setDashboardTimer();
      timerProcess = setInterval(() => {
        decrementTimer();
        this.setDashboardTimer();
      }, 1000);
    },

    stopTimerProcess () {
      clearInterval(timerProcess);
    },

    setDashboardTimer () {
      dashboardTimer.innerText = this.getTimer();
    },

    resetDashboardTimer () {
      resetTimer();
      this.setDashboardTimer();
    }
  }
})();
