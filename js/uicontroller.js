/**
 * Controller for managing the user interface
 */

const UIController = (function() {
    // DOM Elements
    const elements = {
        views: {
            dashboard: document.getElementById('dashboard-view'),
            newGame: document.getElementById('newgame-view'),
            players: document.getElementById('players-view'),
            history: document.getElementById('history-view')
        },
        nav: {
            dashboard: document.getElementById('nav-dashboard'),
            newGame: document.getElementById('nav-newgame'),
            players: document.getElementById('nav-players'),
            history: document.getElementById('nav-history')
        },
        dashboard: {
            leaderboard: document.getElementById('leaderboard-container'),
            recentGames: document.getElementById('recent-games-container'),
            stats: document.getElementById('stats-container')
        },
        newGame: {
            form: document.getElementById('new-game-form'),
            player1Select: document.getElementById('player1'),
            player2Select: document.getElementById('player2'),
            activeGameContainer: document.getElementById('active-game-container'),
            player1Name: document.getElementById('game-player1-name'),
            player2Name: document.getElementById('game-player2-name'),
            player1Score: document.getElementById('p1-score'),
            player2Score: document.getElementById('p2-score'),
            player1ScorePlus: document.getElementById('p1-score-plus'),
            player1ScoreMinus: document.getElementById('p1-score-minus'),
            player2ScorePlus: document.getElementById('p2-score-plus'),
            player2ScoreMinus: document.getElementById('p2-score-minus'),
            endGameBtn: document.getElementById('end-game-btn')
        },
        players: {
            container: document.getElementById('players-container'),
            addBtn: document.getElementById('add-player-btn'),
            modal: document.getElementById('add-player-modal'),
            form: document.getElementById('add-player-form'),
            nameInput: document.getElementById('player-name'),
            emailInput: document.getElementById('player-email'),
            cancelBtn: document.getElementById('cancel-add-player')
        },
        history: {
            container: document.getElementById('history-container'),
            search: document.getElementById('history-search'),
            filter: document.getElementById('history-filter')
        },
        footer: {
            year: document.getElementById('current-year')
        }
    };

    /**
     * Hide all views
     */
    function hideAllViews() {
        Object.values(elements.views).forEach(view => {
            view.classList.add('hidden');
        });
        
        // Reset active nav button
        Object.values(elements.nav).forEach(btn => {
            btn.classList.remove('active');
        });
    }

    /**
     * Show a specific view
     * @param {string} viewName - The view name to show
     */
    function showView(viewName) {
        hideAllViews();
        
        // Show the view
        elements.views[viewName].classList.remove('hidden');
        
        // Set active nav button
        elements.nav[viewName].classList.add('active');
        
        // Load view-specific data
        switch (viewName) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'newGame':
                renderNewGameView();
                break;
            case 'players':
                renderPlayersView();
                break;
            case 'history':
                renderHistoryView();
                break;
        }
    }

    /**
     * Render the dashboard view
     */
    function renderDashboard() {
        renderLeaderboard();
        renderRecentGames();
        renderStats();
    }

    /**
     * Render the leaderboard
     */
    function renderLeaderboard() {
        const container = elements.dashboard.leaderboard;
        Utils.clearElement(container);
        
        const topPlayers = PlayersService.getTopPlayers(5);
        
        if (topPlayers.length === 0) {
            container.textContent = 'No players with enough games yet. Start playing!';
            return;
        }
        
        const leaderboardTable = Utils.createElement('table', { className: 'leaderboard-table' });
        
        // Create header
        const tableHead = Utils.createElement('thead');
        const headerRow = Utils.createElement('tr');
        
        ['Rank', 'Player', 'Win %', 'W', 'L'].forEach(header => {
            headerRow.appendChild(Utils.createElement('th', {}, header));
        });
        
        tableHead.appendChild(headerRow);
        leaderboardTable.appendChild(tableHead);
        
        // Create body
        const tableBody = Utils.createElement('tbody');
        
        topPlayers.forEach((player, index) => {
            const row = Utils.createElement('tr');
            
            // Rank
            row.appendChild(Utils.createElement('td', { className: 'rank' }, `#${index + 1}`));
            
            // Player
            row.appendChild(Utils.createElement('td', { className: 'player-name' }, player.name));
            
            // Win %
            row.appendChild(Utils.createElement('td', { className: 'win-percent' }, `${player.stats.winPercentage}%`));
            
            // Wins
            row.appendChild(Utils.createElement('td', { className: 'wins' }, player.stats.wins));
            
            // Losses
            row.appendChild(Utils.createElement('td', { className: 'losses' }, player.stats.losses));
            
            tableBody.appendChild(row);
        });
        
        leaderboardTable.appendChild(tableBody);
        container.appendChild(leaderboardTable);
    }

    /**
     * Render recent games
     */
    function renderRecentGames() {
        const container = elements.dashboard.recentGames;
        Utils.clearElement(container);
        
        const recentGames = GamesService.getRecentGames(5);
        
        if (recentGames.length === 0) {
            container.textContent = 'No games played yet. Start a new game!';
            return;
        }
        
        const gamesList = Utils.createElement('div', { className: 'game-history-list' });
        
        recentGames.forEach(game => {
            const gameItem = Utils.createElement('div', { className: 'game-item' });
            
            // Game players and result
            const gameInfo = Utils.createElement('div', { className: 'game-info' });
            
            const gamePlayers = Utils.createElement('div', { className: 'game-players' });
            const player1Name = Utils.createElement('span', {
                className: game.winner === game.player1.id ? 'winner' : ''
            }, game.player1.name);
            const player2Name = Utils.createElement('span', {
                className: game.winner === game.player2.id ? 'winner' : ''
            }, game.player2.name);
            
            gamePlayers.appendChild(player1Name);
            gamePlayers.appendChild(Utils.createElement('span', {}, ' vs '));
            gamePlayers.appendChild(player2Name);
            
            const gameResult = Utils.createElement('div', { className: 'game-result' }, 
                `${game.score1} - ${game.score2}`
            );
            
            const gameDate = Utils.createElement('div', { className: 'game-date' }, 
                Utils.formatDate(game.createdAt, true)
            );
            
            gameInfo.appendChild(gamePlayers);
            gameInfo.appendChild(gameResult);
            
            gameItem.appendChild(gameInfo);
            gameItem.appendChild(gameDate);
            
            gamesList.appendChild(gameItem);
        });
        
        container.appendChild(gamesList);
    }

    /**
     * Render game statistics
     */
    function renderStats() {
        const container = elements.dashboard.stats;
        Utils.clearElement(container);
        
        const stats = GamesService.getGameStats();
        
        if (stats.totalGames === 0) {
            container.textContent = 'No games played yet. Start a new game!';
            return;
        }
        
        const statsList = Utils.createElement('div', { className: 'stats-list' });
        
        // Total games
        const totalGamesItem = Utils.createElement('div', { className: 'stat-item' });
        totalGamesItem.appendChild(Utils.createElement('div', { className: 'stat-label' }, 'Total Games'));
        totalGamesItem.appendChild(Utils.createElement('div', { className: 'stat-value' }, stats.totalGames));
        statsList.appendChild(totalGamesItem);
        
        // Games today
        const gamesTodayItem = Utils.createElement('div', { className: 'stat-item' });
        gamesTodayItem.appendChild(Utils.createElement('div', { className: 'stat-label' }, 'Games Today'));
        gamesTodayItem.appendChild(Utils.createElement('div', { className: 'stat-value' }, stats.gamesToday));
        statsList.appendChild(gamesTodayItem);
        
        // Games this week
        const gamesThisWeekItem = Utils.createElement('div', { className: 'stat-item' });
        gamesThisWeekItem.appendChild(Utils.createElement('div', { className: 'stat-label' }, 'Games This Week'));
        gamesThisWeekItem.appendChild(Utils.createElement('div', { className: 'stat-value' }, stats.gamesThisWeek));
        statsList.appendChild(gamesThisWeekItem);
        
        // Avg points per game
        const avgPointsItem = Utils.createElement('div', { className: 'stat-item' });
        avgPointsItem.appendChild(Utils.createElement('div', { className: 'stat-label' }, 'Avg Points/Game'));
        avgPointsItem.appendChild(Utils.createElement('div', { className: 'stat-value' }, stats.avgPointsPerGame));
        statsList.appendChild(avgPointsItem);
        
        container.appendChild(statsList);
    }

    /**
     * Render the new game view
     */
    function renderNewGameView() {
        // Populate player select dropdowns
        populatePlayerSelects();
        
        // Check if there's an active game
        updateActiveGameDisplay();
    }

    /**
     * Populate player select dropdowns
     */
    function populatePlayerSelects() {
        const players = PlayersService.getPlayersForSelector();
        const player1Select = elements.newGame.player1Select;
        const player2Select = elements.newGame.player2Select;
        
        // Clear existing options
        Utils.clearElement(player1Select);
        Utils.clearElement(player2Select);
        
        // Add default option
        player1Select.appendChild(Utils.createElement('option', { value: '' }, 'Select Player 1'));
        player2Select.appendChild(Utils.createElement('option', { value: '' }, 'Select Player 2'));
        
        // Add player options
        players.forEach(player => {
            const option1 = Utils.createElement('option', { value: player.id }, player.name);
            const option2 = Utils.createElement('option', { value: player.id }, player.name);
            
            player1Select.appendChild(option1);
            player2Select.appendChild(option2);
        });
    }

    /**
     * Update the active game display
     */
    function updateActiveGameDisplay() {
        const currentGame = GamesService.getCurrentGame();
        
        if (currentGame) {
            // Hide new game form
            Utils.hideElement(elements.newGame.form);
            
            // Show active game
            Utils.showElement(elements.newGame.activeGameContainer);
            
            // Update player names
            elements.newGame.player1Name.textContent = currentGame.player1.name;
            elements.newGame.player2Name.textContent = currentGame.player2.name;
            
            // Update scores
            elements.newGame.player1Score.textContent = currentGame.score1;
            elements.newGame.player2Score.textContent = currentGame.score2;
        } else {
            // Show new game form
            Utils.showElement(elements.newGame.form);
            
            // Hide active game
            Utils.hideElement(elements.newGame.activeGameContainer);
        }
    }

    /**
     * Render the players view
     */
    function renderPlayersView() {
        const container = elements.players.container;
        Utils.clearElement(container);
        
        const players = PlayersService.getAllPlayers();
        
        if (players.length === 0) {
            container.textContent = 'No players yet. Add a player to get started!';
            return;
        }
        
        const playerList = Utils.createElement('div', { className: 'player-list' });
        
        players.forEach(player => {
            const playerCard = Utils.createElement('div', { className: 'player-card' });
            
            // Player name
            playerCard.appendChild(Utils.createElement('div', { className: 'player-name' }, player.name));
            
            // Player stats
            const playerStats = Utils.createElement('div', { className: 'player-stats' });
            
            const gamesPlayedSpan = Utils.createElement('span', {}, `${player.stats.gamesPlayed} games`);
            const winLossSpan = Utils.createElement('span', {}, `${player.stats.wins}W - ${player.stats.losses}L`);
            const winPercentSpan = Utils.createElement('span', {}, `${player.stats.winPercentage}% win rate`);
            
            playerStats.appendChild(gamesPlayedSpan);
            playerStats.appendChild(Utils.createElement('span', {}, ' | '));
            playerStats.appendChild(winLossSpan);
            playerStats.appendChild(Utils.createElement('span', {}, ' | '));
            playerStats.appendChild(winPercentSpan);
            
            playerCard.appendChild(playerStats);
            
            playerList.appendChild(playerCard);
        });
        
        container.appendChild(playerList);
    }

    /**
     * Render the history view
     */
    function renderHistoryView() {
        filterAndRenderHistory();
    }

    /**
     * Filter and render game history
     */
    function filterAndRenderHistory() {
        const container = elements.history.container;
        Utils.clearElement(container);
        
        const searchTerm = elements.history.search.value;
        const dateFilter = elements.history.filter.value;
        
        const filters = {
            completed: true,
            searchTerm: searchTerm,
            dateFilter: dateFilter === 'all' ? null : dateFilter,
            sortBy: 'date-desc'
        };
        
        const games = GamesService.filterGames(filters);
        
        if (games.length === 0) {
            container.textContent = 'No games found matching your criteria.';
            return;
        }
        
        const gamesList = Utils.createElement('div', { className: 'game-history-list' });
        
        games.forEach(game => {
            const gameItem = Utils.createElement('div', { className: 'game-item' });
            
            // Game info
            const gameInfo = Utils.createElement('div', { className: 'game-info' });
            
            // Game players
            const gamePlayers = Utils.createElement('div', { className: 'game-players' });
            const player1Name = Utils.createElement('span', {
                className: game.winner === game.player1.id ? 'winner' : ''
            }, game.player1.name);
            const player2Name = Utils.createElement('span', {
                className: game.winner === game.player2.id ? 'winner' : ''
            }, game.player2.name);
            
            gamePlayers.appendChild(player1Name);
            gamePlayers.appendChild(Utils.createElement('span', {}, ' vs '));
            gamePlayers.appendChild(player2Name);
            
            // Game result
            const gameResult = Utils.createElement('div', { className: 'game-result' }, 
                `${game.score1} - ${game.score2}`
            );
            
            gameInfo.appendChild(gamePlayers);
            gameInfo.appendChild(gameResult);
            
            // Game date
            const gameDate = Utils.createElement('div', { className: 'game-date' }, 
                Utils.formatDate(game.createdAt, true)
            );
            
            gameItem.appendChild(gameInfo);
            gameItem.appendChild(gameDate);
            
            gamesList.appendChild(gameItem);
        });
        
        container.appendChild(gamesList);
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Navigation
        Object.entries(elements.nav).forEach(([viewName, btn]) => {
            btn.addEventListener('click', () => showView(viewName));
        });
        
        // New Game Form
        elements.newGame.form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const player1Id = elements.newGame.player1Select.value;
            const player2Id = elements.newGame.player2Select.value;
            const pointsLimit = document.querySelector('input[name="game-type"]:checked').value;
            
            if (!player1Id || !player2Id) {
                alert('Please select both players');
                return;
            }
            
            if (player1Id === player2Id) {
                alert('Please select different players');
                return;
            }
            
            // Start new game
            GamesService.startGame({
                player1: player1Id,
                player2: player2Id,
                pointsLimit: parseInt(pointsLimit)
            });
            
            // Update UI
            updateActiveGameDisplay();
        });
        
        // Score Controls
        elements.newGame.player1ScorePlus.addEventListener('click', function() {
            const currentGame = GamesService.getCurrentGame();
            if (currentGame) {
                GamesService.updateScore(1, currentGame.score1 + 1);
                updateActiveGameDisplay();
            }
        });
        
        elements.newGame.player1ScoreMinus.addEventListener('click', function() {
            const currentGame = GamesService.getCurrentGame();
            if (currentGame && currentGame.score1 > 0) {
                GamesService.updateScore(1, currentGame.score1 - 1);
                updateActiveGameDisplay();
            }
        });
        
        elements.newGame.player2ScorePlus.addEventListener('click', function() {
            const currentGame = GamesService.getCurrentGame();
            if (currentGame) {
                GamesService.updateScore(2, currentGame.score2 + 1);
                updateActiveGameDisplay();
            }
        });
        
        elements.newGame.player2ScoreMinus.addEventListener('click', function() {
            const currentGame = GamesService.getCurrentGame();
            if (currentGame && currentGame.score2 > 0) {
                GamesService.updateScore(2, currentGame.score2 - 1);
                updateActiveGameDisplay();
            }
        });
        
        // End Game Button
        elements.newGame.endGameBtn.addEventListener('click', function() {
            const currentGame = GamesService.getCurrentGame();
            if (currentGame) {
                // Check if scores meet end game requirements
                const winner = currentGame.score1 > currentGame.score2 ? currentGame.player1.id : currentGame.player2.id;
                const pointDiff = Math.abs(currentGame.score1 - currentGame.score2);
                const pointsLimit = currentGame.pointsLimit;
                const maxScore = Math.max(currentGame.score1, currentGame.score2);
                
                // If game is not naturally finished, confirm with user
                if (maxScore < pointsLimit || pointDiff < 2) {
                    const confirm = window.confirm('This game has not reached the winning conditions. Are you sure you want to end it?');
                    if (!confirm) return;
                }
                
                // End the game
                GamesService.endGame(true);
                
                // Update UI
                updateActiveGameDisplay();
                
                // Show dashboard
                showView('dashboard');
            }
        });
        
        // Add Player Button
        elements.players.addBtn.addEventListener('click', function() {
            Utils.showElement(elements.players.modal);
        });
        
        // Cancel Add Player
        elements.players.cancelBtn.addEventListener('click', function() {
            Utils.hideElement(elements.players.modal);
            elements.players.form.reset();
        });
        
        // Add Player Form
        elements.players.form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = elements.players.nameInput.value.trim();
            const email = elements.players.emailInput.value.trim();
            
            if (!name) {
                alert('Please enter a player name');
                return;
            }
            
            // Add player
            PlayersService.createPlayer({
                name: name,
                email: email
            });
            
            // Hide modal and reset form
            Utils.hideElement(elements.players.modal);
            elements.players.form.reset();
            
            // Update UI
            renderPlayersView();
        });
        
        // History Search and Filter
        elements.history.search.addEventListener('input', filterAndRenderHistory);
        elements.history.filter.addEventListener('change', filterAndRenderHistory);
    }

    // Public API
    return {
        /**
         * Initialize the UI controller
         */
        init: function() {
            // Set current year in footer
            elements.footer.year.textContent = new Date().getFullYear();
            
            // Setup event listeners
            setupEventListeners();
            
            // Show dashboard view by default
            showView('dashboard');
        },
        
        /**
         * Update the UI
         */
        update: function() {
            // Update based on current view
            const activeView = Object.entries(elements.nav).find(([_, btn]) => 
                btn.classList.contains('active')
            );
            
            if (activeView) {
                showView(activeView[0]);
            }
        }
    };
})();
