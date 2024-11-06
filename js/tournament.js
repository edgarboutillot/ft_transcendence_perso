
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
    this.setupGameContainer();
  }

  setupGameContainer() {
    // Supprimer l'ancien conteneur s'il existe
    const oldContainer = document.getElementById('gameContainer');
    if (oldContainer) {
      oldContainer.remove();
    }

    // Créer l'iframe pour le jeu
    this.gameContainer = document.createElement('iframe');
    this.gameContainer.id = 'gameContainer';
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

    // Écouter les messages du jeu
    window.addEventListener('message', (event) => {
      if (event.data.type === 'gameComplete') {
        console.log('Game completed, winner:', event.data.data.winner);
        this.endGame();
        progressTournament(event.data.data.winner);
      }
    });
  }

  startGame() {
    const currentMatch = this.tournamentState.matches[this.tournamentState.currentMatch];
    console.log("Starting game for match:", this.tournamentState.currentMatch);
    console.log("Current match data:", currentMatch);

    if (!currentMatch || this.tournamentState.currentMatch >= this.tournamentState.matches.length) {
      console.log('No more matches to play');
      return;
    }

    this.gameContainer.style.display = 'block';
    this.gameContainer.src = '/game/three.html';

    this.gameContainer.onload = () => {
      console.log("Game loaded, sending players:", currentMatch.player1, currentMatch.player2);
      this.gameContainer.contentWindow.postMessage({
        type: 'startGame',
        data: {
          player1: currentMatch.player1,
          player2: currentMatch.player2
        }
      }, '*');
      this.gameContainer.focus();
    };
  }

  endGame() {
    // Nettoyer et cacher le conteneur
    this.gameContainer.style.display = 'none';
    this.gameContainer.src = 'about:blank';
    
    // Supprimer le focus de l'iframe
    this.gameContainer.blur();
    
    // Réinitialiser l'état du jeu si nécessaire
    if (window.gameCleanup) {
      window.gameCleanup();
    }
  }
}

// Sélecteurs
const optionButtons = document.querySelectorAll(".option-btn");
const shapes = document.querySelectorAll(".shape");
const playButton = document.querySelector(".buttonPlay");
const tournamentConfig = document.getElementById("tournamentConfig");
let gameManager;

// Fonction pour mettre à jour les indicateurs de match actuel
function updateCurrentMatchIndicators() {
  document.querySelectorAll(".doubleMatchNumber").forEach((number) => {
    number.classList.remove("active");
  });

  if (!tournamentState.isStarted) return;

  const matchElement = document.querySelector(
    `.shape.active .doubleMatch:nth-child(${tournamentState.currentMatch + 1}) .doubleMatchNumber`
  );
  
  if (matchElement) {
    matchElement.classList.add("active");
  }
}

// Fonction pour afficher le bracket correspondant
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

// Gestion du changement de nombre de joueurs
function handleOptionChange(value) {
  optionButtons.forEach((btn) => btn.classList.remove("active"));
  document.getElementById(value).classList.add("active");
  showShape(value + "display");
}

// Fonctions de configuration du tournoi
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
    // Existant pour 4 joueurs
    tournamentState.matches = [
      {
        matchId: 0,
        round: 1,
        player1: shuffledPlayers[0],
        player2: shuffledPlayers[1],
        score1: 0,
        score2: 0,
        winner: null
      },
      {
        matchId: 1,
        round: 1,
        player1: shuffledPlayers[2],
        player2: shuffledPlayers[3],
        score1: 0,
        score2: 0,
        winner: null
      },
      {
        matchId: 2,
        round: 2,
        player1: null,
        player2: null,
        score1: 0,
        score2: 0,
        winner: null
      }
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
        winner: null
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
        winner: null
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
      winner: null
    });
  }
}

function updateBracketDisplay() {
  const activeShape = document.querySelector(".shape.active");
  const playerCount = getSelectedPlayerCount();
  const firstRoundCount = playerCount === 8 ? 4 : 2;
  
  const matches = activeShape.querySelectorAll(".doubleMatch");
  matches.forEach((matchElement, index) => {
    if (index < tournamentState.matches.length) {
      const match = tournamentState.matches[index];
      if (match) {
        updateMatchDisplay(matchElement, match);
      }
    }
  });
  
  updateCurrentMatchIndicators();
}


function clearNextRoundsDisplay(activeShape, firstRoundCount) {
  const matches = activeShape.querySelectorAll(".doubleMatch");
  
  matches.forEach((matchElement, index) => {
    if (index >= firstRoundCount) {
      const players = matchElement.querySelectorAll(".player");
      players.forEach((player) => {
        const avatar = player.querySelector(".logo");
        const nickname = player.querySelector(".nickname");
        if (avatar) avatar.src = DEFAULT_AVATAR;
        if (nickname) nickname.textContent = "";
      });
    }
  });
}

