// const DEFAULT_AVATAR = "/assets/icons/pending.svg";

// // État global du tournoi
// const tournamentState = {
//   players: [],
//   matches: [],
//   currentMatch: 0,
//   isStarted: false,
//   displayMode: "left",
//   currentRound: 1,
//   matchResults: {},
// };

// // Sélecteurs
// const optionButtons = document.querySelectorAll(".option-btn");
// const shapes = document.querySelectorAll(".shape");
// const nav16 = document.querySelector(".nav-16");
// const leftBtn = document.getElementById("leftBtn");
// const rightBtn = document.getElementById("rightBtn");
// const playButton = document.querySelector(".buttonPlay");
// const tournamentConfig = document.getElementById("tournamentConfig");

// // Fonction utilitaire pour mettre à jour les numéros des matches
// function updateMatchNumbers(shape, playerCount) {
//   if (playerCount === 16) {
//     const matches = shape.querySelectorAll(".doubleMatch");
//     matches.forEach((match, index) => {
//       const numberElement = match.querySelector(".doubleMatchNumber");
//       if (numberElement) {
//         if (shape.id === "816display") {
//           switch (index) {
//             case 4:
//               numberElement.textContent = "9";
//               break;
//             case 5:
//               numberElement.textContent = "10";
//               break;
//             case 6: // Match du troisième tour
//               numberElement.textContent = "13";
//               break;
//             case 7: // Match final
//               numberElement.textContent = "15";
//               break;
//             default:
//               // Garder les numéros 1-8 pour le premier tour
//               numberElement.textContent = (index + 1).toString();
//           }
//         }
//       }
//     });
//   }
// }

// function updateCurrentMatchIndicators() {
//   // Reset tous les indicateurs
//   document.querySelectorAll(".doubleMatchNumber").forEach((number) => {
//     number.classList.remove("active");
//   });

//   if (!tournamentState.isStarted) return;

//   const playerCount = getSelectedPlayerCount();
//   const currentMatch = tournamentState.currentMatch;

//   if (playerCount === 16) {
//     // Déterminer quelle vue doit être active
//     const matchNumbers = {
//       "816display": [1, 2, 3, 4], // Vue gauche: matches 1-4
//       "162display": [5, 6, 7, 8], // Vue droite: matches 5-8
//     };

//     // Trouver le bon match dans la bonne vue
//     if (currentMatch < 4) {
//       // Matches 1-4 sont dans 816display
//       const matchElement = document.querySelector(
//         `#816display .doubleMatch:nth-child(${
//           currentMatch + 1
//         }) .doubleMatchNumber`
//       );
//       if (matchElement) {
//         matchElement.classList.add("active");
//       }
//     } else if (currentMatch < 8) {
//       // Matches 5-8 sont dans 162display, mais dans l'ordre inverse
//       const matchIndex = currentMatch - 4; // 0-3
//       // Dans 162display, les matchs sont dans l'ordre inverse du bas vers le haut
//       const targetMatch = document.querySelector(
//         `#162display .tournamentSection1 .doubleMatch:nth-child(${
//           matchIndex + 1
//         }) .doubleMatchNumber`
//       );
//       if (targetMatch) {
//         targetMatch.classList.add("active");
//       }
//     }
//   } else {
//     // Pour les modes 4 et 8 joueurs
//     const matchElement = document.querySelector(
//       `.shape.active .doubleMatch:nth-child(${
//         currentMatch + 1
//       }) .doubleMatchNumber`
//     );
//     if (matchElement) {
//       matchElement.classList.add("active");
//     }
//   }

//   // Mettre à jour la vue en fonction du match actuel
//   updateViewForCurrentMatch();
// }

// // Mise à jour de showShape pour ne pas interférer avec les indicateurs
// function showShape(shapeId) {
//   shapes.forEach((shape) => shape.classList.remove("active"));
//   const activeShape = document.getElementById(shapeId);
//   activeShape.classList.add("active");

