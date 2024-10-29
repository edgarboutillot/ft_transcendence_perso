let tournament = {
	players: [],
	matches: [],
	currentRound: 1,
	currentMatch: 0
};

function startPlayerEntry() {
	const count = parseInt(document.getElementById('playerCount').value);
	const container = document.getElementById('playerInputs');
	container.innerHTML = '';

	for (let i = 1; i <= count; i++) {
		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = `Nom du joueur ${i}`;
		input.required = true;
		container.appendChild(input);
	}

	document.getElementById('playerEntryForm').style.display = 'block';
}

function startTournament() {
	const inputs = document.querySelectorAll('#playerInputs input');
	tournament.players = Array.from(inputs).map(input => input.value);

	if (tournament.players.some(p => !p)) {
		alert('Veuillez remplir tous les noms des joueurs');
		return;
	}

	generateMatches();
	document.getElementById('setupPhase').style.display = 'none';
	document.getElementById('tournamentPhase').style.display = 'block';
	updateBracket();
}

function generateMatches() {
	let round = 1;
	let matchNumber = 0;
	let roundPlayers = [...tournament.players];

	while (roundPlayers.length > 1) {
		const roundMatches = [];
		for (let i = 0; i < roundPlayers.length; i += 2) {
			roundMatches.push({
				id: matchNumber++,
				round: round,
				player1: roundPlayers[i],
				player2: roundPlayers[i + 1],
				player1Score: null,
				player2Score: null,
				winner: null,
				completed: false
			});
		}
		tournament.matches.push(...roundMatches);
		roundPlayers = roundPlayers.filter((_, i) => i % 2 === 0);
		round++;
	}
}

function updateBracket() {
	const bracket = document.getElementById('bracket');
	bracket.innerHTML = '';

	const rounds = {};
	tournament.matches.forEach(match => {
		if (!rounds[match.round]) rounds[match.round] = [];
		rounds[match.round].push(match);
	});

	Object.keys(rounds).forEach(roundNum => {
		const round = document.createElement('div');
		round.className = 'round';
		round.innerHTML = `<h3>Round ${roundNum}</h3>`;

		rounds[roundNum].forEach(match => {
			const matchEl = document.createElement('div');
			matchEl.className = `match ${match.id === tournament.currentMatch ? 'active' : ''}`;

			matchEl.innerHTML = `
				<div class="player ${match.winner === match.player1 ? 'winner' : ''}">
					${match.player1}
					<span class="score">${match.player1Score ?? '-'}</span>
				</div>
				<div class="player ${match.winner === match.player2 ? 'winner' : ''}">
					${match.player2}
					<span class="score">${match.player2Score ?? '-'}</span>
				</div>
				${!match.completed && match.id === tournament.currentMatch ? `
					<div class="controls">
						<input type="number" id="score1" placeholder="Score 1" min="0">
						<input type="number" id="score2" placeholder="Score 2" min="0">
						<button onclick="submitScore()">Valider</button>
					</div>
				` : ''}
			`;

			round.appendChild(matchEl);
		});

		bracket.appendChild(round);
	});

	updateStatus();
}

function submitScore() {
	const score1 = parseInt(document.getElementById('score1').value);
	const score2 = parseInt(document.getElementById('score2').value);

	if (isNaN(score1) || isNaN(score2) || score1 === score2) {
		alert('Scores invalides');
		return;
	}

	const match = tournament.matches[tournament.currentMatch];
	match.player1Score = score1;
	match.player2Score = score2;
	match.winner = score1 > score2 ? match.player1 : match.player2;
	match.completed = true;

	// Mettre à jour le prochain match
	const nextRoundMatch = tournament.matches.find(m =>
		m.round === match.round + 1 &&
		(!m.player1 || !m.player2)
	);

	if (nextRoundMatch) {
		if (!nextRoundMatch.player1) {
			nextRoundMatch.player1 = match.winner;
		} else {
			nextRoundMatch.player2 = match.winner;
		}
	}

	tournament.currentMatch++;
	updateBracket();
}

function updateStatus() {
	const status = document.getElementById('statusMessage');
	if (tournament.currentMatch >= tournament.matches.length) {
		const winner = tournament.matches[tournament.matches.length - 1].winner;
		status.innerHTML = `
	<h2>🏆 Tournoi terminé! Vainqueur: ${winner} 🏆</h2>
	<button onclick="restartTournament()" class="restart-button">
		Nouveau Tournoi
	</button>
`;
		status.style.background = '#065f46';
	} else {
		const currentMatch = tournament.matches[tournament.currentMatch];
		status.innerHTML = `Match en cours: ${currentMatch.player1} vs ${currentMatch.player2}`;
		status.style.background = '#1e40af';
	}
}

// Ajouter la nouvelle fonction de restart
function restartTournament() {
	// Réinitialiser l'état du tournoi
	tournament = {
		players: [],
		matches: [],
		currentRound: 1,
		currentMatch: 0
	};

	// Nettoyer l'affichage du bracket
	const bracket = document.getElementById('bracket');
	bracket.innerHTML = '';

	// Réinitialiser les éléments de l'interface
	document.getElementById('playerInputs').innerHTML = '';
	document.getElementById('playerEntryForm').style.display = 'none';
	document.getElementById('tournamentPhase').style.display = 'none';
	document.getElementById('setupPhase').style.display = 'block';

	// Réinitialiser le select du nombre de joueurs
	const playerCount = document.getElementById('playerCount');
	if (playerCount) {
		playerCount.selectedIndex = 0;
	}

	// Réinitialiser le message de statut
	const status = document.getElementById('statusMessage');
	status.innerHTML = '';
	status.style.background = '';
}
