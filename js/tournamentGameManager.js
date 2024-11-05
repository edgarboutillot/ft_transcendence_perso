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
  
      // Bind tournament progress to game end
      window.addEventListener('gameEnd', (event) => {
        const winner = event.detail.winner; // 1 ou 2
        this.endGame();
        this.tournamentState.progressTournament(winner - 1);
      });
    }
  
    startGame() {
      const currentMatch = this.tournamentState.matches[this.tournamentState.currentMatch];
      if (!currentMatch || this.tournamentState.currentMatch >= this.tournamentState.matches.length) {
        console.log('No more matches to play');
        return;
      }
  
      // Afficher le conteneur de jeu
      this.gameContainer.style.display = 'flex';
  
      // Créer une nouvelle instance du jeu
      this.initializeGame(currentMatch.player1, currentMatch.player2);
    }
  
    initializeGame(player1, player2) {
      // Nettoyer le conteneur
      this.gameElement.innerHTML = '';
  
      // Initialiser le nouveau jeu avec les configurations des joueurs
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/js/game.js';
      this.gameElement.appendChild(script);
  
      // Mettre à jour les noms des joueurs dans le jeu
      // Cette partie dépend de l'implémentation de votre jeu
      window.currentPlayers = {
        player1: player1,
        player2: player2
      };
    }
  
    endGame() {
      // Cacher le conteneur de jeu
      this.gameContainer.style.display = 'none';
      
      // Nettoyer les ressources du jeu
      this.gameElement.innerHTML = '';
    }
  }
  
  // Modification du gestionnaire d'événements existant pour le bouton "LAUNCH NEXT MATCH"
  document.addEventListener('DOMContentLoaded', () => {
    const gameManager = new TournamentGameManager(tournamentState);
  
    const playButton = document.querySelector('.buttonPlay');
    if (playButton) {
      playButton.addEventListener('click', () => {
        if (tournamentState.isStarted) {
          gameManager.startGame();
        } else {
          const playerCount = getSelectedPlayerCount();
          openTournamentConfig(playerCount);
        }
      });
    }
  });