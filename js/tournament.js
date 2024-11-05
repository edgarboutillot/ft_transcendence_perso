
// const DEFAULT_AVATAR = "/assets/icons/pending.svg";

// // État global du tournoi
// const tournamentState = {
//   players: [],
//   matches: [],
//   currentMatch: 0,
//   isStarted: false,
//   currentRound: 1,
//   matchResults: {},
// };

// // Sélecteurs
// const optionButtons = document.querySelectorAll(".option-btn");
// const shapes = document.querySelectorAll(".shape");
// const playButton = document.querySelector(".buttonPlay");
// const tournamentConfig = document.getElementById("tournamentConfig");

// // Fonction pour mettre à jour les indicateurs de match actuel
// function updateCurrentMatchIndicators() {
//   // Reset tous les indicateurs
//   document.querySelectorAll(".doubleMatchNumber").forEach((number) => {
//     number.classList.remove("active");
//   });

//   if (!tournamentState.isStarted) return;

//   const matchElement = document.querySelector(
//     `.shape.active .doubleMatch:nth-child(${tournamentState.currentMatch + 1}) .doubleMatchNumber`
//   );
  
//   if (matchElement) {
//     matchElement.classList.add("active");
//   }
// }

// // Fonction pour afficher le bracket correspondant
// function showShape(shapeId) {
//   shapes.forEach((shape) => shape.classList.remove("active"));
//   const activeShape = document.getElementById(shapeId);
//   if (activeShape) {
//     activeShape.classList.add("active");
//   }

//   if (!tournamentState.isStarted) {
//     updateCurrentMatchIndicators();
//   }
// }

// // Gestion du changement de nombre de joueurs
// function handleOptionChange(value) {
//   optionButtons.forEach((btn) => btn.classList.remove("active"));
//   document.getElementById(value).classList.add("active");

//   switch (value) {
//     case "4":
//       showShape("4display");
//       break;
//     case "8":
//       showShape("8display");
//       break;
//   }
// }

// // Fonctions de configuration du tournoi
// function getSelectedPlayerCount() {
//   const activeButton = document.querySelector(".option-btn.active");
//   return parseInt(activeButton.id);
// }

// function openTournamentConfig(playerCount) {
//   tournamentConfig.style.display = "block";
//   generatePlayerFields(playerCount);
// }

// function closeTournamentConfig() {
//   tournamentConfig.style.display = "none";
// }

// function generatePlayerFields(count) {
//   const container = document.getElementById("players-container");
//   container.innerHTML = "";

//   const avatars = [
//     "bullfinch.png",
//     "clown-fish.png",
//     "hedgehog.png",
//     "ladybug.png",
//     "mouse.png",
//     "parrot.png",
//     "penguin.png",
//     "pig.png",
//   ];

//   container.innerHTML += `
//     <div class="player-entry">
//       <img class="player-avatar" src="/assets/avatars/buffalo.png" />
//       <input type="text" class="player-input" value="YourNickname" />
//     </div>
//   `;

//   for (let i = 1; i < count; i++) {
//     const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
//     container.innerHTML += `
//       <div class="player-entry">
//         <img class="player-avatar" src="/assets/avatars/${randomAvatar}" />
//         <input type="text" class="player-input" value="Bot Player ${i}" />
//         <button class="add-friend-btn">
//           <img src="/assets/icons/add_friend.svg" style="filter: none;" />
//         </button>
//       </div>
//     `;
//   }
// }

// // Fonction pour mélanger un tableau
// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

// // Génération des matches
// function generateMatches() {
//   const shuffledPlayers = shuffleArray([...tournamentState.players]);
//   tournamentState.matches = [];

//   for (let i = 0; i < shuffledPlayers.length; i += 2) {
//     if (shuffledPlayers[i + 1]) {
//       tournamentState.matches.push({
//         player1: shuffledPlayers[i],
//         player2: shuffledPlayers[i + 1],
//         score1: 0,
//         score2: 0,
//         winner: null,
//       });
//     } else {
//       tournamentState.matches.push({
//         player1: shuffledPlayers[i],
//         player2: null,
//         score1: 0,
//         score2: 0,
//         winner: shuffledPlayers[i],
//       });
//     }
//   }
// }

// // Mise à jour de l'affichage du bracket
// function updateBracketDisplay() {
//   const activeShape = document.querySelector(".shape.active");
//   const firstRoundCount = getSelectedPlayerCount() === 8 ? 4 : 2;
  
