class RockPaperScissors {
  constructor() {
    this.score = JSON.parse(localStorage.getItem("rpsScore")) || {
      wins: 0,
      losses: 0,
      ties: 0,
    };
    this.isAutoPlaying = false;
    this.autoPlayInterval = null;
    this.isAnimating = false;

    this.initializeGame();
  }

  initializeGame() {
    this.rockButton = document.querySelector(".js-rock-button");
    this.paperButton = document.querySelector(".js-paper-button");
    this.scissorsButton = document.querySelector(".js-scissors-button");
    this.autoPlayButton = document.querySelector(".js-auto-play-button");
    this.resetButton = document.querySelector(".js-reset-score-button");

    this.playerMoveElement = document.getElementById("player-move");
    this.computerMoveElement = document.getElementById("computer-move");
    this.resultDisplayElement = document.getElementById("result");
    this.scoreElement = document.getElementById("score");

    this.bindEvents();
    this.updateScoreDisplay();
    this.resetGameDisplay();
  }

  bindEvents() {
    this.rockButton.addEventListener("click", () => this.playGame("rock"));
    this.paperButton.addEventListener("click", () => this.playGame("paper"));
    this.scissorsButton.addEventListener("click", () =>
      this.playGame("scissors")
    );

    this.autoPlayButton.addEventListener("click", () => this.toggleAutoPlay());
    this.resetButton.addEventListener("click", () => this.resetScore());

    document.addEventListener("keydown", (event) => this.handleKeyPress(event));
  }

  playGame(playerMove) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const computerMove = this.pickComputerMove();
    const result = this.determineWinner(playerMove, computerMove);

    this.updateScore(result);
    this.animateGame(playerMove, computerMove, result);
    this.updateScoreDisplay();
    this.saveToStorage();
  }

  animateGame(playerMove, computerMove, result) {
    this.resetAnimationStates();

    setTimeout(() => {
      this.showPlayerMove(playerMove);
      this.animateElement(this.playerMoveElement, "bounce-in");
    }, 300);

    setTimeout(() => {
      this.showComputerMove(computerMove);
      this.animateElement(this.computerMoveElement, "bounce-in");
    }, 800);

    setTimeout(() => {
      this.showResult(result);
      this.animateElement(this.resultDisplayElement, "pulse");
      this.isAnimating = false;
    }, 1300);

    this.animateMoveButton(playerMove);
  }

  showPlayerMove(move) {
    this.playerMoveElement.innerHTML = `<img src="images/${move}-emoji.png" alt="${move}" class="move-icon">`;
  }

  showComputerMove(move) {
    this.computerMoveElement.innerHTML = `<img src="images/${move}-emoji.png" alt="${move}" class="move-icon">`;
  }

  showResult(result) {
    this.resultDisplayElement.textContent = result.message;
    this.resultDisplayElement.className = "result";

    switch (result.type) {
      case "win":
        this.resultDisplayElement.classList.add("win");
        break;
      case "lose":
        this.resultDisplayElement.classList.add("lose");
        break;
      case "tie":
        this.resultDisplayElement.classList.add("tie");
        break;
    }
  }

  animateMoveButton(playerMove) {
    let button;
    switch (playerMove) {
      case "rock":
        button = this.rockButton;
        break;
      case "paper":
        button = this.paperButton;
        break;
      case "scissors":
        button = this.scissorsButton;
        break;
    }

    this.animateElement(button, "pulse");
  }

  animateElement(element, animationClass) {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, 600);
  }

  resetAnimationStates() {
    this.playerMoveElement.innerHTML =
      '<img src="images/rock-emoji.png" alt="?" class="move-icon">';
    this.computerMoveElement.innerHTML =
      '<img src="images/rock-emoji.png" alt="?" class="move-icon">';
    this.resultDisplayElement.textContent = "Thinking...";
    this.resultDisplayElement.className = "result";
    this.resultDisplayElement.classList.remove("win", "lose", "tie");
  }

  determineWinner(playerMove, computerMove) {
    if (playerMove === computerMove) {
      return { type: "tie", message: "It's a Tie! 🤝" };
    }

    const winningConditions = {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    };

    if (winningConditions[playerMove] === computerMove) {
      return { type: "win", message: "You Win! 🎉" };
    } else {
      return { type: "lose", message: "You Lose! 😢" };
    }
  }

  pickComputerMove() {
    const moves = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * moves.length);
    return moves[randomIndex];
  }

  updateScore(result) {
    switch (result.type) {
      case "win":
        this.score.wins++;
        break;
      case "lose":
        this.score.losses++;
        break;
      case "tie":
        this.score.ties++;
        break;
    }
  }

  updateScoreDisplay() {
    this.scoreElement.textContent = `Wins: ${this.score.wins} | Losses: ${this.score.losses} | Ties: ${this.score.ties}`;
  }

  toggleAutoPlay() {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }

    this.updateAutoPlayButton();
  }

  startAutoPlay() {
    this.isAutoPlaying = true;
    this.autoPlayInterval = setInterval(() => {
      const moves = ["rock", "paper", "scissors"];
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      this.playGame(randomMove);
    }, 1500);
  }

  stopAutoPlay() {
    this.isAutoPlaying = false;
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  updateAutoPlayButton() {
    if (this.isAutoPlaying) {
      this.autoPlayButton.textContent = "Stop Auto Play";
      this.autoPlayButton.style.background =
        "linear-gradient(135deg, var(--accent), #cc0052)";
    } else {
      this.autoPlayButton.textContent = "Auto Play";
      this.autoPlayButton.style.background =
        "linear-gradient(135deg, var(--secondary), #0099cc)";
    }
  }

  resetScore() {
    if (
      this.score.wins === 0 &&
      this.score.losses === 0 &&
      this.score.ties === 0
    ) {
      return;
    }

    if (confirm("Are you sure you want to reset the score?")) {
      this.score = { wins: 0, losses: 0, ties: 0 };
      this.updateScoreDisplay();
      this.saveToStorage();
      this.resetGameDisplay();
      this.animateElement(this.scoreElement, "pulse");
    }
  }

  resetGameDisplay() {
    this.playerMoveElement.innerHTML =
      '<img src="images/rock-emoji.png" alt="?" class="move-icon">';
    this.computerMoveElement.innerHTML =
      '<img src="images/rock-emoji.png" alt="?" class="move-icon">';
    this.resultDisplayElement.textContent = "Make your move!";
    this.resultDisplayElement.className = "result";
    this.resultDisplayElement.classList.remove("win", "lose", "tie");
  }

  handleKeyPress(event) {
    if (this.isAnimating) return;

    switch (event.key.toLowerCase()) {
      case "r":
        this.playGame("rock");
        break;
      case "p":
        this.playGame("paper");
        break;
      case "s":
        this.playGame("scissors");
        break;
      case "a":
        this.toggleAutoPlay();
        break;
      case " ":
        event.preventDefault();
        this.toggleAutoPlay();
        break;
      case "escape":
        this.stopAutoPlay();
        break;
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  saveToStorage() {
    localStorage.setItem("rpsScore", JSON.stringify(this.score));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.rpsGame = new RockPaperScissors();

  const keyboardHint = document.createElement("div");
  keyboardHint.className = "keyboard-hint";
  keyboardHint.textContent =
    "Pro Tip: Press R (Rock), P (Paper), S (Scissors), A (Auto Play), Space (Toggle Auto Play)";
  document.querySelector(".game-container").appendChild(keyboardHint);
});

if ("ontouchstart" in window) {
  document.body.classList.add("touch-device");
}
