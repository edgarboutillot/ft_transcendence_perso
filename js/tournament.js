const optionButtons = document.querySelectorAll(".option-btn");
const shapes = document.querySelectorAll(".shape");
const nav16 = document.querySelector(".nav-16");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

function showShape(shapeId) {
  shapes.forEach((shape) => shape.classList.remove("active"));
  document.getElementById(shapeId).classList.add("active");
}

function handleOptionChange(value) {
  optionButtons.forEach((btn) => btn.classList.remove("active"));
  document.getElementById(value).classList.add("active");

  nav16.style.display = value === "16" ? "flex" : "none";

  switch (value) {
    case "4":
      showShape("4display");
      break;
    case "8":
      showShape("816display");
      break;
    case "16":
      showShape("816display");
      break;
  }
}

optionButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    handleOptionChange(event.target.id);
  });
});

leftBtn.addEventListener("click", () => {
  showShape("816display");
  leftBtn.classList.add("active");
  rightBtn.classList.remove("active");
});

rightBtn.addEventListener("click", () => {
  showShape("162display");
  rightBtn.classList.add("active");
  leftBtn.classList.remove("active");
});

handleOptionChange("4");


/* 2 */

// Ajoutez ce JavaScript à votre fichier tournament.js
const playButton = document.querySelector('.buttonPlay');
const tournamentConfig = document.getElementById('tournamentConfig');

playButton.addEventListener('click', () => {
    const playerCount = getSelectedPlayerCount();
    openTournamentConfig(playerCount);
});

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
  
  // Liste des avatars disponibles
  const avatars = [
      'bullfinch.png',
      'clown-fish.png',
      'hedgehog.png',
      'ladybug.png',
      'mouse.png',
      'parrot.png',
      'penguin.png',
      'pig.png'
  ];

  // Premier joueur (utilisateur actuel)
  container.innerHTML += `
      <div class="player-entry">
          <img class="player-avatar" src="/assets/avatars/buffalo.png" />
          <input type="text" class="player-input" value="YourNickname" />
      </div>
  `;

  // Autres joueurs (bots avec avatars aléatoires)
  for(let i = 1; i < count; i++) {
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      container.innerHTML += `
          <div class="player-entry">
              <img class="player-avatar" src="/assets/avatars/${randomAvatar}" />
              <input type="text" class="player-input" value="Bot Player ${i}" />
              <button class="add-friend-btn">
                  <img src="/assets/icons/add_friend.svg" />
              </button>
          </div>
      `;
  }
}