function updateMatchDisplay(matchElement, match) {
  const players = matchElement.querySelectorAll(".player");
  const nicknames = matchElement.querySelectorAll(".nickname");
  const avatars = matchElement.querySelectorAll(".logo");

  if (players[0]) {
    if (match.player1) {
      nicknames[0].textContent = match.player1.name;
      avatars[0].src = match.player1.avatar;
    } else {
      nicknames[0].textContent = "";
      avatars[0].src = DEFAULT_AVATAR;
    }
  }

  if (players[1] && match.player2) {
    nicknames[1].textContent = match.player2.name;
    avatars[1].src = match.player2.avatar;
  } else if (players[1]) {
    nicknames[1].textContent = "";
    avatars[1].src = DEFAULT_AVATAR;
  }
}


function progressTournament(winnerIndex) {
  console.log("Progress Tournament called with winner:", winnerIndex);
  
  const currentMatch = tournamentState.matches[tournamentState.currentMatch];
  const winner = winnerIndex === 0 ? currentMatch.player1 : currentMatch.player2;
  const playerCount = getSelectedPlayerCount();

  // Stocker le vainqueur du match actuel
  currentMatch.winner = winner;
  tournamentState.matchResults[tournamentState.currentMatch] = winner;

  // Réinitialiser l'indicateur de match actif
  const currentMatchElement = document.querySelector('.doubleMatchNumber.active');
  if (currentMatchElement) {
    currentMatchElement.classList.remove('active');
  }

  // Logique pour déterminer le prochain match
  if (playerCount === 8) {
    // Premier tour
    if (tournamentState.currentMatch < 4) {
      const nextRoundMatchIndex = 4 + Math.floor(tournamentState.currentMatch / 2);
      if (tournamentState.currentMatch % 2 === 0) {
        tournamentState.matches[nextRoundMatchIndex].player1 = winner;
      } else {
        tournamentState.matches[nextRoundMatchIndex].player2 = winner;
      }
    }
    // Demi-finales
    else if (tournamentState.currentMatch < 6) {
      if (tournamentState.currentMatch === 4) {
        tournamentState.matches[6].player1 = winner;
      } else {
        tournamentState.matches[6].player2 = winner;
      }
    }
  } else {
    // Logique existante pour 4 joueurs
    if (tournamentState.currentMatch < 2) {
      if (tournamentState.currentMatch === 0) {
        tournamentState.matches[2].player1 = winner;
      } else {
        tournamentState.matches[2].player2 = winner;
      }
    }
  }

  // Passer au match suivant
  tournamentState.currentMatch++;

  // Mettre à jour l'affichage
  updateBracketDisplay();

  // Vérifier s'il reste des matches
  if (tournamentState.currentMatch < tournamentState.matches.length) {
    // Activer l'indicateur du prochain match
    const nextMatchElement = document.querySelector(
      `.shape.active .doubleMatch:nth-child(${tournamentState.currentMatch + 1}) .doubleMatchNumber`
    );
    if (nextMatchElement) {
      nextMatchElement.classList.add('active');
    }

    const nextMatch = tournamentState.matches[tournamentState.currentMatch];

    // Pour 8 joueurs, adapter le message selon le tour
    let matchText = "LAUNCH MATCH";
    if (playerCount === 8) {
      if (tournamentState.currentMatch >= 4 && tournamentState.currentMatch < 6) {
        matchText = "LAUNCH SEMI-FINAL";
      } else if (tournamentState.currentMatch === 6) {
        matchText = "LAUNCH FINAL";
      }
    } else if (playerCount === 4 && tournamentState.currentMatch === 2) {
      matchText = "LAUNCH FINAL";
    }

    if (nextMatch.player1 && nextMatch.player2) {
      document.querySelector(".button-text").textContent = 
        `${matchText}: ${nextMatch.player1.name} VS ${nextMatch.player2.name}`;
      document.querySelector(".buttonPlay").disabled = false;
    } else {
      document.querySelector(".button-text").textContent = "WAITING FOR NEXT MATCHES";
      document.querySelector(".buttonPlay").disabled = true;
    }
  } else {
    document.querySelector(".button-text").textContent = "Tournament Complete!";
    document.querySelector(".buttonPlay").disabled = true;
  }
}


function startTournament() {
  const playerInputs = document.querySelectorAll(".player-entry .player-input");
  const playerAvatars = document.querySelectorAll(".player-entry .player-avatar");

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
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  gameManager = new TournamentGameManager(tournamentState);

  // Gestionnaire pour le bouton play/launch
  const playButton = document.querySelector('.buttonPlay');
  if (playButton) {
    playButton.addEventListener('click', () => {
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

// Initialisation par défaut
handleOptionChange("4");

window.dispatchGameEnd = function(winner) {
  const event = new CustomEvent('gameEnd', { 
    detail: { winner: winner }
  });
  window.dispatchEvent(event);
};