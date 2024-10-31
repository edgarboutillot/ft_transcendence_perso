
// État global du tournoi
const tournamentState = {
    players: [],
    matches: [],
    currentMatch: 0,
    isStarted: false,
    displayMode: 'left'
};

// Sélecteurs
const optionButtons = document.querySelectorAll(".option-btn");
const shapes = document.querySelectorAll(".shape");
const nav16 = document.querySelector(".nav-16");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const playButton = document.querySelector('.buttonPlay');
const tournamentConfig = document.getElementById('tournamentConfig');

// Fonction utilitaire pour mettre à jour les numéros des matches
function updateMatchNumbers(shape, playerCount) {
    if (playerCount === 16) {
        const matches = shape.querySelectorAll('.doubleMatch');
        matches.forEach((match, index) => {
            const numberElement = match.querySelector('.doubleMatchNumber');
            if (numberElement) {
                // Mise à jour des numéros uniquement pour la structure 816display
                if (shape.id === "816display") {
                    switch(index) {
                        case 4: // Premier match du second tour
                            numberElement.textContent = "9";
                            break;
                        case 5: // Deuxième match du second tour
                            numberElement.textContent = "10";
                            break;
                        case 6: // Match du troisième tour
                            numberElement.textContent = "13";
                            break;
                        case 7: // Match final
                            numberElement.textContent = "15";
                            break;
                        default:
                            // Garder les numéros 1-8 pour le premier tour
                            numberElement.textContent = (index + 1).toString();
                    }
                }
            }
        });
    }
}

function showShape(shapeId) {
    shapes.forEach((shape) => shape.classList.remove("active"));
    const activeShape = document.getElementById(shapeId);
    activeShape.classList.add("active");
    
    // Reset la navigation si on change de vue
    if (shapeId !== "162display") {
        leftBtn.textContent = "LEFT";
        rightBtn.textContent = "RIGHT";
    }

    // Mettre à jour les numéros si nécessaire
    const playerCount = getSelectedPlayerCount();
    updateMatchNumbers(activeShape, playerCount);
}

function handleOptionChange(value) {
    optionButtons.forEach((btn) => btn.classList.remove("active"));
    document.getElementById(value).classList.add("active");
    nav16.style.display = value === "16" ? "flex" : "none";

    // Reset les boutons de navigation
    leftBtn.textContent = "LEFT";
    rightBtn.textContent = "RIGHT";
    tournamentState.displayMode = 'left';

    switch (value) {
        case "4": 
            showShape("4display"); 
            break;
        case "8": 
            showShape("816display"); 
            break;
        case "16": 
            showShape("816display");
            leftBtn.classList.add("active");
            rightBtn.classList.remove("active");
            // Mettre à jour les numéros pour le mode 16 joueurs
            updateMatchNumbers(document.getElementById("816display"), 16);
            break;
    }
}

// Fonctions de configuration du tournoi
function getSelectedPlayerCount() {
    const activeButton = document.querySelector('.option-btn.active');
    return parseInt(activeButton.id);
}

function openTournamentConfig(playerCount) {
    tournamentConfig.style.display = 'block';
    generatePlayerFields(playerCount);
}

function closeTournamentConfig() {
    tournamentConfig.style.display = 'none';
}

