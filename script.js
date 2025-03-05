document.querySelectorAll('.resource').forEach(resource => {
    const decrementGenBtn = resource.querySelector('.decrement-gen');
    const incrementGenBtn = resource.querySelector('.increment-gen');
    const generationValueElem = resource.querySelector('.generation-value');
    decrementGenBtn.addEventListener('click', () => {
      let genValue = parseInt(generationValueElem.textContent) || 0;
      if (genValue > 0) generationValueElem.textContent = genValue - 1;
    });
    incrementGenBtn.addEventListener('click', () => {
      let genValue = parseInt(generationValueElem.textContent) || 0;
      generationValueElem.textContent = genValue + 1;
    });
    const totalValueElem = resource.querySelector('.total-value');
    const subtractOneBtn = resource.querySelector('.subtract-one');
    const subtractTwoBtn = resource.querySelector('.subtract-two');
    subtractOneBtn.addEventListener('click', () => {
      let total = parseInt(totalValueElem.textContent) || 0;
      total = Math.max(total - 1, 0);
      totalValueElem.textContent = total;
    });
    subtractTwoBtn.addEventListener('click', () => {
      let total = parseInt(totalValueElem.textContent) || 0;
      total = Math.max(total - 2, 0);
      totalValueElem.textContent = total;
    });
  });
  document.querySelectorAll('.total-value').forEach(span => {
    span.addEventListener('click', function () {
      let input = document.createElement("input");
      input.type = "number";
      input.value = this.textContent;
      input.style.width = "50px";
      this.replaceWith(input);
      input.focus();
      input.addEventListener("blur", function () {
        let newVal = parseInt(this.value) || 0;
        span.textContent = newVal;
        this.replaceWith(span);
      });
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          this.blur();
        }
      });
    });
  });
  document.querySelectorAll(".player-name").forEach(span => {
    span.addEventListener("click", function () {
      let input = document.createElement("input");
      input.type = "text";
      input.value = this.textContent;
      input.classList.add("name-input");
      this.replaceWith(input);
      input.focus();
      input.addEventListener("blur", function () {
        span.textContent = this.value.trim() || "Player";
        this.replaceWith(span);
      });
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          this.blur();
        }
      });
    });
  });
  let roundHistory = [];
  let currentRound = 0;
  function snapshotState() {
    const state = {};
    document.querySelectorAll('.player').forEach(player => {
      const playerId = player.id;
      state[playerId] = {};
      player.querySelectorAll('.resource').forEach(resource => {
        const resourceName = resource.getAttribute('data-resource');
        const total = parseInt(resource.querySelector('.total-value').textContent) || 0;
        state[playerId][resourceName] = total;
      });
    });
    return state;
  }
  function restoreState(state) {
    document.querySelectorAll('.player').forEach(player => {
      const playerId = player.id;
      player.querySelectorAll('.resource').forEach(resource => {
        const resourceName = resource.getAttribute('data-resource');
        const totalElem = resource.querySelector('.total-value');
        if (state[playerId] && state[playerId][resourceName] !== undefined) {
          totalElem.textContent = state[playerId][resourceName];
        }
      });
    });
  }
  function updateRound() {
    roundHistory.push(snapshotState());
    currentRound++;
    document.getElementById('roundCounter').textContent = currentRound;
    document.querySelectorAll('.resource').forEach(resource => {
      const generationValue = parseInt(resource.querySelector('.generation-value').textContent) || 0;
      const totalElem = resource.querySelector('.total-value');
      totalElem.textContent = parseInt(totalElem.textContent) + generationValue;
    });
  }
  function revertRound() {
    if (roundHistory.length > 0) {
      const previousState = roundHistory.pop();
      restoreState(previousState);
      currentRound--;
      document.getElementById('roundCounter').textContent = currentRound;
    }
  }
  document.getElementById('nextTurnBtn').addEventListener('click', updateRound);
  document.getElementById('prevTurnBtn').addEventListener('click', revertRound);
  document.addEventListener('keydown', function (e) {
    if (e.key === ' ') {
      e.preventDefault();
      updateRound();
    }
  });
  