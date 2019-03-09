/**
 * Level Manager class
 */

class LevelManager
{
    constructor(game, AM, ctx)
    {
        this.game = game;
        this.AM = AM; // Might need this later?
        this.ctx = ctx; // Might need this later?
        this.level = 2; // Indicates which level

        this.endOfLevelX = 3500; // Default values will be changed when maps are loaded
        this.endOfLevelY = 3500;

        // States for loading
        this.states = {
            loadNextLevel: true,
            levelLoaded: true
        };

        this.startOnBattleArena = false;
    }

    update()
    {
        if (this.startOnBattleArena)
        {
            console.log("Loading Arena!");
            let currentLevel = new LevelArena(this.game);
            currentLevel.loadLevel();
            this.startOnBattleArena = false;
            this.states.loadNextLevel = false;
        }
        else if (this.states.loadNextLevel)
        {
            this.states.levelLoaded = false;
            // Empty entities array except LM to prepare for new level
            this.game.entities.length = 1;
            // Makes it so gameEngine doesnt update while loading new entities
            this.states.loadNextLevel = false;

            if (this.level == 1)
            {
                console.log("Loading Arena!");
                let currentLevel = new LevelArena(this.game);
                currentLevel.loadLevel();
            } else if (this.level == 2)
            {
                console.log("Loading level One!");
                let currentLevel = new LevelTwo(this.game);
                currentLevel.loadLevel();
            } else if (this.level == 3)
            {
                console.log("Loading level Two!");
                let currentLevel = new LevelThree(this.game);
                currentLevel.loadLevel();
            } else if (this.level == 4)
            {
                console.log("Loading level Three!");
                let currentLevel = new LevelFour(this.game);
                currentLevel.loadLevel();
            }
            this.states.levelLoaded = true;
        } else
        {

        }
        this.game.blink.level = this.level;
    }
    draw(ctx) { }
}