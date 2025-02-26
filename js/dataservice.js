/**
 * Data service for handling storage operations
 * This can be easily replaced with server calls later
 */

const DataService = (function() {
    // Storage keys
    const KEYS = {
        PLAYERS: 'pingpong_players',
        GAMES: 'pingpong_games',
        SETTINGS: 'pingpong_settings'
    };

    /**
     * Get data from localStorage
     * @param {string} key - The storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} The retrieved data or default value
     */
    function getData(key, defaultValue = null) {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                console.error(`Error parsing data for key ${key}:`, error);
                return defaultValue;
            }
        }
        return defaultValue;
    }

    /**
     * Save data to localStorage
     * @param {string} key - The storage key
     * @param {*} data - The data to save
     */
    function saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving data for key ${key}:`, error);
        }
    }

    /**
     * Initialize with default data if empty
     */
    function initialize() {
        // Initialize players if empty
        if (!getData(KEYS.PLAYERS)) {
            saveData(KEYS.PLAYERS, []);
        }

        // Initialize games if empty
        if (!getData(KEYS.GAMES)) {
            saveData(KEYS.GAMES, []);
        }

        // Initialize settings if empty
        if (!getData(KEYS.SETTINGS)) {
            saveData(KEYS.SETTINGS, {
                defaultGameType: 11,
                theme: 'light'
            });
        }
    }

    // Public API
    return {
        /**
         * Initialize the data service
         */
        init: function() {
            initialize();
        },

        /**
         * Get all players
         * @returns {Array} All players
         */
        getPlayers: function() {
            return getData(KEYS.PLAYERS, []);
        },

        /**
         * Get a player by ID
         * @param {string} id - The player ID
         * @returns {Object|null} The player object or null if not found
         */
        getPlayerById: function(id) {
            const players = this.getPlayers();
            return players.find(player => player.id === id) || null;
        },

        /**
         * Add a new player
         * @param {Object} player - The player object to add
         * @returns {Object} The added player with generated ID
         */
        addPlayer: function(player) {
            const players = this.getPlayers();
            const newPlayer = {
                id: Utils.generateId(),
                name: player.name,
                email: player.email || '',
                createdAt: new Date().toISOString(),
                stats: {
                    gamesPlayed: 0,
                    wins: 0,
                    losses: 0,
                    winPercentage: 0
                }
            };
            
            players.push(newPlayer);
            saveData(KEYS.PLAYERS, players);
            return newPlayer;
        },

        /**
         * Update a player
         * @param {string} id - The player ID
         * @param {Object} updates - The properties to update
         * @returns {Object|null} The updated player or null if not found
         */
        updatePlayer: function(id, updates) {
            const players = this.getPlayers();
            const index = players.findIndex(player => player.id === id);
            
            if (index !== -1) {
                players[index] = { ...players[index], ...updates };
                saveData(KEYS.PLAYERS, players);
                return players[index];
            }
            
            return null;
        },

        /**
         * Delete a player
         * @param {string} id - The player ID
         * @returns {boolean} Whether the player was deleted
         */
        deletePlayer: function(id) {
            const players = this.getPlayers();
            const filteredPlayers = players.filter(player => player.id !== id);
            
            if (filteredPlayers.length !== players.length) {
                saveData(KEYS.PLAYERS, filteredPlayers);
                return true;
            }
            
            return false;
        },

        /**
         * Get all games
         * @returns {Array} All games
         */
        getGames: function() {
            return getData(KEYS.GAMES, []);
        },

        /**
         * Get a game by ID
         * @param {string} id - The game ID
         * @returns {Object|null} The game object or null if not found
         */
        getGameById: function(id) {
            const games = this.getGames();
            return games.find(game => game.id === id) || null;
        },

        /**
         * Add a new game
         * @param {Object} game - The game object to add
         * @returns {Object} The added game with generated ID
         */
        addGame: function(game) {
            const games = this.getGames();
            const newGame = {
                id: Utils.generateId(),
                player1: game.player1,
                player2: game.player2,
                score1: game.score1,
                score2: game.score2,
                winner: game.winner,
                pointsLimit: game.pointsLimit || 11,
                completed: game.completed || false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            games.push(newGame);
            saveData(KEYS.GAMES, games);
            return newGame;
        },

        /**
         * Update a game
         * @param {string} id - The game ID
         * @param {Object} updates - The properties to update
         * @returns {Object|null} The updated game or null if not found
         */
        updateGame: function(id, updates) {
            const games = this.getGames();
            const index = games.findIndex(game => game.id === id);
            
            if (index !== -1) {
                games[index] = { 
                    ...games[index], 
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                saveData(KEYS.GAMES, games);
                return games[index];
            }
            
            return null;
        },

        /**
         * Delete a game
         * @param {string} id - The game ID
         * @returns {boolean} Whether the game was deleted
         */
        deleteGame: function(id) {
            const games = this.getGames();
            const filteredGames = games.filter(game => game.id !== id);
            
            if (filteredGames.length !== games.length) {
                saveData(KEYS.GAMES, filteredGames);
                return true;
            }
            
            return false;
        },

        /**
         * Get application settings
         * @returns {Object} The settings object
         */
        getSettings: function() {
            return getData(KEYS.SETTINGS, {
                defaultGameType: 11,
                theme: 'light'
            });
        },

        /**
         * Update application settings
         * @param {Object} updates - The settings to update
         * @returns {Object} The updated settings
         */
        updateSettings: function(updates) {
            const settings = this.getSettings();
            const updatedSettings = { ...settings, ...updates };
            saveData(KEYS.SETTINGS, updatedSettings);
            return updatedSettings;
        }
    };
})();
