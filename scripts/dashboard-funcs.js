const dashboardFuncs = (() => {
  const DEFAULT_TIME = 15;
  const dashboardTimer = document.getElementById('timer');
  const dashboardScore = document.getElementById('score');
  let timer = DEFAULT_TIME;
  let timerProcess;
  let score = 0; // Start with 0 points

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
    },

    incrementDashboardScore () {
      score++;
      dashboardScore.innerText = score;
    },

    resetDashboardScore () {
      score = 0;
      dashboardScore.innerText = score;
    }
  }
})();