function generatePlayerFields(count) {
    const container = document.getElementById('players-container');
    container.innerHTML = '';
    
    const avatars = [
        'bullfinch.png', 'clown-fish.png', 'hedgehog.png', 'ladybug.png',
        'mouse.png', 'parrot.png', 'penguin.png', 'pig.png'
    ];

    container.innerHTML += `
        <div class="player-entry">
            <img class="player-avatar" src="/assets/avatars/buffalo.png" />
            <input type="text" class="player-input" value="YourNickname" />
        </div>
    `;

    for(let i = 1; i < count; i++) {
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


// Ajouter cette fonction d'aide pour mélanger un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Modifier la fonction generateMatches pour mélanger les joueurs
function generateMatches() {
    // Créer une copie et la mélanger
    const shuffledPlayers = shuffleArray([...tournamentState.players]);
    tournamentState.matches = [];
    const playerCount = getSelectedPlayerCount();
    
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
        if (shuffledPlayers[i + 1]) {
            tournamentState.matches.push({
                player1: shuffledPlayers[i],
                player2: shuffledPlayers[i + 1],
                score1: 0,
                score2: 0,
                winner: null
            });
        } else {
            tournamentState.matches.push({
                player1: shuffledPlayers[i],
                player2: null,
                score1: 0,
                score2: 0,
                winner: shuffledPlayers[i]
            });
        }
    }
}

function updateBracketDisplay() {
    const playerCount = getSelectedPlayerCount();
    const isLeftSide = tournamentState.displayMode === 'left';
    
    let activeShape;
    if (playerCount === 16) {
        activeShape = isLeftSide ? 
            document.getElementById("816display") : 
            document.getElementById("162display");
        
        if (isLeftSide) {
            updateMatchNumbers(activeShape, playerCount);
        }
    } else {
        activeShape = document.querySelector('.shape.active');
    }

    const matches = activeShape.querySelectorAll('.doubleMatch');
    
    matches.forEach((matchElement, index) => {
        // En mode 16 joueurs, on ne remplit que le premier tour
        if (playerCount === 16) {
            const isFirstRound = isLeftSide ? 
                index < 4 : // Matches 1-4 pour la partie gauche
                index >= matches.length - 4; // Matches 5-8 pour la partie droite

            if (!isFirstRound) return; // On ne remplit pas les autres tours

            const matchIndex = isLeftSide ? 
                index : // 0-3 pour la partie gauche
                4 + (matches.length - 1 - index); // 4-7 pour la partie droite

            if (tournamentState.matches[matchIndex]) {
                const match = tournamentState.matches[matchIndex];
                const players = matchElement.querySelectorAll('.player');
                const nicknames = matchElement.querySelectorAll('.nickname');
                const avatars = matchElement.querySelectorAll('.logo');

                if (players[0]) {
                    nicknames[0].textContent = match.player1.name;
                    avatars[0].src = match.player1.avatar;
                }
                
                if (players[1] && match.player2) {
                    nicknames[1].textContent = match.player2.name;
                    avatars[1].src = match.player2.avatar;
                }
            }
        } else {
            // Pour les modes 4 et 8 joueurs, on garde la logique existante
            const matchIndex = isLeftSide ? index : Math.floor(tournamentState.matches.length / 2) + index;
            if (tournamentState.matches[matchIndex]) {
                const match = tournamentState.matches[matchIndex];
                const players = matchElement.querySelectorAll('.player');
                const nicknames = matchElement.querySelectorAll('.nickname');
                const avatars = matchElement.querySelectorAll('.logo');

                if (players[0]) {
                    nicknames[0].textContent = match.player1.name;
                    avatars[0].src = match.player1.avatar;
                }
                
                if (players[1] && match.player2) {
                    nicknames[1].textContent = match.player2.name;
                    avatars[1].src = match.player2.avatar;
                }
            }
        }
    });
}



// Mettre à jour la fonction startTournament pour assurer que le mélange est fait avant l'affichage
function startTournament() {
    const playerInputs = document.querySelectorAll('.player-entry .player-input');
    const playerAvatars = document.querySelectorAll('.player-entry .player-avatar');
    
    tournamentState.players = Array.from(playerInputs).map((input, i) => ({
        name: input.value,
        avatar: playerAvatars[i].src
    }));

    generateMatches();
    updateBracketDisplay();
    
    tournamentConfig.style.display = 'none';
    document.querySelector('.chipSelectorPlayer').style.display = 'none';
    
    document.querySelector('.buttonPlay').innerHTML = `
        <img class="playIcon" src="/assets/icons/play.svg" />
        <span class="button-text">LAUNCH NEXT MATCH</span>
    `;
    document.querySelector('.reset-btn').style.display = 'block';
    
    tournamentState.isStarted = true;
}

// Event Listeners
optionButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        handleOptionChange(event.target.id);
    });
});

leftBtn.addEventListener("click", () => {
    showShape("816display");
    leftBtn.classList.add("active");
    rightBtn.classList.remove("active");
    tournamentState.displayMode = 'left';
    if (tournamentState.isStarted) {
        updateBracketDisplay();
    }
});

rightBtn.addEventListener("click", () => {
    showShape("162display");
    rightBtn.classList.add("active");
    leftBtn.classList.remove("active");
    tournamentState.displayMode = 'right';
    if (tournamentState.isStarted) {
        updateBracketDisplay();
    }
});

playButton.addEventListener('click', () => {
    const playerCount = getSelectedPlayerCount();
    openTournamentConfig(playerCount);
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('.start-tournament-btn');
    if (startButton) {
        startButton.addEventListener('click', startTournament);
    }

    const resetButton = document.querySelector('.reset-btn');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            location.reload();
        });
    }
});

handleOptionChange("4");