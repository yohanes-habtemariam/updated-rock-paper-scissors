class RockPaperScissors {
  constructor() {
    this.score = JSON.parse(localStorage.getItem("rpsScore")) || {
      wins: 0,
      losses: 0,
      ties: 0,
    };
    this.isAutoPlaying = false;
    this.autoPlayInterval = null;

    this.initializeGame();
  }

  initializeGame() {
    this.rockButton = document.querySelector(".js-rock-button");
    this.paperButton = document.querySelector(".js-paper-button");
    this.scissorsButton = document.querySelector(".js-scissors-button");
    this.autoPlayButton = document.querySelector(".js-auto-play-button");
    this.resetButton = document.querySelector(".js-reset-score-button");

    this.resultElement = document.querySelector(".js-result");
    this.movesElement = document.querySelector(".js-moves");
    this.scoreElement = document.querySelector(".js-score");
    this.resetConfirmationElement = document.querySelector(
      ".js-reset-confirmation"
    );

    this.playerMoveElement = document.getElementById("player-move");
    this.computerMoveElement = document.getElementById("computer-move");
    this.resultDisplayElement = document.getElementById("result");

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
    this.resetButton.addEventListener("click", () =>
      this.showResetConfirmation()
    );

    document.addEventListener("keydown", (event) => this.handleKeyPress(event));
  }

  playGame(playerMove) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const computerMove = this.pickComputerMove();
    const result = this.determineWinner(playerMove, computerMove);

    this.updateScore(result);

    this.animateGame(playerMove, computerMove, result);

    this.updateGameDisplay(playerMove, computerMove, result);
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
    const emoji = this.getMoveEmoji(move);
    this.playerMoveElement.innerHTML = `<img src="images/${move}-emoji.png" alt="${move}" class="move-icon">`;
  }

  showComputerMove(move) {
    const emoji = this.getMoveEmoji(move);
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
    this.playerMoveElement.innerHTML = "?";
    this.computerMoveElement.innerHTML = "?";
    this.resultDisplayElement.textContent = "Thinking...";
    this.resultDisplayElement.className = "result";
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

  updateGameDisplay(playerMove, computerMove, result) {
    this.resultElement.textContent = result.message;
    this.movesElement.textContent = `You: ${this.capitalize(
      playerMove
    )} | Computer: ${this.capitalize(computerMove)}`;
    this.updateScoreDisplay();
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

  showResetConfirmation() {
    if (
      this.score.wins === 0 &&
      this.score.losses === 0 &&
      this.score.ties === 0
    ) {
      return;
    }

    const confirmationHTML = `
            <div class="confirmation-text">
                Are you sure you want to reset the score?
            </div>
            <button class="yes-button js-yes-button">Yes, Reset</button>
            <button class="no-button js-no-button">No, Keep Score</button>
        `;

    this.resetConfirmationElement.innerHTML = confirmationHTML;

    // Add event listeners to confirmation buttons
    document.querySelector(".js-yes-button").addEventListener("click", () => {
      this.resetScore();
      this.hideResetConfirmation();
    });

    document.querySelector(".js-no-button").addEventListener("click", () => {
      this.hideResetConfirmation();
    });
  }

  hideResetConfirmation() {
    this.resetConfirmationElement.innerHTML = "";
  }

  resetScore() {
    this.score = { wins: 0, losses: 0, ties: 0 };
    this.updateScoreDisplay();
    this.saveToStorage();
    this.resetGameDisplay();

    this.animateElement(this.scoreElement, "pulse");
  }

  resetGameDisplay() {
    this.playerMoveElement.innerHTML = "?";
    this.computerMoveElement.innerHTML = "?";
    this.resultDisplayElement.textContent = "Make your move!";
    this.resultDisplayElement.className = "result";
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
        this.hideResetConfirmation();
        break;
    }
  }

  getMoveEmoji(move) {
    const emojis = {
      rock: "✊",
      paper: "✋",
      scissors: "✌️",
    };
    return emojis[move] || "?";
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  saveToStorage() {
    localStorage.setItem("rpsScore", JSON.stringify(this.score));
  }
}

const additionalCSS = `
/* Add these to your existing CSS */

`;

document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = additionalCSS;
  document.head.appendChild(style);

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
