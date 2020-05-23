const dashboardFuncs = (() => {
  const dashboardTimer = document.getElementById('timer');
  let timer = 15;
  let timerProcess;

  function resetTimer () {
    timer = 15;
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