//   clearNextRoundsDisplay(activeShape, firstRoundCount);
//   const matches = activeShape.querySelectorAll(".doubleMatch");

//   matches.forEach((matchElement, index) => {
//     if (index >= firstRoundCount) {
//       const matchResult = tournamentState.matchResults[index];
//       if (matchResult) {
//         updateMatchDisplay(matchElement, {
//           player1: matchResult,
//           player2: null,
//         });
//       }
//       return;
//     }

//     if (tournamentState.matches[index]) {
//       updateMatchDisplay(matchElement, tournamentState.matches[index]);
//     }
//   });
  
//   updateCurrentMatchIndicators();
// }

// function clearNextRoundsDisplay(activeShape, firstRoundCount) {
//   const matches = activeShape.querySelectorAll(".doubleMatch");
  
//   matches.forEach((matchElement, index) => {
//     if (index >= firstRoundCount) {
//       const players = matchElement.querySelectorAll(".player");
//       players.forEach((player) => {
//         const avatar = player.querySelector(".logo");
//         const nickname = player.querySelector(".nickname");
//         if (avatar) avatar.src = DEFAULT_AVATAR;
//         if (nickname) nickname.textContent = "";
//       });
//     }
//   });
// }

// function updateMatchDisplay(matchElement, match) {
//   const players = matchElement.querySelectorAll(".player");
//   const nicknames = matchElement.querySelectorAll(".nickname");
//   const avatars = matchElement.querySelectorAll(".logo");

//   if (players[0]) {
//     if (match.player1) {
//       nicknames[0].textContent = match.player1.name;
//       avatars[0].src = match.player1.avatar;
//     } else {
//       nicknames[0].textContent = "";
//       avatars[0].src = DEFAULT_AVATAR;
//     }
//   }

//   if (players[1] && match.player2) {
//     nicknames[1].textContent = match.player2.name;
//     avatars[1].src = match.player2.avatar;
//   } else if (players[1]) {
//     nicknames[1].textContent = "";
//     avatars[1].src = DEFAULT_AVATAR;
//   }
// }

// function startTournament() {
//   const playerInputs = document.querySelectorAll(".player-entry .player-input");
//   const playerAvatars = document.querySelectorAll(".player-entry .player-avatar");

//   tournamentState.players = Array.from(playerInputs).map((input, i) => ({
//     name: input.value,
//     avatar: playerAvatars[i].src,
//   }));

//   generateMatches();
//   updateBracketDisplay();

//   tournamentConfig.style.display = "none";
//   document.querySelector(".chipSelectorPlayer").style.display = "none";
  
//   document.querySelector(".buttonPlay").innerHTML = `
//     <img class="playIcon" src="/assets/icons/play.svg" />
//     <span class="button-text">LAUNCH NEXT MATCH</span>
//   `;
//   document.querySelector(".reset-btn").style.display = "block";

//   tournamentState.isStarted = true;
//   tournamentState.currentMatch = 0;
//   tournamentState.currentRound = 1;

//   updateCurrentMatchIndicators();
// }

// function progressTournament(winnerIndex) {
//   const currentMatch = tournamentState.matches[tournamentState.currentMatch];
//   const winner = winnerIndex === 0 ? currentMatch.player1 : currentMatch.player2;

//   tournamentState.matchResults[tournamentState.currentMatch] = winner;
//   tournamentState.currentMatch++;

//   updateBracketDisplay();
//   updateCurrentMatchIndicators();

//   // Mise à jour du texte du bouton pour le prochain match
//   if (tournamentState.currentMatch < tournamentState.matches.length) {
//     const nextMatch = tournamentState.matches[tournamentState.currentMatch];
//     if (nextMatch.player1 && nextMatch.player2) {
//       document.querySelector(".button-text").textContent = 
//         `LAUNCH MATCH: ${nextMatch.player1.name} VS ${nextMatch.player2.name}`;
//     } else if (nextMatch.player1) {
//       // Cas où il n'y a qu'un seul joueur (bye)
//       tournamentState.progressTournament(0);
//     }
//   } else {
//     document.querySelector(".button-text").textContent = "Tournament Complete!";
//     document.querySelector(".buttonPlay").disabled = true;
//   }
// }

// // Event Listeners
// optionButtons.forEach((button) => {
//   button.addEventListener("click", (event) => {
//     handleOptionChange(event.target.id);
//   });
// });

// window.dispatchGameEnd = function(winner) {
//   const event = new CustomEvent('gameEnd', { 
//     detail: { winner: winner }
//   });
//   window.dispatchEvent(event);
// };