//   if (shapeId !== "162display") {
//     leftBtn.textContent = "LEFT";
//     rightBtn.textContent = "RIGHT";
//   }

//   const playerCount = getSelectedPlayerCount();
//   updateMatchNumbers(activeShape, playerCount);

//   // Ne mettre à jour les indicateurs que si le tournoi n'est pas en cours
//   if (!tournamentState.isStarted) {
//     updateCurrentMatchIndicators();
//   }
// }

// function handleOptionChange(value) {
//   optionButtons.forEach((btn) => btn.classList.remove("active"));
//   document.getElementById(value).classList.add("active");
//   nav16.style.display = value === "16" ? "flex" : "none";

//   // Reset les boutons de navigation
//   leftBtn.textContent = "LEFT";
//   rightBtn.textContent = "RIGHT";
//   tournamentState.displayMode = "left";

//   switch (value) {
//     case "4":
//       showShape("4display");
//       break;
//     case "8":
//       showShape("816display");
//       break;
//     case "16":
//       showShape("816display");
//       leftBtn.classList.add("active");
//       rightBtn.classList.remove("active");
//       // Mettre à jour les numéros pour le mode 16 joueurs
//       updateMatchNumbers(document.getElementById("816display"), 16);
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
//         <div class="player-entry">
//             <img class="player-avatar" src="/assets/avatars/buffalo.png" />
//             <input type="text" class="player-input" value="YourNickname" />
//         </div>
//     `;

//   for (let i = 1; i < count; i++) {
//     const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
//     container.innerHTML += `
//             <div class="player-entry">
//                 <img class="player-avatar" src="/assets/avatars/${randomAvatar}" />
//                 <input type="text" class="player-input" value="Bot Player ${i}" />
//                 <button class="add-friend-btn">
//                     <img src="/assets/icons/user-plus.svg" />
//                 </button>
//             </div>
//         `;
//   }
// }

// // Ajouter cette fonction d'aide pour mélanger un tableau
// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

// // Modifier la fonction generateMatches pour mélanger les joueurs
// function generateMatches() {
//   // Créer une copie et la mélanger
//   const shuffledPlayers = shuffleArray([...tournamentState.players]);
//   tournamentState.matches = [];
//   const playerCount = getSelectedPlayerCount();

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

// function updateBracketDisplay() {
//   const playerCount = getSelectedPlayerCount();
//   const isLeftSide = tournamentState.displayMode === "left";

//   let activeShape;
//   if (playerCount === 16) {
//     activeShape = isLeftSide
//       ? document.getElementById("816display")
//       : document.getElementById("162display");

//     if (isLeftSide) {
//       updateMatchNumbers(activeShape, playerCount);
//     }
//   } else {
//     activeShape = document.querySelector(".shape.active");
//   }

//   // Nettoyer d'abord tous les champs des tours suivants
//   const firstRoundCount = playerCount === 16 ? 4 : playerCount === 8 ? 4 : 2;
//   clearNextRoundsDisplay(activeShape, firstRoundCount);

//   const matches = activeShape.querySelectorAll(".doubleMatch");

//   matches.forEach((matchElement, index) => {
//     if (playerCount === 16) {
//       const isFirstRound = isLeftSide
//         ? index < 4 // Matches 1-4 pour la partie gauche
//         : index >= matches.length - 4; // Matches 5-8 pour la partie droite

//       if (!isFirstRound) {
//         // Vérifier si nous avons un résultat pour ce match
//         const matchResult = tournamentState.matchResults[index];
//         if (matchResult) {
//           updateMatchDisplay(matchElement, {
//             player1: matchResult,
//             player2: null,
//           });
//         }
//         return;
//       }

//       const matchIndex = isLeftSide
//         ? index // 0-3 pour la partie gauche
//         : 4 + (matches.length - 1 - index); // 4-7 pour la partie droite

