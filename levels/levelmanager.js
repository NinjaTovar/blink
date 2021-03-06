/**
 * Level Manager class
 */

class LevelManager {
    constructor(game, AM, ctx) {
        this.game = game;
        this.AM = AM; // Might need this later?
        this.ctx = ctx; // Might need this later?
        this.level = 2; // Indicates which level
        this.currentLevel = 2;

        this.endOfLevelX = 3500; // Default values will be changed when maps are loaded
        this.endOfLevelY = 3500;

        // States for loading
        this.states = {
            loadNextLevel: true,
            levelLoaded: true,
            loadCurrentLevel: false,
        };

        this.startOnBattleArena = false;
    }

    update() {
        if (this.startOnBattleArena) {
            console.log("Loading Arena!");
            let currentLevel = new LevelArena(this.game);
            currentLevel.loadLevel();
            this.startOnBattleArena = false;
            this.states.loadNextLevel = false;
        } else if (this.states.loadNextLevel) {
            this.states.levelLoaded = false;
            // Empty entities array except LM to prepare for new level
            this.game.entities.length = 1;
            // Makes it so gameEngine doesnt update while loading new entities
            this.states.loadNextLevel = false;

            if (this.level === 1) {
                console.log("Loading Arena!");
                let currentLevel = new LevelArena(this.game);
                currentLevel.loadLevel();
                this.currentLevel = 1;
                this.level = 2;
            } else if (this.level === 2) {
                console.log("Loading level One!");
                let currentLevel = new LevelTwo(this.game);
                currentLevel.loadLevel();
                this.currentLevel = 2;
                this.level = 3;
            } else if (this.level === 3) {
                console.log("Loading level Two!");
                let currentLevel = new LevelThree(this.game);
                currentLevel.loadLevel();
                this.currentLevel = 3;
                this.level = 4;
            } else if (this.level === 4) {
                console.log("Loading level Three!");
                let currentLevel = new LevelFour(this.game);
                currentLevel.loadLevel();
                this.currentLevel = 4;
                this.level = 5;
            }
            this.states.levelLoaded = true;
            this.states.loadNextLevel = false;

            // Change Music on level change
            if (this.game.blink !== undefined) {
                this.game.blink.changeMusic.click();
            }

        } else {

        }

        // Right now the level numbers are jacked up. This lets blink know what levels
        // platforms he is loading, and the way the level manager is keeping track right 
        // now it is one ahead. This will get fixed soon.
        this.game.blink.level = this.currentLevel;
    }
    draw(ctx) {}
}