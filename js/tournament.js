const DEFAULT_AVATAR = "/assets/icons/pending.svg";

// État global du tournoi
const tournamentState = {
  players: [],
  matches: [],
  currentMatch: 0,
  isStarted: false,
  currentRound: 1,
  matchResults: {},
};

class TournamentGameManager {
  constructor(tournamentState) {
    this.tournamentState = tournamentState;
    this.currentGameScores = {
      player1: 0,
      player2: 0,
    };
    this.setupGameContainer();
  }

  setupGameContainer() {
    const oldContainer = document.getElementById("gameContainer");
    if (oldContainer) {
      oldContainer.remove();
    }

    this.gameContainer = document.createElement("iframe");
    this.gameContainer.id = "gameContainer";
    this.gameContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      display: none;
      z-index: 2000;
      background: black;
    `;

    document.body.appendChild(this.gameContainer);

    // Écoute des messages du jeu
    window.addEventListener("message", (event) => {
      if (event.data.type === "scoreUpdate") {
        // Mise à jour des scores en cours de partie
        this.currentGameScores = {
          player1: event.data.data.player1Score,
          player2: event.data.data.player2Score,
        };
      } else if (event.data.type === "gameComplete") {
        console.log("Game completed with data:", event.data.data);
        this.endGame();
        progressTournament(event.data.data.winner, event.data.data.finalScores);
      }
    });
  }

  startGame() {
    // Reset scores for new game
    this.currentGameScores = {
      player1: 0,
      player2: 0,
    };

    const currentMatch =
      this.tournamentState.matches[this.tournamentState.currentMatch];
    console.log("Starting game for match:", this.tournamentState.currentMatch);
    console.log("Current match data:", currentMatch);

    if (
      !currentMatch ||
      this.tournamentState.currentMatch >= this.tournamentState.matches.length
    ) {
      console.log("No more matches to play");
      return;
    }

    this.gameContainer.style.display = "block";
    this.gameContainer.src = "/game/three.html";

    this.gameContainer.onload = () => {
      console.log(
        "Game loaded, sending players:",
        currentMatch.player1,
        currentMatch.player2
      );
      this.gameContainer.contentWindow.postMessage(
        {
          type: "startGame",
          data: {
            player1: currentMatch.player1,
            player2: currentMatch.player2,
          },
        },
        "*"
      );
      this.gameContainer.focus();
    };
  }

  endGame() {
    this.gameContainer.style.display = "none";
    this.gameContainer.src = "about:blank";
    this.gameContainer.blur();

    if (window.gameCleanup) {
      window.gameCleanup();
    }
  }
}

// Ajout d'une fonction pour réinitialiser tous les champs au démarrage
function initializeTournamentDisplay() {
  const activeShape = document.querySelector(".shape.active");
  const matches = activeShape.querySelectorAll(".doubleMatch");

  matches.forEach((matchElement) => {
    const players = matchElement.querySelectorAll(".player");
    players.forEach((player) => {
      const nickname = player.querySelector(".nickname");
      const avatar = player.querySelector(".logo");
      nickname.textContent = "";
      avatar.src = DEFAULT_AVATAR;
    });

    const scores = matchElement.querySelectorAll(".score");
    scores.forEach((score) => {
      score.textContent = "0";
    });
  });
}

// Sélecteurs
const optionButtons = document.querySelectorAll(".option-btn");
const shapes = document.querySelectorAll(".shape");
const playButton = document.querySelector(".buttonPlay");
const tournamentConfig = document.getElementById("tournamentConfig");
let gameManager;

function updateCurrentMatchIndicators() {
  // D'abord, retirer tous les indicateurs actifs
  document.querySelectorAll(".doubleMatchNumber").forEach((number) => {
    number.classList.remove("active");
  });

  if (!tournamentState.isStarted) return;

  const playerCount = getSelectedPlayerCount();
  const activeShape = document.querySelector(".shape.active");

  // Sélectionner le numéro de match actuel
  const matchNumber = tournamentState.currentMatch + 1;

  // Trouver le bon sélecteur en fonction de la section de tournoi
  let selector;
  if (playerCount === 4) {
    if (matchNumber <= 2) {
      selector = `.tournamentSection2 .doubleMatch:nth-child(${matchNumber})`;
    } else if (matchNumber === 3) {
      selector = `.tournamentSection3 .doubleMatch`;
    } else if (matchNumber === 4) {
      selector = `.tournamentSection4 .doubleMatch`;
    }
  } else {
    // Pour 8 joueurs...
    if (matchNumber <= 4) {
      selector = `.tournamentSection1 .doubleMatch:nth-child(${matchNumber})`;
    } else if (matchNumber <= 6) {
      selector = `.tournamentSection2 .doubleMatch:nth-child(${
        matchNumber - 4
      })`;
    } else if (matchNumber === 7) {
      selector = `.tournamentSection3 .doubleMatch`;
    } else if (matchNumber === 8) {
      selector = `.tournamentSection4 .doubleMatch`;
    }
  }

  // Ajouter la classe active au numéro de match correspondant
  if (selector) {
    const matchElement = activeShape.querySelector(
      `${selector} .doubleMatchNumber`
    );
    if (matchElement) {
      matchElement.classList.add("active");
    }
  }
}

function showShape(shapeId) {
  shapes.forEach((shape) => shape.classList.remove("active"));
  const activeShape = document.getElementById(shapeId);
  if (activeShape) {
    activeShape.classList.add("active");
  }

  if (!tournamentState.isStarted) {
    updateCurrentMatchIndicators();
  }
}

function handleOptionChange(value) {
  optionButtons.forEach((btn) => btn.classList.remove("active"));
  document.getElementById(value).classList.add("active");
  showShape(value + "display");
}

function getSelectedPlayerCount() {
  const activeButton = document.querySelector(".option-btn.active");
  return parseInt(activeButton.id);
}

function openTournamentConfig(playerCount) {
  tournamentConfig.style.display = "block";
  generatePlayerFields(playerCount);
}

function closeTournamentConfig() {
  tournamentConfig.style.display = "none";
}

function generatePlayerFields(count) {
  const container = document.getElementById("players-container");
  container.innerHTML = "";

  const avatars = [
    "bullfinch.png",
    "clown-fish.png",
    "hedgehog.png",
    "ladybug.png",
    "mouse.png",
    "parrot.png",
    "penguin.png",
    "pig.png",
  ];

  container.innerHTML += `
    <div class="player-entry">
      <img class="player-avatar" src="/assets/avatars/buffalo.png" />
      <input type="text" class="player-input" value="YourNickname" />
    </div>
  `;

  for (let i = 1; i < count; i++) {
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    container.innerHTML += `
      <div class="player-entry">
        <img class="player-avatar" src="/assets/avatars/${randomAvatar}" />
        <input type="text" class="player-input" value="Bot Player ${i}" />
        <button class="add-friend-btn">
          <img src="/assets/icons/add_friend.svg" style="filter: none;" />
        </button>
      </div>
    `;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateMatches() {
  const playerCount = getSelectedPlayerCount();
  const shuffledPlayers = shuffleArray([...tournamentState.players]);
  tournamentState.matches = [];

  if (playerCount === 4) {
    // Premier tour (2 matches)
    tournamentState.matches = [
      {
        matchId: 0,
        round: 1,
        player1: shuffledPlayers[0],
        player2: shuffledPlayers[1],
        score1: 0,
        score2: 0,
        winner: null,
      },
      {
        matchId: 1,
        round: 1,
        player1: shuffledPlayers[2],
        player2: shuffledPlayers[3],
        score1: 0,
        score2: 0,
        winner: null,
      },
      {
        matchId: 2,
        round: 2,
        player1: null,
        player2: null,
        score1: 0,
        score2: 0,
        winner: null,
      },
    ];
  } else if (playerCount === 8) {
    // Premier tour (4 matches)
    for (let i = 0; i < 4; i++) {
      tournamentState.matches.push({
        matchId: i,
        round: 1,
        player1: shuffledPlayers[i * 2],
        player2: shuffledPlayers[i * 2 + 1],
        score1: 0,
        score2: 0,
        winner: null,
      });
    }

    // Demi-finales (2 matches)
    for (let i = 0; i < 2; i++) {
      tournamentState.matches.push({
        matchId: i + 4,
        round: 2,
        player1: null,
        player2: null,
        score1: 0,
        score2: 0,
        winner: null,
      });
    }

    // Finale
    tournamentState.matches.push({
      matchId: 6,
      round: 3,
      player1: null,
      player2: null,
      score1: 0,
      score2: 0,
      winner: null,
    });
  }
}

function updateBracketDisplay() {
  const activeShape = document.querySelector(".shape.active");
  const matches = activeShape.querySelectorAll(".doubleMatch");
  const playerCount = getSelectedPlayerCount();

  matches.forEach((matchElement, index) => {
    const match = tournamentState.matches[index];
    if (!match) return;

    // Mise à jour des joueurs
    const players = matchElement.querySelectorAll(".player");
    const scores = matchElement.querySelectorAll(".score");

    players.forEach((playerElement, playerIndex) => {
      const nickname = playerElement.querySelector(".nickname");
      const avatar = playerElement.querySelector(".logo");

      // Si c'est la case finale
      if (index === (playerCount === 4 ? 3 : 7)) {
        const finalWinner =
          tournamentState.matches[playerCount === 4 ? 2 : 6]?.winner;
        if (finalWinner) {
          nickname.textContent = finalWinner.name;
          avatar.src = finalWinner.avatar;
          playerElement.classList.add("winner");
          scores[0]?.classList.add("winner");
        } else {
          nickname.textContent = "";
          avatar.src = DEFAULT_AVATAR;
          playerElement.classList.remove("winner");
          scores[0]?.classList.remove("winner");
        }
        return;
      }

      // Pour tous les autres matches
      const currentPlayer = playerIndex === 0 ? match.player1 : match.player2;
      if (currentPlayer) {
        nickname.textContent = currentPlayer.name;
        avatar.src = currentPlayer.avatar;

        // Vérifier si ce joueur est le gagnant du match
        if (match.winner && match.winner.name === currentPlayer.name) {
          playerElement.classList.add("winner");
          scores[playerIndex]?.classList.add("winner");
        } else {
          playerElement.classList.remove("winner");
          scores[playerIndex]?.classList.remove("winner");
        }
      } else {
        nickname.textContent = "";
        avatar.src = DEFAULT_AVATAR;
        playerElement.classList.remove("winner");
        scores[playerIndex]?.classList.remove("winner");
      }
    });

    // Mise à jour des scores
    if (match.winner) {
      const winnerIndex =
        match.player1 && match.winner.name === match.player1.name ? 0 : 1;
      scores.forEach((scoreElement, scoreIndex) => {
        scoreElement.textContent =
          scoreIndex === 0 ? match.score1 : match.score2;
      });
    }
  });

  updateCurrentMatchIndicators();
}

// Ajout d'un écouteur pour la réinitialisation lors du changement de nombre de joueurs
function handleOptionChange(value) {
  optionButtons.forEach((btn) => btn.classList.remove("active"));
  document.getElementById(value).classList.add("active");
  showShape(value + "display");

  // Réinitialiser l'affichage si le tournoi n'est pas commencé
  if (!tournamentState.isStarted) {
    initializeTournamentDisplay();
  }
}

// Remplacer la fonction progressTournament existante par :
function progressTournament(winnerIndex, finalScores) {
  const currentMatch = tournamentState.matches[tournamentState.currentMatch];
  const winner =
    winnerIndex === 0 ? currentMatch.player1 : currentMatch.player2;
  const playerCount = getSelectedPlayerCount();

  // Set the actual scores from the game
  currentMatch.score1 = finalScores.player1;
  currentMatch.score2 = finalScores.player2;
  currentMatch.winner = winner;
  tournamentState.matchResults[tournamentState.currentMatch] = {
    winner: winner,
    scores: finalScores,
  };

  if (playerCount === 4) {
    if (tournamentState.currentMatch < 2) {
      // Premier tour (matchs 0 et 1)
      if (tournamentState.currentMatch === 0) {
        tournamentState.matches[2].player1 = winner;
      } else {
        tournamentState.matches[2].player2 = winner;
      }
    } else if (tournamentState.currentMatch === 2) {
      // Finale
      const finalMatch = tournamentState.matches[2];
      finalMatch.winner = winner;

      // Créer le match virtuel pour l'affichage final
      tournamentState.matches[3] = {
        matchId: 3,
        round: 3,
        player1: winner,
        player2: null,
        score1: finalScores.player1,
        score2: finalScores.player2,
        winner: winner,
      };
    }
  } else if (playerCount === 8) {
    if (tournamentState.currentMatch < 4) {
      // Premier tour (matchs 0 à 3)
      const nextRoundMatchIndex =
        4 + Math.floor(tournamentState.currentMatch / 2);
      if (tournamentState.currentMatch % 2 === 0) {
        tournamentState.matches[nextRoundMatchIndex].player1 = winner;
      } else {
        tournamentState.matches[nextRoundMatchIndex].player2 = winner;
      }
    } else if (tournamentState.currentMatch < 6) {
      // Demi-finales (matchs 4 et 5)
      if (tournamentState.currentMatch === 4) {
        tournamentState.matches[6].player1 = winner;
      } else {
        tournamentState.matches[6].player2 = winner;
      }
    } else if (tournamentState.currentMatch === 6) {
      // Finale
      const finalMatch = tournamentState.matches[6];
      finalMatch.winner = winner;

      // Créer le match virtuel pour l'affichage final
      tournamentState.matches[7] = {
        matchId: 7,
        round: 4,
        player1: winner,
        player2: null,
        score1: finalScores.player1,
        score2: finalScores.player2,
        winner: winner,
      };
    }
  }

  tournamentState.currentMatch++;
  updateBracketDisplay();
  updateCurrentMatchIndicators();
  updatePlayButton();
}

function updatePlayButton() {
  const playerCount = getSelectedPlayerCount();
  const lastMatchIndex = playerCount === 4 ? 3 : 7; // Mise à jour pour inclure l'affichage final
  const isLastMatch = tournamentState.currentMatch >= lastMatchIndex;
  const nextMatch = tournamentState.matches[tournamentState.currentMatch];

  const playButton = document.querySelector(".buttonPlay");
  const buttonText = playButton.querySelector(".button-text");

  if (isLastMatch) {
    buttonText.textContent = "Tournament Complete!";
    playButton.disabled = true;
    return;
  }

  if (!nextMatch || !nextMatch.player1 || !nextMatch.player2) {
    buttonText.textContent = "Waiting for next matches";
    playButton.disabled = true;
    return;
  }

  let matchText = "LAUNCH MATCH";
  if (tournamentState.currentMatch === lastMatchIndex) {
    matchText = "LAUNCH FINAL";
  } else if (playerCount === 8 && tournamentState.currentMatch >= 4) {
    matchText = "LAUNCH SEMI-FINAL";
  }

  buttonText.textContent = `${matchText}: ${nextMatch.player1.name} VS ${nextMatch.player2.name}`;
  playButton.disabled = false;
}

function startTournament() {
  const playerInputs = document.querySelectorAll(".player-entry .player-input");
  const playerAvatars = document.querySelectorAll(
    ".player-entry .player-avatar"
  );

  // Réinitialiser d'abord tout l'affichage
  initializeTournamentDisplay();

  tournamentState.players = Array.from(playerInputs).map((input, i) => ({
    name: input.value,
    avatar: playerAvatars[i].src,
  }));

  generateMatches();
  updateBracketDisplay();

  tournamentConfig.style.display = "none";
  document.querySelector(".chipSelectorPlayer").style.display = "none";

  document.querySelector(".buttonPlay").innerHTML = `
    <img class="playIcon" src="/assets/icons/play.svg" />
    <span class="button-text">LAUNCH NEXT MATCH</span>
  `;
  document.querySelector(".reset-btn").style.display = "block";

  tournamentState.isStarted = true;
  tournamentState.currentMatch = 0;
  tournamentState.currentRound = 1;

  updateCurrentMatchIndicators();
  updatePlayButton();
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  gameManager = new TournamentGameManager(tournamentState);

  const playButton = document.querySelector(".buttonPlay");
  if (playButton) {
    playButton.addEventListener("click", () => {
      if (!tournamentState.isStarted) {
        const playerCount = getSelectedPlayerCount();
        openTournamentConfig(playerCount);
      } else {
        gameManager.startGame();
      }
    });
  }

  const startButton = document.querySelector(".start-tournament-btn");
  if (startButton) {
    startButton.addEventListener("click", startTournament);
  }

  const resetButton = document.querySelector(".reset-btn");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      location.reload();
    });
  }

  const closeButton = document.querySelector(".close-icon");
  if (closeButton) {
    closeButton.addEventListener("click", closeTournamentConfig);
  }

  optionButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      handleOptionChange(event.target.id);
    });
  });
});

handleOptionChange("4");

window.dispatchGameEnd = function (winner) {
  const event = new CustomEvent("gameEnd", {
    detail: { winner: winner },
  });
  window.dispatchEvent(event);
};
