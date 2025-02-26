/**
 * Service for managing game data and operations
 */

const GamesService = (function() {
    // Current active game
    let currentGame = null;

    /**
     * Determine winner based on scores
     * @param {Object} game - Game object with scores
     * @returns {string|null} Winner player ID or null if no winner
     */
    function determineWinner(game) {
        const { player1, player2, score1, score2, pointsLimit } = game;
        
        // Check if either player has reached or exceeded the points limit
        const pointDifference = Math.abs(score1 - score2);
        
        if (score1 >= pointsLimit && pointDifference >= 2) {
            return player1.id;
        } else if (score2 >= pointsLimit && pointDifference >= 2) {
            return player2.id;
        }
        
        return null;
    }

    // Public API
    return {
        /**
         * Get all games
         * @returns {Array} All games
         */
        getAllGames: function() {
            return DataService.getGames();
        },
        
        /**
         * Get a game by ID
         * @param {string} id - The game ID
         * @returns {Object|null} The game or null if not found
         */
        getGame: function(id) {
            return DataService.getGameById(id);
        },
        
        /**
         * Start a new game
         * @param {Object} gameData - Game data (player1, player2, pointsLimit)
         * @returns {Object} The created game
         */
        startGame: function(gameData) {
            const player1 = PlayersService.getPlayer(gameData.player1);
            const player2 = PlayersService.getPlayer(gameData.player2);
            
            if (!player1 || !player2) {
                throw new Error('Invalid players selected');
            }
            
            const newGame = {
                player1: {
                    id: player1.id,
                    name: player1.name
                },
                player2: {
                    id: player2.id,
                    name: player2.name
                },
                score1: 0,
                score2: 0,
                winner: null,
                pointsLimit: gameData.pointsLimit || 11,
                completed: false
            };
            
            currentGame = DataService.addGame(newGame);
            return currentGame;
        },
        
        /**
         * Update score for the current game
         * @param {number} player - Player number (1 or 2)
         * @param {number} score - New score value
         * @returns {Object|null} The updated game or null if no active game
         */
        updateScore: function(player, score) {
            if (!currentGame) return null;
            
            // Ensure score is not negative
            score = Math.max(0, score);
            
            const updates = player === 1 
                ? { score1: score } 
                : { score2: score };
            
            // Update the current game object
            currentGame = {
                ...currentGame,
                ...updates
            };
            
            // Check for winner
            const winner = determineWinner(currentGame);
            if (winner) {
                currentGame.winner = winner;
            }
            
            // Update in data service
            currentGame = DataService.updateGame(currentGame.id, updates);
            
            return currentGame;
        },
        
        /**
         * End the current game
         * @param {boolean} forceComplete - Force game completion regardless of score
         * @returns {Object|null} The completed game or null if no active game
         */
        endGame: function(forceComplete = false) {
            if (!currentGame) return null;
            
            // Determine winner if not already set
            if (!currentGame.winner) {
                currentGame.winner = determineWinner(currentGame);
            }
            
            // If no winner and not forcing completion, don't complete the game
            if (!currentGame.winner && !forceComplete) {
                return currentGame;
            }
            
            // Mark game as completed
            const updates = { 
                completed: true,
                winner: currentGame.winner || (currentGame.score1 > currentGame.score2 ? currentGame.player1.id : currentGame.player2.id)
            };
            
            // Update in data service
            const completedGame = DataService.updateGame(currentGame.id, updates);
            
            // Update player stats
            PlayersService.updatePlayersAfterGame(
                currentGame.player1.id,
                currentGame.player2.id
            );
            
            // Clear current game
            currentGame = null;
            
            return completedGame;
        },
        
        /**
         * Get the current active game
         * @returns {Object|null} The current game or null if no active game
         */
        getCurrentGame: function() {
            return currentGame;
        },
        
        /**
         * Check if there is an active game
         * @returns {boolean} Whether there is an active game
         */
        hasActiveGame: function() {
            return currentGame !== null;
        },
        
        /**
         * Cancel the current game without saving it
         * @returns {boolean} Whether a game was canceled
         */
        cancelGame: function() {
            if (!currentGame) return false;
            
            // Delete the game from storage
            DataService.deleteGame(currentGame.id);
            
            // Clear current game
            currentGame = null;
            
            return true;
        },
        
        /**
         * Get recent games
         * @param {number} limit - Maximum number of games to return
         * @returns {Array} Recent completed games
         */
        getRecentGames: function(limit = 5) {
            const games = this.getAllGames();
            
            return games
                .filter(game => game.completed)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, limit);
        },
        
        /**
         * Filter games by various criteria
         * @param {Object} filters - Filter criteria
         * @returns {Array} Filtered games
         */
        filterGames: function(filters = {}) {
            let games = this.getAllGames();
            
            // Filter by completion status
            if (typeof filters.completed === 'boolean') {
                games = games.filter(game => game.completed === filters.completed);
            }
            
            // Filter by player
            if (filters.playerId) {
                games = games.filter(game => 
                    game.player1.id === filters.playerId || 
                    game.player2.id === filters.playerId
                );
            }
            
            // Filter by date
            if (filters.dateFilter) {
                switch (filters.dateFilter) {
                    case 'today':
                        games = games.filter(game => Utils.isToday(game.createdAt));
                        break;
                    case 'week':
                        games = games.filter(game => Utils.isThisWeek(game.createdAt));
                        break;
                    case 'month':
                        games = games.filter(game => Utils.isThisMonth(game.createdAt));
                        break;
                }
            }
            
            // Filter by search term (match player names)
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                games = games.filter(game => 
                    game.player1.name.toLowerCase().includes(term) || 
                    game.player2.name.toLowerCase().includes(term)
                );
            }
            
            // Sort
            if (filters.sortBy) {
                switch (filters.sortBy) {
                    case 'date-asc':
                        games.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                        break;
                    case 'date-desc':
                    default:
                        games.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        break;
                }
            } else {
                // Default sort by date descending
                games.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            
            return games;
        },
        
        /**
         * Get game statistics
         * @returns {Object} Game statistics
         */
        getGameStats: function() {
            const games = this.getAllGames().filter(game => game.completed);
            
            // Total games
            const totalGames = games.length;
            
            // Games today
            const gamesToday = games.filter(game => Utils.isToday(game.createdAt)).length;
            
            // Games this week
            const gamesThisWeek = games.filter(game => Utils.isThisWeek(game.createdAt)).length;
            
            // Average points per game
            let totalPoints = 0;
            games.forEach(game => {
                totalPoints += game.score1 + game.score2;
            });
            const avgPointsPerGame = totalGames ? Math.round(totalPoints / totalGames) : 0;
            
            // Closest games (smallest point difference)
            const closestGames = [...games]
                .sort((a, b) => 
                    Math.abs(a.score1 - a.score2) - Math.abs(b.score1 - b.score2)
                )
                .slice(0, 3);
            
            return {
                totalGames,
                gamesToday,
                gamesThisWeek,
                avgPointsPerGame,
                closestGames
            };
        }
    };
})();
