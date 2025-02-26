/**
 * Main application entry point
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data service
    DataService.init();
    
    // Initialize UI controller
    UIController.init();
    
    // If no players exist, create some sample players
    const players = PlayersService.getAllPlayers();
    if (players.length === 0) {
        console.log('Creating sample players...');
        createSampleData();
    }
    
    // Update all player stats to ensure consistency
    PlayersService.updateAllStats();
    
    console.log('Ping Pong Tracker initialized successfully!');
});

/**
 * Create sample data for demonstration purposes
 */
function createSampleData() {
    // Add sample players
    const samplePlayers = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' },
        { name: 'Charlie', email: 'charlie@example.com' },
        { name: 'Diana', email: 'diana@example.com' }
    ];
    
    const players = samplePlayers.map(player => PlayersService.createPlayer(player));
    
    // Add sample games
    const sampleGames = [
        { 
            player1: players[0].id,
            player2: players[1].id,
            score1: 11,
            score2: 5,
            pointsLimit: 11
        },
        { 
            player1: players[2].id,
            player2: players[3].id,
            score1: 9,
            score2: 11,
            pointsLimit: 11
        },
        { 
            player1: players[0].id,
            player2: players[2].id,
            score1: 21,
            score2: 19,
            pointsLimit: 21
        },
        { 
            player1: players[1].id,
            player2: players[3].id,
            score1: 11,
            score2: 7,
            pointsLimit: 11
        },
        { 
            player1: players[0].id,
            player2: players[3].id,
            score1: 8,
            score2: 11,
            pointsLimit: 11
        }
    ];
    
    sampleGames.forEach(game => {
        // Start game
        const newGame = GamesService.startGame(game);
        
        // Update scores
        GamesService.updateScore(1, game.score1);
        GamesService.updateScore(2, game.score2);
        
        // End game
        GamesService.endGame(true);
    });
}