// playButton.addEventListener("click", () => {
//   const playerCount = getSelectedPlayerCount();
//   openTournamentConfig(playerCount);
// });

// // Initialisation



// document.addEventListener("DOMContentLoaded", () => {
//   const startButton = document.querySelector(".start-tournament-btn");
//   if (startButton) {
//     startButton.addEventListener("click", startTournament);
//   }

//   const resetButton = document.querySelector(".reset-btn");
//   if (resetButton) {
//     resetButton.addEventListener("click", () => {
//       location.reload();
//     });
//   }

//   const closeButton = document.querySelector(".close-icon");
//   if (closeButton) {
//     closeButton.addEventListener("click", closeTournamentConfig);
//   }
// });

// // Initialisation par défaut
// handleOptionChange("4");


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

// Gestionnaire du jeu en tournoi
class TournamentGameManager {
  constructor(tournamentState) {
    this.tournamentState = tournamentState;
    this.gameContainer = document.createElement('div');
    this.gameContainer.id = 'gameContainer';
    this.gameContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: none;
      z-index: 2000;
      justify-content: center;
      align-items: center;
    `;

    this.gameElement = document.createElement('div');
    this.gameElement.id = 'game';
    this.gameElement.style.cssText = `
      width: 100%;
      height: 100%;
    `;

    this.gameContainer.appendChild(this.gameElement);
    document.body.appendChild(this.gameContainer);

    window.addEventListener('gameEnd', (event) => {
      const winner = event.detail.winner;
      this.endGame();
      progressTournament(winner - 1);
    });
  }

  startGame() {
    const currentMatch = this.tournamentState.matches[this.tournamentState.currentMatch];
    if (!currentMatch || this.tournamentState.currentMatch >= this.tournamentState.matches.length) {
      console.log('No more matches to play');
      return;
    }

    this.gameContainer.style.display = 'flex';
    this.initializeGame(currentMatch.player1, currentMatch.player2);
  }

  initializeGame(player1, player2) {
    this.gameElement.innerHTML = '';
    
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/js/game.js';
    this.gameElement.appendChild(script);

    window.currentPlayers = {
      player1: player1,
      player2: player2
    };
  }

  endGame() {
    this.gameContainer.style.display = 'none';
    this.gameElement.innerHTML = '';
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
  const shuffledPlayers = shuffleArray([...tournamentState.players]);
  tournamentState.matches = [];

  for (let i = 0; i < shuffledPlayers.length; i += 2) {
    if (shuffledPlayers[i + 1]) {
      tournamentState.matches.push({
        player1: shuffledPlayers[i],
        player2: shuffledPlayers[i + 1],
        score1: 0,
        score2: 0,
        winner: null,
      });
    } else {
      tournamentState.matches.push({
        player1: shuffledPlayers[i],
        player2: null,
        score1: 0,
        score2: 0,
        winner: shuffledPlayers[i],
      });
    }
  }
}

function updateBracketDisplay() {
  const activeShape = document.querySelector(".shape.active");
  const firstRoundCount = getSelectedPlayerCount() === 8 ? 4 : 2;
  
  clearNextRoundsDisplay(activeShape, firstRoundCount);
  const matches = activeShape.querySelectorAll(".doubleMatch");

  matches.forEach((matchElement, index) => {
    if (index >= firstRoundCount) {
      const matchResult = tournamentState.matchResults[index];
      if (matchResult) {
        updateMatchDisplay(matchElement, {
          player1: matchResult,
          player2: null,
        });
      }
      return;
    }

    if (tournamentState.matches[index]) {
      updateMatchDisplay(matchElement, tournamentState.matches[index]);
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
  const currentMatch = tournamentState.matches[tournamentState.currentMatch];
  const winner = winnerIndex === 0 ? currentMatch.player1 : currentMatch.player2;

  tournamentState.matchResults[tournamentState.currentMatch] = winner;
  tournamentState.currentMatch++;

  updateBracketDisplay();
  updateCurrentMatchIndicators();

  if (tournamentState.currentMatch < tournamentState.matches.length) {
    const nextMatch = tournamentState.matches[tournamentState.currentMatch];
    if (nextMatch.player1 && nextMatch.player2) {
      document.querySelector(".button-text").textContent = 
        `LAUNCH MATCH: ${nextMatch.player1.name} VS ${nextMatch.player2.name}`;
    } else if (nextMatch.player1) {
      tournamentState.progressTournament(0);
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