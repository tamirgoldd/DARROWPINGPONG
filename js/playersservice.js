/**
 * Service for managing player data and operations
 */

const PlayersService = (function() {
    /**
     * Calculate player statistics
     * @param {string} playerId - The player ID
     * @returns {Object} The updated player stats
     */
    function calculatePlayerStats(playerId) {
        const games = DataService.getGames();
        const playerGames = games.filter(game => 
            (game.player1.id === playerId || game.player2.id === playerId) && 
            game.completed
        );
        
        const wins = playerGames.filter(game => game.winner === playerId).length;
        const gamesPlayed = playerGames.length;
        const losses = gamesPlayed - wins;
        const winPercentage = Utils.calculateWinPercentage(wins, gamesPlayed);
        
        return {
            gamesPlayed,
            wins,
            losses,
            winPercentage
        };
    }

    /**
     * Update statistics for all players
     */
    function updateAllPlayerStats() {
        const players = DataService.getPlayers();
        
        players.forEach(player => {
            const stats = calculatePlayerStats(player.id);
            DataService.updatePlayer(player.id, { stats });
        });
    }

    // Public API
    return {
        /**
         * Get all players
         * @returns {Array} All players
         */
        getAllPlayers: function() {
            return DataService.getPlayers();
        },
        
        /**
         * Get a player by ID
         * @param {string} id - The player ID
         * @returns {Object|null} The player or null if not found
         */
        getPlayer: function(id) {
            return DataService.getPlayerById(id);
        },
        
        /**
         * Create a new player
         * @param {Object} playerData - Player data (name, email)
         * @returns {Object} The created player
         */
        createPlayer: function(playerData) {
            return DataService.addPlayer(playerData);
        },
        
        /**
         * Update a player
         * @param {string} id - The player ID
         * @param {Object} updates - The properties to update
         * @returns {Object|null} The updated player or null if not found
         */
        updatePlayer: function(id, updates) {
            return DataService.updatePlayer(id, updates);
        },
        
        /**
         * Delete a player
         * @param {string} id - The player ID
         * @returns {boolean} Whether the player was deleted
         */
        deletePlayer: function(id) {
            return DataService.deletePlayer(id);
        },
        
        /**
         * Get top players by win percentage (minimum 3 games)
         * @param {number} limit - Maximum number of players to return
         * @returns {Array} Top players
         */
        getTopPlayers: function(limit = 5) {
            const players = this.getAllPlayers();
            
            return players
                .filter(player => player.stats.gamesPlayed >= 3)
                .sort((a, b) => {
                    // First sort by win percentage
                    if (b.stats.winPercentage !== a.stats.winPercentage) {
                        return b.stats.winPercentage - a.stats.winPercentage;
                    }
                    // If win percentage is the same, sort by number of games
                    return b.stats.gamesPlayed - a.stats.gamesPlayed;
                })
                .slice(0, limit);
        },
        
        /**
         * Get player ranking (position in the leaderboard)
         * @param {string} playerId - The player ID
         * @returns {number} The player's rank (1-based) or -1 if not ranked
         */
        getPlayerRank: function(playerId) {
            const players = this.getAllPlayers();
            
            const rankedPlayers = players
                .filter(player => player.stats.gamesPlayed >= 3)
                .sort((a, b) => {
                    // First sort by win percentage
                    if (b.stats.winPercentage !== a.stats.winPercentage) {
                        return b.stats.winPercentage - a.stats.winPercentage;
                    }
                    // If win percentage is the same, sort by number of games
                    return b.stats.gamesPlayed - a.stats.gamesPlayed;
                });
            
            const playerIndex = rankedPlayers.findIndex(player => player.id === playerId);
            return playerIndex === -1 ? -1 : playerIndex + 1;
        },
        
        /**
         * Update player statistics after a game
         * @param {string} player1Id - Player 1 ID
         * @param {string} player2Id - Player 2 ID
         */
        updatePlayersAfterGame: function(player1Id, player2Id) {
            const player1Stats = calculatePlayerStats(player1Id);
            const player2Stats = calculatePlayerStats(player2Id);
            
            DataService.updatePlayer(player1Id, { stats: player1Stats });
            DataService.updatePlayer(player2Id, { stats: player2Stats });
        },
        
        /**
         * Update all player statistics
         */
        updateAllStats: function() {
            updateAllPlayerStats();
        },
        
        /**
         * Get players for a dropdown selector
         * @returns {Array} Array of { id, name } objects
         */
        getPlayersForSelector: function() {
            const players = this.getAllPlayers();
            return players.map(player => ({
                id: player.id,
                name: player.name
            }));
        }
    };
})();