//       if (tournamentState.matches[matchIndex]) {
//         updateMatchDisplay(matchElement, tournamentState.matches[matchIndex]);
//       }
//     } else {
//       // Pour les modes 4 et 8 joueurs
//       if (index >= firstRoundCount) {
//         // Vérifier si nous avons un résultat pour ce match
//         const matchResult = tournamentState.matchResults[index];
//         if (matchResult) {
//           updateMatchDisplay(matchElement, {
//             player1: matchResult,
//             player2: null,
//           });
//         }
//         return;
//       }

//       const matchIndex = index;
//       if (tournamentState.matches[matchIndex]) {
//         updateMatchDisplay(matchElement, tournamentState.matches[matchIndex]);
//       }
//     }
//   });
//   updateCurrentMatchIndicators();
// }

// function clearNextRoundsDisplay(activeShape, firstRoundCount) {
//   const matches = activeShape.querySelectorAll(".doubleMatch");
//   const is16Mode = getSelectedPlayerCount() === 16;

//   matches.forEach((matchElement, index) => {
//     let isFirstRound;

//     if (is16Mode && activeShape.id === "162display") {
//       // Pour la partie droite du mode 16 joueurs
//       isFirstRound = index >= matches.length - 4;
//     } else {
//       // Pour tous les autres cas
//       isFirstRound = index < firstRoundCount;
//     }

//     if (!isFirstRound) {
//       // Vider les champs pour les tours suivants
//       const players = matchElement.querySelectorAll(".player");
//       players.forEach((player) => {
//         const avatar = player.querySelector(".logo");
//         const nickname = player.querySelector(".nickname");
//         if (avatar) avatar.src = DEFAULT_AVATAR; // Utiliser l'image par défaut
//         if (nickname) nickname.textContent = "";
//       });
//     }
//   });
// }

// // Mettre à jour la fonction updateMatchDisplay pour utiliser aussi l'image par défaut
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

// // Mettre à jour la fonction startTournament pour assurer que le mélange est fait avant l'affichage
// function startTournament() {
//   const playerInputs = document.querySelectorAll(".player-entry .player-input");
//   const playerAvatars = document.querySelectorAll(
//     ".player-entry .player-avatar"
//   );

//   tournamentState.players = Array.from(playerInputs).map((input, i) => ({
//     name: input.value,
//     avatar: playerAvatars[i].src,
//   }));

//   generateMatches();
//   updateBracketDisplay();

//   tournamentConfig.style.display = "none";
//   document.querySelector(".chipSelectorPlayer").style.display = "none";

//   document.querySelector(".buttonPlay").innerHTML = `
//         <img class="playIcon" src="/assets/icons/play.svg" />
//         <span class="button-text">LAUNCH NEXT MATCH</span>
//     `;
//   document.querySelector(".reset-btn").style.display = "block";

//   tournamentState.isStarted = true;

//   // Ajouter ces lignes avant la fin de la fonction
//   const firstMatch = tournamentState.matches[0];
//   document.querySelector(".buttonPlay").innerHTML = `
//         <img class="playIcon" src="/assets/icons/play.svg" />
//         <span class="button-text">START MATCH</span>
//     `;

//   tournamentState.currentMatch = 0;
//   tournamentState.currentRound = 1;

//   updateCurrentMatchIndicators();

//   // Ici tu pourras initialiser ta scène Three.js
//   // initThreeJsScene(); // À ajouter quand tu intégreras Three.js
// }

// // Event Listeners
// optionButtons.forEach((button) => {
//   button.addEventListener("click", (event) => {
//     handleOptionChange(event.target.id);
//   });
// });

// leftBtn.addEventListener("click", () => {
//   showShape("816display");
//   leftBtn.classList.add("active");
//   rightBtn.classList.remove("active");
//   tournamentState.displayMode = "left";
//   if (tournamentState.isStarted) {
//     updateBracketDisplay();
//   }
// });

// rightBtn.addEventListener("click", () => {
//   showShape("162display");
//   rightBtn.classList.add("active");
//   leftBtn.classList.remove("active");
//   tournamentState.displayMode = "right";
//   if (tournamentState.isStarted) {
//     updateBracketDisplay();
//   }
// });

// function updateViewForCurrentMatch() {
//   const playerCount = getSelectedPlayerCount();
//   const currentMatch = tournamentState.currentMatch;

//   if (playerCount === 16) {
//     if (currentMatch < 4) {
//       // Automatiquement passer à la vue gauche pour les matches 1-4
//       if (tournamentState.displayMode !== "left") {
//         tournamentState.displayMode = "left";
//         showShape("816display");
//         leftBtn.classList.add("active");
//         rightBtn.classList.remove("active");
//       }
//     } else if (currentMatch < 8) {
//       // Automatiquement passer à la vue droite pour les matches 5-8
//       if (tournamentState.displayMode !== "right") {
//         tournamentState.displayMode = "right";
//         showShape("162display");
//         rightBtn.classList.add("active");
//         leftBtn.classList.remove("active");
//       }
//     }
//   }
// }

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
// });

// // 4Ajouter cette nouvelle fonction à la fin du fichier
// function progressTournament(winnerIndex) {
//   const currentMatch = tournamentState.matches[tournamentState.currentMatch];
//   const winner =
//     winnerIndex === 0 ? currentMatch.player1 : currentMatch.player2;

//   // Stocker le résultat du match
//   tournamentState.matchResults[tournamentState.currentMatch] = winner;

//   // Mettre à jour le prochain match
//   tournamentState.currentMatch++;

//   // Mettre à jour l'affichage
//   updateViewForCurrentMatch();
//   updateBracketDisplay();
//   updateCurrentMatchIndicators();

//   // Préparer le prochain match
//   if (tournamentState.currentMatch < tournamentState.matches.length) {
//     const nextMatch = tournamentState.matches[tournamentState.currentMatch];
//     document.querySelector(
//       ".button-text"
//     ).textContent = `START MATCH: ${nextMatch.player1.name} VS ${nextMatch.player2.name}`;
//   } else {
//     document.querySelector(".button-text").textContent = "Tournament Complete!";
//   }
//   // updateCurrentMatchIndicators();
// }

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

// Sélecteurs
const optionButtons = document.querySelectorAll(".option-btn");
const shapes = document.querySelectorAll(".shape");
const playButton = document.querySelector(".buttonPlay");
const tournamentConfig = document.getElementById("tournamentConfig");

// Fonction pour mettre à jour les indicateurs de match actuel
function updateCurrentMatchIndicators() {
  // Reset tous les indicateurs
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

  switch (value) {
    case "4":
      showShape("4display");
      break;
    case "8":
      showShape("8display");
      break;
  }
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
          <img src="/assets/icons/user-plus.svg" />
        </button>
      </div>
    `;
  }
}

// Fonction pour mélanger un tableau
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Génération des matches
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

// Mise à jour de l'affichage du bracket
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

function progressTournament(winnerIndex) {
  const currentMatch = tournamentState.matches[tournamentState.currentMatch];
  const winner = winnerIndex === 0 ? currentMatch.player1 : currentMatch.player2;

  tournamentState.matchResults[tournamentState.currentMatch] = winner;
  tournamentState.currentMatch++;

  updateBracketDisplay();
  updateCurrentMatchIndicators();

  if (tournamentState.currentMatch < tournamentState.matches.length) {
    const nextMatch = tournamentState.matches[tournamentState.currentMatch];
    document.querySelector(".button-text").textContent = 
      `START MATCH: ${nextMatch.player1.name} VS ${nextMatch.player2.name}`;
  } else {
    document.querySelector(".button-text").textContent = "Tournament Complete!";
  }
}

// Event Listeners
optionButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    handleOptionChange(event.target.id);
  });
});

playButton.addEventListener("click", () => {
  const playerCount = getSelectedPlayerCount();
  openTournamentConfig(playerCount);
});

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
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
});

// Initialisation par défaut
handleOptionChange("4");